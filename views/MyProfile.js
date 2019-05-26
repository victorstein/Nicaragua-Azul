import React, { Component } from 'react'
import { TouchableHighlight, View, Alert, Text, Image, ImageBackground, ActivityIndicator, AsyncStorage, ScrollView, TouchableOpacity, Share } from 'react-native'
import { Avatar, Button } from 'react-native-elements'
import * as helper from '../functions/Main'
import firebase from '../functions/Firebase'
import { Constants, Facebook, ScreenOrientation } from 'expo'

export default class MyProfile extends Component {
  constructor () {
    super()
    this.state = {
      isUserLoggedIn: null,
      loading: true,
      loadingfb: false,
      data: null,
      treasuresTotal: null,
      embajador: null
    }
  }

  static navigationOptions ({ navigation }) {
    return {
      headerRight:
  <TouchableOpacity
    style={{
      width: 50,
      height: 50,
      borderRadius: 100 / 2,
      backgroundColor: 'white',
      marginHorizontal: 15,
      elevation: 10
    }}
    onPress={() => {
      navigation.navigate('Main')
    }}
  >
    <Image source={require('../assets/iconSmall.png')} style={{ width: 50, height: 50 }} />
  </TouchableOpacity>,
      headerTitle: 'Mi Perfil',
      headerStyle: { backgroundColor: '#006DDB', height: 70, marginVertical: -Constants.statusBarHeight },
      headerTintColor: 'white'
    }
  }

