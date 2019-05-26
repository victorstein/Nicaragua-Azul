import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import * as helper from '../functions/Main'
import { Constants } from 'expo'

export default class Sponsors extends Component {
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
      headerTitle: 'Patrocinadores',
      headerStyle: { backgroundColor: '#006DDB', height: 70, marginVertical: -Constants.statusBarHeight },
      headerTintColor: 'white'
    }
  }

  render () {
    return (
      <ScrollView
        contentContainerStyle={{ marginTop: Constants.statusBarHeight }}
      >
        <Text
          style={{
            textAlign: 'center',
            paddingHorizontal: 20,
            fontSize: 18,
            color: '#696969',
            marginVertical: 20,
            fontWeight: '400'
          }}
        >
          Agradecemos a nuestros patrocinadores por colaborar con este proyecto
        </Text>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Image
            style={{ width: helper.width }}
            resizeMode='contain'
            source={require('../assets/sponsors/fundacion-uno.png')}
          />
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 2.5, height: helper.height / 5, marginHorizontal: 8 }}
            source={require('../assets/sponsors/cosude.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 2.5, height: helper.height / 5, marginHorizontal: 8 }}
            source={require('../assets/sponsors/ibw.png')}
          />
        </View>
        <View style={{ flexDirection: 'row', width: helper.width, paddingHorizontal: '7%' }}>
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/hemco.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/fauna.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/ficohsa.png')}
          />
        </View>
        <View style={{ flexDirection: 'row', width: helper.width, paddingHorizontal: '7%' }}>
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/sahlman.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/morgan.jpg')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/desminic.png')}
          />
        </View>
        <View style={{ flexDirection: 'row', width: helper.width, paddingHorizontal: '7%' }}>
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/CAF.png')}
          />
          <View
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text>MAR AZUL</Text>
          </View>
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/sinsa.png')}
          />
        </View>
        <View style={{ flexDirection: 'row', width: helper.width, paddingHorizontal: '7%' }}>
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/garden.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/crea.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/epn.png')}
          />
        </View>
        <View style={{ flexDirection: 'row', width: helper.width, paddingHorizontal: '7%', marginBottom: 20 }}>
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/canatur.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/fundenic.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/lotinica.gif')}
          />
        </View>
        <View style={{ flexDirection: 'row', width: helper.width, paddingHorizontal: '7%', marginBottom: 20 }}>
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/va.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/be.png')}
          />
          <Image
            resizeMode='contain'
            style={{ width: helper.width / 4, height: helper.height / 5, marginHorizontal: 5 }}
            source={require('../assets/sponsors/di.jpg')}
          />
        </View>
      </ScrollView>
    )
  }
}
