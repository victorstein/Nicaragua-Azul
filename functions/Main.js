import { Dimensions, AsyncStorage, Alert } from 'react-native';
import Expo from 'expo';
import firebase from './Firebase';

/*
HELPERS
*/

export const { height, width } = Dimensions.get('window');
/*
FIREBASE FUNCTIONS
*/
var database = firebase.database();

export const createLocalUser = async ()=>{
  let user = {
    name: null,
    uid: null,
    picture: null,
    email: null,
    provider: null,
    pushToken: null,
    treasures: {
      "0": "none"
    },
    embajador: false,
    embajadorDate: "none"
  };
  await AsyncStorage.setItem("user", JSON.stringify(user));
}

export const getUsersDataBase = async ()=>{
  return database.ref("users/").orderByChild('embajadorDate').once('value', async(snapshot)=>{
    return snapshot.val();
  })
}

export const logout = async () => {
  await firebase.auth().signOut();
  await AsyncStorage.removeItem('user');
  await createLocalUser();
};

export const existingUser = async (snapshot, response, pushToken)=>{
  let uid = response.providerData[0].uid;
  let snapsotData = JSON.stringify(snapshot);
  snapsotData = JSON.parse(snapsotData);

  let data = {
    provider: snapsotData[uid].provider,
    name: snapsotData[uid].name,
    uid: snapsotData[uid].uid,
    email: snapsotData[uid].email,
    pushToken: pushToken,
    picture: snapsotData[uid].picture,
    treasures: snapsotData[uid].treasures,
    embajador: snapsotData[uid].embajador,
    embajadorDate: snapsotData[uid].embajadorDate
  }

  await AsyncStorage.setItem('user', JSON.stringify(data));

}

export const newUser = async (response, pushToken)=>{

  let user = JSON.parse(await AsyncStorage.getItem('user'));

  database.ref("users/"+response.providerData[0].uid).set({
      provider: response.providerData[0].providerId,
      name: response.displayName,
      uid: response.providerData[0].uid,
      email: response.providerData[0].email,
      pushToken: pushToken,
      picture: 'https://graph.facebook.com/'+response.providerData[0].uid+'/picture?height=600',
      treasures: user.treasures,
      embajador: user.embajador,
      embajadorDate: user.embajadorDate
  });

  let data = {
    provider: response.providerData[0].providerId,
    name: response.displayName,
    uid: response.providerData[0].uid,
    email: response.providerData[0].email,
    pushToken: pushToken,
    picture: 'https://graph.facebook.com/'+response.providerData[0].uid+'/picture?height=600',
    treasures: user.treasures,
    embajador: user.embajador,
    embajadorDate: user.embajadorDate
  }

  await AsyncStorage.setItem('user', JSON.stringify(data));

}

export const facebook = async () => {

  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
    '446151882470542',
    { permissions: ['public_profile', 'email'] }
  );

  if (type === 'success') {

    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    let pushToken = await AsyncStorage.getItem('pushToken');

    return firebase.auth().signInWithCredential(credential).then(async (response) => {

      return database.ref("users/").once('value', async (snapshot)=>{

        if(snapshot.hasChild(response.providerData[0].uid)){

          await existingUser(snapshot, response, pushToken);
          return true

        } else{

          await newUser(response, pushToken);
          return true

        }
      });

    }).catch((error) => {
      return false
    });

  } else {

    return false

  }

}

export const updateUserInfo = (uid, treasures, embajador, embajadorDate) =>{
  database.ref("users/"+uid).update({
      treasures: treasures,
      embajador: embajador,
      embajadorDate: embajadorDate
  });
}

export const isiOS = ()=>{
  if("ios" in Expo.Constants.platform){
    return true
  }
  else{
    return false
  }
}

export const updateDb = async ()=>{
  let data = JSON.parse(await AsyncStorage.getItem('user'));
  if(data.provider !== null){
    database.ref("users/"+data.uid).set({
      provider: data.provider,
      name: data.name,
      uid: data.uid,
      email: data.email,
      pushToken: data.pushToken,
      picture: data.picture,
      treasures: data.treasures,
      embajador: data.embajador,
      embajadorDate: data.embajadorDate
    })
  }
}


export const turnSequential = async ()=>{
  let user = JSON.parse(await AsyncStorage.getItem('user'));

  Object.entries(user.treasures).forEach((u, i)=>{
    if(u[0] != i){
      Object.defineProperty(user.treasures, i,
          Object.getOwnPropertyDescriptor(user.treasures, u[0]));
      delete user.treasures[u[0]];
    }
  })

  await AsyncStorage.setItem('user', JSON.stringify(user));
}