  async customLoginFunction () {
    this.setState({ loadingfb: true })

    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '446151882470542',
      { permissions: ['public_profile', 'email'] }
    )

    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token)
      let pushToken = await AsyncStorage.getItem('pushToken')

      firebase.auth().signInAndRetrieveDataWithCredential(credential).then(async (response) => {
        firebase.database().ref('users/').once('value', async (snapshot) => {
          if (snapshot.hasChild(response.user.providerData[0].uid)) {
            Alert.alert(
              'Advertencia',
              'Ya existe progreso asociado a esta cuenta, si continuas procederemos a reemplazar tu progreso actual por tu respaldo en linea, ¿deseas continuar?',
              [
                { text: 'Cancel', onPress: () => { this.setState({ loadingfb: false }) }, style: 'cancel' },
                { text: 'OK',
                  onPress: async () => {
                    await helper.existingUser(snapshot, response, pushToken)

                    let data = JSON.parse(await AsyncStorage.getItem('user'))
                    let treasures = await AsyncStorage.getItem('treasuresTotal')

                    await this.setState({
                      data: data,
                      isUserLoggedIn: true,
                      loadingfb: false,
                      treasuresTotal: treasures,
                      embajador: data.embajador
                    })
                  }
                }
              ],
              { cancelable: false }
            )
          } else {
            await helper.newUser(response, pushToken)
            let data = JSON.parse(await AsyncStorage.getItem('user'))
            let treasures = await AsyncStorage.getItem('treasuresTotal')
            await this.setState({
              data: data,
              isUserLoggedIn: true,
              loadingfb: false,
              treasuresTotal: treasures,
              embajador: data.embajador
            })
          }
        })
      }).catch((error) => {
        console.log(error)
        this.setState({ loadingfb: false })
      })
    } else {
      this.setState({ loadingfb: false })
    }
  }

  async componentDidMount () {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP)
    let isUserLoggedIn = JSON.parse(await AsyncStorage.getItem('user'))
    let treasuresTotal = await AsyncStorage.getItem('treasuresTotal')
    if (isUserLoggedIn.provider !== null) {
      this.setState({
        loading: false,
        isUserLoggedIn: true,
        data: isUserLoggedIn,
        treasuresTotal,
        embajador: isUserLoggedIn.embajador
      })
    } else {
      this.setState({ loading: false, isUserLoggedIn: false })
    }
  }

  renderLogin () {
    return (
      <ImageBackground
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        source={require('../assets/login-1.jpg')}>
        <View
          style={{
            height: helper.height * 0.7,
            width: helper.width,
            alignItems: 'flex-start'
          }}
        />
        <View style={{ height: helper.height * 0.3 }}>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: 10,
              fontSize: 18,
              color: 'rgba(255,255,255,1)',
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
              fontFamily: 'IndieFlower'
            }}
          >
            Iniciar sesión con
          </Text>
          <Button
            title='Facebook'
            backgroundColor='#035DB8'
            raised
            icon={{ name: 'facebook', type: 'font-awesome', color: 'white' }}
            iconContainerStyle={{ marginRight: 20 }}
            fontWeight='400'
            fontSize={18}
            buttonStyle={{ paddingLeft: 30, paddingRight: 30 }}
            loadingRight
            loading={this.state.loadingfb}
            onPress={async () => {
              await this.customLoginFunction()
            }}
          />
        </View>
      </ImageBackground>
    )
  }

  renderMedal () {
    return (
      <Image
        source={require('../assets/medalla.png')}
        style={{ height: 70, width: 70, position: 'absolute', right: (helper.width / 2) - 85, bottom: 50 }}
      />
    )
  }

  congrats () {
    return (
      <View>
        <Text style={{
          color: '#fff',
          fontSize: 16,
          paddingHorizontal: 20,
          marginVertical: 25,
          textAlign: 'center'
        }}>
          Ahora sos considerado un Embajador Azul ¡Actuemos, cambiemos y comuniquemos nuestra esperanza a todos los nicaragüenses!
        </Text>
      </View>
    )
  }

  noCongrats () {
    return (
      <View>
        <Text style={{
          color: '#fff',
          fontSize: 16,
          paddingHorizontal: 20,
          marginVertical: 25,
          textAlign: 'center'
        }}>
          'Conservamos lo que amamos, amamos lo que conocemos, conocemos lo que nos enseñan' {'\n\nJacques - Yves Cousteau'}
        </Text>
      </View>
    )
  }

  buttonStyle () {
    if (helper.isiOS()) {
      return {
        width: helper.width, alignItems: 'center', marginTop: -20, zIndex: 5
      }
    } else {
      return {
        width: helper.width, alignItems: 'center', marginTop: -20
      }
    }
  }

  renderProfile () {
    return (
      <ScrollView
        style={{
          backgroundColor: 'white'
        }}
        bounces={false}
        ref='main'
      >
        <View style={{ height: helper.height / 2.4, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
          <Avatar
            size={helper.height / 4}
            rounded
            source={{ uri: this.state.data.picture }}
            activeOpacity={0.7}
            containerStyle={{ marginTop: 40 }}
          />
          {
            (this.state.data.embajador) ? this.renderMedal() : null
          }
          <Text style={{ textAlign: 'center', fontSize: 22, marginTop: 20 }}>
            {this.state.data.name}
          </Text>
        </View>
        <View style={this.buttonStyle()}>
          <Button
            icon={{ name: 'share', color: 'white' }}
            title='Compartir'
            rounded
            borderRadius={50}
            fontWeight='600'
            fontSize={22}
            clear
            underlayColor='transparent'
            containerStyle={{ bottom: -20, zIndex: 10 }}
            titleStyle={{ paddingHorizontal: 10 }}
            buttonStyle={{ borderRadius: 30 }}
            TouchableComponent={TouchableHighlight}
            onPress={async () => {
              const url = 'https://play.google.com/store/apps/details?id=com.tfm.nicaraguazul'
              Share.share({
                message: 'Aceptá el compromiso de convertirte en un embajador azul. Descargá la app y compartí el mensaje!\n\n' + url,
                url: 'http://bam.tech',
                title: 'Compartir'
              })
            }}
          />
        </View>
        <View style={{
          height: (helper.height < 540) ? helper.height / 1.5 : helper.height / 1.8,
          backgroundColor: '#27A9FF',
          alignItems: 'center'
        }}>
          <View style={{ flexDirection: 'row', marginTop: 50 }}>
            <View>
              <View style={{ backgroundColor: 'white', height: 100, width: 100, borderRadius: 100, alignItems: 'center', justifyContent: 'center', marginHorizontal: 30 }}>
                <Text
                  style={{ color: '#37AFFF', fontSize: 24 }}
                >
                  {
                    (this.state.data.treasures['0'] === 'none')
                      ? 0
                      : Object.keys(this.state.data.treasures).length
                  }
                  /
                  {
                    this.state.treasuresTotal
                  }
                </Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 24, textAlign: 'center', marginTop: 10 }}>Tesoros</Text>
            </View>
            <View>
              <View
                style={{ backgroundColor: 'white', height: 100, width: 100, borderRadius: 100, alignItems: 'center', justifyContent: 'center', marginHorizontal: 30 }}
              >
                <Text
                  style={{ color: '#37AFFF', fontSize: 24 }}
                >
                  {
                    (this.state.data.treasures['0'] === 'none')
                      ? 0
                      : Number(Math.round((Object.keys(this.state.data.treasures).length) * 100) / this.state.treasuresTotal).toFixed(0)
                  } %
                </Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 24, textAlign: 'center', marginTop: 10 }}>Completado</Text>
            </View>
          </View>
          {
            (this.state.data.embajador) ? this.congrats() : this.noCongrats()
          }
        </View>
      </ScrollView>
    )
  }

  render () {
    if (this.state.loading === true) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' color='#035DB8' />
        </View>
      )
    }

    return (this.state.isUserLoggedIn) ? this.renderProfile() : this.renderLogin()
  }
}
