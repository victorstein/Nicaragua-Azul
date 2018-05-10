import React, { Component } from 'react';
import { View, Alert, Image, AsyncStorage, Animated, Text, TouchableOpacity, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import { DangerZone } from 'expo';
import * as helper from '../functions/Main';
const { Lottie } = DangerZone;

export default class Main extends Component {

  static navigationOptions =   {
      header: null,
  }

  constructor(){
    super();
    this.state = {
      percentageCompleted: new Animated.Value(helper.height * -0.7),
      filler: new Animated.Value(-helper.height),
      completionRate: 0,
      profileMenuVisible: false,
      isUserLoggedIn: null
    }
  }

  renderLogout = ()=>{
    return(
      <TouchableOpacity
        style={{ width: '100%', flexDirection: 'row' }}
        onPress={async ()=>{
          Alert.alert(
            'Advertencia',
            'Si cierras sesión, los datos asociados a esta cuenta serán removidos del dispositivo, para recuperarlos puedes volver a iniciar sesión, ¿deseas continuar?',
            [
              {text: 'Cancelar', onPress: () => { }, style: 'cancel'},
              {text: 'Aceptar', onPress: async () => {
                await helper.logout();
                this.checkUserLoginStatus();
                this.setState({ isUserLoggedIn: false, profileMenuVisible: false })
              }},
            ],
            { cancelable: false }
          )
        }}
      >
        <View style={{ width: '32%', alignItems: 'center' }}>
          <Icon
            name="sign-out"
            color="#fff"
            type="font-awesome"
            size={40}
            iconStyle={{ color: '#C5C5C5' }}
            containerStyle={{
              marginVertical: 10
            }}
          />
        </View>
        <View style={{ width: '68%', alignItems: 'flex-start', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#C5C5C5' }}>
          <Text style={{ opacity: 0.6 }}>
            Cerrar Sesión
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  checkUserLoginStatus = async ()=>{
    let user = JSON.parse(await AsyncStorage.getItem("user"));
    this.setState({
      isUserLoggedIn: (user.provider) ? true : false
    })

    this.animation.play();
    let maxTreasure = await AsyncStorage.getItem("treasuresTotal");
    let percentage;
    if (user.treasures["0"] == "none"){
      percentage = 0;
      this.setState({
        completionRate: 0
      });
    }
    else{
      percentage = (Object.entries(user.treasures).length/maxTreasure) * 100;
      this.setState({
        completionRate: Math.round(percentage)
      });
    }

    let max = helper.height * 0.2;
    let min = helper.height * 0.7;
    let minFiller = helper.height;
    let maxFiller = (helper.height/2);

    let rangeFiller = minFiller - maxFiller;
    let range = min + max;

    percentageFiller = percentage*rangeFiller/100;
    percentageFiller = (minFiller * -1) + percentageFiller;
    percentage = percentage*range/100;
    percentage = (min * -1) + percentage;

    Animated.timing(this.state.percentageCompleted, {
      toValue: percentage,
      duration: 5000
    }).start();
    Animated.timing(this.state.filler, {
      toValue: percentageFiller,
      duration: 5000
    }).start();
  }

  async componentDidMount(){
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
    this.props.navigation.addListener('didFocus', async () => this.checkUserLoginStatus())
  }

  profileMenu = ()=>{
    return(
      <View style={{
        width: helper.width/1.8,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 100,
        left: 15,
        zIndex: 11,
        elevation: 5,
      }}>
        <TouchableOpacity
          style={{ width: '100%', flexDirection: 'row' }}
          onPress={()=>{
            this.setState({ profileMenuVisible: false });
            this.props.navigation.navigate('MyProfile')
          }}
        >
          <View style={{ width: '32%', alignItems: 'center' }}>
            <Icon
              name="user-circle"
              color="#fff"
              type="font-awesome"
              size={40}
              iconStyle={{ color: '#C5C5C5' }}
              containerStyle={{
                marginVertical: 10
              }}
            />
          </View>
          <View style={{ width: '68%', alignItems: 'flex-start', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#C5C5C5' }}>
            <Text style={{ opacity: 0.6 }}>
              Mi Perfil
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: '100%', flexDirection: 'row',}}
          onPress={()=>{
            this.setState({ profileMenuVisible: false });
            this.props.navigation.navigate('MyTreasures');
          }}
        >
          <View style={{ width: '32%', alignItems: 'flex-start' }}>
            <Image
              fadeDuration={0}
              source={require('../assets/bottle.png')}
              style={{
                height: 40,
                width: 40,
                margin: 15,
              }}
            />
          </View>
          <View style={{ width: '68%', alignItems: 'flex-start', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#C5C5C5' }}>
            <Text style={{ opacity: 0.6 }}>
              Mis Tesoros
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: '100%', flexDirection: 'row',}}
          onPress={()=>{
            this.setState({ profileMenuVisible: false });
            this.props.navigation.navigate('Ambassadors');
          }}
        >
          <View style={{ width: '32%', alignItems: 'flex-start' }}>
            <Image
              fadeDuration={0}
              source={require('../assets/medalla.png')}
              style={{
                height: 40,
                width: 40,
                margin: 15
              }}
            />
          </View>
          <View style={{ width: '68%', alignItems: 'flex-start', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#C5C5C5' }}>
            <Text style={{ opacity: 0.6 }}>
              Embajadores
            </Text>
          </View>
        </TouchableOpacity>
        {
          (this.state.isUserLoggedIn) ? this.renderLogout() : null
        }
      </View>
    )
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({
            profileMenuVisible: false
          })
        }}
      >
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
          source={require('../assets/background.jpg')}
        >
          <View style={{
            position: 'absolute',
            top: 32,
            left: 15,
            zIndex: 10,
          }}>
            <Icon
              name="user-circle"
              color="#fff"
              type="font-awesome"
              size={53}
              iconStyle={{ color: '#0085DE' }}
              containerStyle={{
                backgroundColor: 'white',
                padding: 2,
                borderRadius: 50,
                marginBottom: 10,
              }}
              onPress={() => {
                this.setState(previousState => {
                  return { profileMenuVisible: !previousState.profileMenuVisible };
                });
              }}
            />
            <Text style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.8)',
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: {width: -1, height: 1},
              textShadowRadius: 10,
              fontSize: 16,
              fontFamily: 'IndieFlower'
            }}>
              Perfil
            </Text>
          </View>

          {
            (this.state.profileMenuVisible) ? this.profileMenu() : null
          }

          <View style={{
            position: 'absolute',
            top: 15,
            left: (helper.width/2)-50,
            zIndex: 10,
            alignItems: 'center'
          }}>
            <TouchableOpacity
              onPress={()=>{
                this.props.navigation.navigate("Wiki")
              }}
              style={{ alignItems: 'center' }}
            >
              <View style={{
                backgroundColor:'white',
                padding: 2.5,
                borderRadius: 58,
                width: 58,
                height: 58,
                marginTop: 17,
                marginBottom: 10,
              }}>
              <Image
                fadeDuration={0}
                source={require('../assets/anzuelo.png')}
                style={{
                  width: 53,
                  height: 53,
                }}
                resizeMode="contain"
              />
              </View>
              <Text style={{
                textAlign: 'center',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)',
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10,
                fontSize: 16,
                fontFamily: 'IndieFlower'
              }}>
                Enciclopedia
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{
            position: 'absolute',
            top: 15,
            right: 15,
            zIndex: 10,
          }}>
            <TouchableOpacity
              onPress={()=>{
                this.props.navigation.navigate("Calendar")
              }}
              style={{ alignItems: 'center' }}
            >
              <View style={{
                backgroundColor:'white',
                padding: 2.5,
                borderRadius: 58,
                width: 58,
                height: 58,
                marginTop: 17,
                marginBottom: 10,
              }}>
                <Image
                  fadeDuration={0}
                  source={require('../assets/calendario.png')}
                  style={{
                    width: 53,
                    height: 53,
                  }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{
                textAlign: 'center',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)',
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10,
                fontSize: 16,
                fontFamily: 'IndieFlower'
              }}>
                Calendario
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, justifyContent:'center', alignItems: 'center', zIndex: 3 }}
          >
            <Image
              fadeDuration={0}
              source={require('../assets/croquis.png')}
              resizeMode="contain"
              style={{ maxWidth: '75%', maxHeight: '50%', opacity: 0.9, zIndex: 3 }}
            />
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontWeight: '100',
                  textAlign: 'center',
                  fontSize: 30,
                  marginTop: -20,
                  zIndex: 3,
                  color: 'rgba(255,255,255,0.8)',
                  textShadowColor: 'rgba(0, 0, 0, 0.8)',
                  textShadowOffset: {width: -1, height: 1},
                  textShadowRadius: 10
                }}
              >{this.state.completionRate}%</Text>
            </View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                zIndex: 3,
                color: 'rgba(255,255,255,0.8)',
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10,
                fontFamily: 'IndieFlower'
              }}
            >
              Completado
            </Text>
          </View>
          <Icon
            name="handshake-o"
            color="#FFF"
            type="font-awesome"
            reverse
            raised
            size={30}
            iconStyle={{ color: '#388E3C' }}
            containerStyle={{ position: 'absolute', bottom: 10, left: 15, zIndex: 3 }}
            onPress={() => {
              this.props.navigation.navigate('Sponsors');
            }}
          />
          <Icon
            name="camera"
            type="font-awesome"
            color="#FFF"
            reverse
            raised
            size={30}
            iconStyle={{ color: '#0085DE' }}
            containerStyle={{ position: 'absolute', bottom: 10, right: 15, zIndex: 3 }}
            onPress={() => {
              this.props.navigation.navigate('QRScanner');
            }}
          />
          <Animated.View
            style={{
              height: helper.height,
              width: helper.width,
              zIndex: 2,
              position: 'absolute',
              bottom: this.state.percentageCompleted,
            }}
          >
            <Lottie
              ref={(animation) => {
                this.animation = animation;
              }}
              loop={true}
              source={require('../assets/animations/water.json')}
              resizeMode="cover"
            />
          </Animated.View>
          <Animated.View
            style={{
              height: helper.height,
              width: helper.width,
              zIndex: 1,
              position: 'absolute',
              bottom: this.state.filler,
              backgroundColor: "#00A0CE"
            }}
          />
        </ImageBackground>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}
