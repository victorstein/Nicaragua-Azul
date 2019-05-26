import React, { Component } from 'react'
import { View, Text, AsyncStorage, Alert } from 'react-native'
import { DangerZone, ScreenOrientation, BarCodeScanner, Permissions } from 'expo'
import { Icon, Button } from 'react-native-elements'
import * as helper from '../functions/Main'

const { Lottie } = DangerZone

export default class QRScanner extends Component {
  constructor () {
    super()
    this.state = {
      read: this._handleBarCodeRead,
      wiki: null,
      hasCameraPermission: null
    }
  }

  static navigationOptions ({ navigation }) {
    return {
      headerTransparent: true,
      headerLeft:
  <Icon
    name='arrow-back'
    color='#0085DE'
    size={40}
    underlayColor='transparent'
    onPress={() => {
      navigation.goBack()
    }}
  />,
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0
      }
    }
  }

  enambleCameraReading () {
    this.setState({ read: this._handleBarCodeRead })
  }

  async componentDidMount () {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP)
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })

    this.props.navigation.addListener('didFocus', async () => this.enambleCameraReading())
    let data = JSON.parse(await AsyncStorage.getItem('Wiki'))
    this.setState({ wiki: data })
  }

  render () {
    const { hasCameraPermission } = this.state
  
    if (hasCameraPermission === null) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Lottie
              ref={(animation) => {
                if (animation) {
                  animation.play()
                }
              }}
              hardwareAccelerationAndroid
              loop
              source={require('../assets/animations/loader.json')}
              resizeMode='contain'
            />
          </View>
        </View>
      )
    } else if (hasCameraPermission === false) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Lottie
              ref={(animation) => {
                if (animation) { animation.play() }
              }}
              style={{
                height: helper.height / 3,
                width: helper.width / 1.5
              }}
              hardwareAccelerationAndroid
              loop
              source={require('../assets/animations/camerapermission.json')}
              resizeMode='contain'
            />
            <Text style={{ maxWidth: '80%', fontSize: 18, textAlign: 'center', marginBottom: 20 }} >
              Para escanear los codigos QR necesitamos acceso a la camara
            </Text>
            <Button
              raised
              icon={{ name: 'camera', type: 'font-awesome' }}
              title='Solicitar Permiso'
              rounded
              backgroundColor='#0085DE'
              containerViewStyle={{ borderRadius: 50 }}
              onPress={async () => {
                const { status } = await Permissions.askAsync(Permissions.CAMERA)
                this.setState({ hasCameraPermission: status === 'granted' })
              }}
            />
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <BarCodeScanner
            onBarCodeRead={this.state.read}
            type='back'
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            style={{ height: helper.height, width: helper.width }}
          >
            <View style={{ flex: 1 }}>
              <Lottie
                ref={(animation) => {
                  this.animation = animation
                }}
                loop={false}
                hardwareAccelerationAndroid
                source={require('../assets/animations/camera.json')}
                resizeMode='cover'
              />
            </View>
          </BarCodeScanner>
        </View>
      )
    }
  }

  async _handleBarCodeRead ({ data }) {
    this.setState({ read: undefined })
    this.animation.play(70, 100)
    await setTimeout(() => {
      this.animation.reset()
      try {
        let lecture = JSON.parse(data)
        let father = lecture.F
        let child = lecture.C
        let childochild = lecture.CC
        let childochildochild = (lecture.CCC) ? lecture.CCC : null
        let wikiData = (childochildochild) ? this.state.wiki[father][child][childochild][childochildochild] : this.state.wiki[father][child][childochild]
        this.props.navigation.navigate('RenderView', { data: wikiData, lecture: lecture })
      } catch (e) {
        Alert.alert(
          'Advertencia',
          'El código es invalido, intenta nuevamente.',
          [
            {
              text: 'OK',
              onPress: async () => {
                this.setState({ read: this._handleBarCodeRead })
              }
            }
          ],
          { cancelable: false }
        )
      }
    }, 500)
  }
}
