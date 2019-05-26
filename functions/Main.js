import { Dimensions, AsyncStorage, NetInfo } from 'react-native'
import { Constants, Facebook } from 'expo'
import firebase from './Firebase'

/*
HELPERS
*/

export const { height, width } = Dimensions.get('window')
/*
FIREBASE FUNCTIONS
*/
var database = firebase.database()

export const createLocalUser = async () => {
  let user = {
    name: null,
    uid: null,
    picture: null,
    email: null,
    provider: null,
    pushToken: null,
    treasures: {
      '0': 'none'
    },
    embajador: false,
    embajadorDate: 'none'
  }
  await AsyncStorage.setItem('user', JSON.stringify(user))
}

export const getUsersDataBase = async () => {
  return database.ref('users/').orderByChild('embajadorDate').once('value', async (snapshot) => {
    return snapshot.val()
  })
}

export const logout = async () => {
  await firebase.auth().signOut()
  await AsyncStorage.removeItem('user')
  await createLocalUser()
}

export const existingUser = async (snapshot, response, pushToken) => {
  let uid = response.user.providerData[0].uid
  let snapsotData = JSON.stringify(snapshot)
  snapsotData = JSON.parse(snapsotData)

  let data = {
    provider: snapsotData[uid].provider,
    name: snapsotData[uid].name,
    uid: snapsotData[uid].uid,
    email: snapsotData[uid].email,
    pushToken: pushToken,
    picture: snapsotData[uid].picture,
    treasures: snapsotData[uid].treasures || { '0': 'none' },
    embajador: snapsotData[uid].embajador,
    embajadorDate: snapsotData[uid].embajadorDate
  }

  await AsyncStorage.setItem('user', JSON.stringify(data))
}

export const newUser = async (response, pushToken) => {
  let user = JSON.parse(await AsyncStorage.getItem('user'))

  database.ref('users/' + response.user.providerData[0].uid).set({
    provider: response.user.providerData[0].providerId,
    name: response.user.displayName,
    uid: response.user.providerData[0].uid,
    email: response.user.providerData[0].email,
    pushToken: pushToken,
    picture: 'https://graph.facebook.com/' + response.user.providerData[0].uid + '/picture?height=600',
    treasures: user.treasures || { '0': 'none' },
    embajador: user.embajador,
    embajadorDate: user.embajadorDate
  })

  let data = {
    provider: response.user.providerData[0].providerId,
    name: response.user.displayName,
    uid: response.user.providerData[0].uid,
    email: response.user.providerData[0].email,
    pushToken: pushToken,
    picture: 'https://graph.facebook.com/' + response.user.providerData[0].uid + '/picture?height=600',
    treasures: user.treasures || { '0': 'none' },
    embajador: user.embajador,
    embajadorDate: user.embajadorDate
  }

  await AsyncStorage.setItem('user', JSON.stringify(data))
}

export const facebook = async () => {
  const { type, token } = await Facebook.logInWithReadPermissionsAsync(
    '446151882470542',
    { permissions: ['public_profile', 'email'] }
  )

  if (type === 'success') {
    const credential = firebase.auth.FacebookAuthProvider.credential(token)
    let pushToken = await AsyncStorage.getItem('pushToken')

    return firebase.auth().signInWithCredential(credential).then(async (response) => {
      return database.ref('users/').once('value', async (snapshot) => {
        if (snapshot.hasChild(response.user.providerData[0].uid)) {
          await existingUser(snapshot, response, pushToken)
          return true
        } else {
          await newUser(response, pushToken)
          return true
        }
      })
    }).catch((error) => {
      console.log(error)
      return false
    })
  } else {
    return false
  }
}

export const isiOS = () => {
  if ('ios' in Constants.platform) {
    return true
  } else {
    return false
  }
}

export const updateUserInfo = (uid, treasures, embajador, embajadorDate) => {
  console.log(uid, treasures, embajador, embajadorDate)
  database.ref('users/' + uid).update({
    treasures: treasures || { '0': 'none' },
    embajador: embajador,
    embajadorDate: embajadorDate
  })
}

export const fetch_timeout = (url, timeout) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(reject, timeout, 'Request Timedout')
    try {
      let res = await fetch(url)
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}

export const updateDb = async () => {
  let data = JSON.parse(await AsyncStorage.getItem('user'))
  if (data.provider !== null) {
    database.ref('users/' + data.uid).set({
      provider: data.provider,
      name: data.name,
      uid: data.uid,
      email: data.email,
      pushToken: data.pushToken,
      picture: data.picture,
      treasures: data.treasures || { '0': 'none' },
      embajador: data.embajador,
      embajadorDate: data.embajadorDate
    })
  }
}

export const turnSequential = async () => {
  let user = JSON.parse(await AsyncStorage.getItem('user'))

  Object.entries(user.treasures).forEach((u, i) => {
    if (u[0] !== i) {
      Object.defineProperty(user.treasures, i,
        Object.getOwnPropertyDescriptor(user.treasures, u[0]))
      delete user.treasures[u[0]]
    }
  })

  await AsyncStorage.setItem('user', JSON.stringify(user))
}

export const isConnected = async () => {
  return NetInfo.getConnectionInfo().then(reachability => {
    if (reachability.type === 'unknown') {
      return new Promise(resolve => {
        const handleFirstConnectivityChangeIOS = isConnected => {
          NetInfo.isConnected.removeEventListener('connectionChange', handleFirstConnectivityChangeIOS)
          resolve(isConnected)
        }
        NetInfo.isConnected.addEventListener('connectionChange', handleFirstConnectivityChangeIOS)
      })
    }
    return (reachability.type !== 'none' && reachability.type !== 'unknown')
  })
}
