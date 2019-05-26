import React, { Component } from 'react'
import { AppRegistry, View, AsyncStorage, StatusBar, Animated } from 'react-native'
import { MainRouterAlreadyUsed, MainRouterFirstUSe } from './router/MainRouter.js'
import { AppLoading, Asset, Font, Constants } from 'expo'
import * as helper from './functions/Main'
import { FontAwesome } from '@expo/vector-icons'
import { Wiki } from './functions/Wiki'

export default class NicaraguAzul extends Component {
  constructor() {
    super()
    console.disableYellowBox = true
    this.state = {
      firstTimeUse: null,
      loading: true,
      isDevice: null,
      animatedText: new Animated.Value(0)
    }
  }

  firstTimeUse = async () => {
    let treasuresTotal = this.treasuresTotal()
    // this.checkForValidTreasures()
    await AsyncStorage.setItem('Wiki', JSON.stringify(Wiki))
    await AsyncStorage.setItem('treasuresTotal', treasuresTotal.toString())
    await AsyncStorage.setItem('minTreasureAmountToAmbassador', "30")
    if (Constants.isDevice) { helper.updateDb() }
    await this._loadAssetsAsync()
    let firstTimeUse = await AsyncStorage.getItem('firstTimeUse')
    if(!firstTimeUse){
      await helper.createLocalUser()
      this.setState({ firstTimeUse: firstTimeUse, loading: false, isDevice: Constants.isDevice })
    }
    else{
      this.setState({ firstTimeUse: firstTimeUse, loading: false, isDevice: Constants.isDevice })
    }

  }

  checkForValidTreasures = async ()=>{
    await helper.turnSequential()
    let user = JSON.parse(await AsyncStorage.getItem('user'))
    console.log(user.treasures)
    if(user && user.treasures['0'] !== "none"){
      let validTrasures = this.treasuresNames()
      Object.entries(user.treasures).forEach(async (u, i)=>{
        if (!validTrasures.includes(u[1].title)){
          delete user.treasures[i]
          await helper.turnSequential()
          await AsyncStorage.setItem('user', JSON.stringify(user))
          await helper.updateUserInfo(user.uid, user.treasures, user.embajador, user.embajadorDate)
        }
      })
    }
  }

  treasuresNames = ()=>{
    let validTreasureList = []
    Object.entries(Wiki).forEach((u,i)=>{
      Object.entries(u[1]).forEach((u, i)=>{
        Object.entries(u[1]).forEach((u, i)=>{
          let isTreasure = false
          if(u[0] == "Biodiversidad"){
            Object.entries(u[1]).forEach((u, i)=>{
              Object.entries(u[1]).forEach((u, i)=>{
                if('treasure' in u[1]){
                  if(u[1].treasure === true){
                    isTreasure = true
                  }
                }
                if('headerTitle' in u[1]){
                  if(isTreasure){
                    validTreasureList.push(u[1].headerTitle)
                    isTreasure = false
                  }
                }
              })
            })
          }
          if(u[0] == "Tortugas"){
            Object.entries(u[1]).forEach((u, i)=>{
              Object.entries(u[1]).forEach((u, i)=>{
                if('treasure' in u[1]){
                  if(u[1].treasure === true){
                    isTreasure = true
                  }
                }
                if('headerTitle' in u[1]){
                  if(isTreasure){
                    validTreasureList.push(u[1].headerTitle)
                    isTreasure = false
                  }
                }
              })
            })
          }
          else{
            Object.entries(u[1]).forEach((u, i)=>{
              if('treasure' in u[1]){
                if(u[1].treasure === true){
                  isTreasure = true
                }
              }
              if('headerTitle' in u[1]){
                if(isTreasure){
                  validTreasureList.push(u[1].headerTitle)
                  isTreasure = false
                }
              }
            })
          }
        })
      })
    })
    return validTreasureList
  }

  treasuresTotal = ()=>{
    let treasuresTotal = 0
    Object.entries(Wiki).forEach((u,i)=>{
      Object.entries(u[1]).forEach((u, i)=>{
        Object.entries(u[1]).forEach((u, i)=>{
          if(u[0] == "Biodiversidad"){
            Object.entries(u[1]).forEach((u, i)=>{
              Object.entries(u[1]).forEach((u, i)=>{
                if('treasure' in u[1] && u[1].treasure === true){
                  treasuresTotal++
                }
              })
            })
          }
          else if(u[0] == "Tortugas"){
            Object.entries(u[1]).forEach((u, i)=>{
              Object.entries(u[1]).forEach((u, i)=>{
                if('treasure' in u[1] && u[1].treasure === true){
                  treasuresTotal++
                }
              })
            })
          }
          else{
            Object.entries(u[1]).forEach((u, i)=>{
              if('treasure' in u[1] && u[1].treasure === true){
                treasuresTotal++
              }
            })
          }
        })
      })
    })
    return treasuresTotal
  }

  cacheImages = (images)=> {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image)
      } else {
        return Asset.fromModule(image).downloadAsync()
      }
    })
  }

  cacheFonts = (fonts)=> {
    return fonts.map(font => Font.loadAsync(font))
  }

  _loadAssetsAsync = async ()=> {
    const imageAssets = await this.cacheImages([
      require('./assets/anzuelo.png'),
      require('./assets/background.jpg'),
      require('./assets/bottle.png'),
      require('./assets/calendario.png'),
      require('./assets/croquis.png'),
      require('./assets/icon.png'),
      require('./assets/iconSmall.png'),
      require('./assets/wikiassets/Aguadulce.png'),
      require('./assets/wikiassets/Aguadulce-nubes.png'),
      require('./assets/wikiassets/Atlantico.png'),
      require('./assets/wikiassets/Atlantico-nubes.png'),
      require('./assets/wikiassets/Introductorio.png'),
      require('./assets/wikiassets/Introductorio-nubes.png'),
      require('./assets/wikiassets/Pacifico.png'),
      require('./assets/wikiassets/Pacifico-nubes.png'),
      require('./assets/wikiassets/Reflexion.png'),
      require('./assets/wikiassets/Reflexion-nubes.png'),
      require('./assets/Nic-azul.jpg'),
      require('./assets/Nic-azul2.jpg'),
    ])

    await Font.loadAsync(FontAwesome.font)

    await Font.loadAsync({
      'IndieFlower': require('./assets/fonts/Roboto-Regular.ttf'),
      'RobotoThin': require('./assets/fonts/Roboto-Thin.ttf'),
    })

  }

  AnimateComponents = ()=>{
    Animated.timing(this.state.animatedText, {
      toValue: 1,
      duration: 800
    }).start()
  }

  render() {
    if (this.state.loading /*|| !(this.state.isDevice)*/) {
      return (
        <AppLoading
          startAsync={() => {
            this.firstTimeUse()
          }}
          onFinish={() => {}}
        />
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        {(!this.state.firstTimeUse) ? <MainRouterFirstUSe /> : <MainRouterAlreadyUsed />}
      </View>
    )
  }
}

AppRegistry.registerComponent('NicaraguAzul', () => NicaraguAzul)
