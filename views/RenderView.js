import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  AsyncStorage,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  WebView
} from 'react-native'
import { Avatar, Button, Icon } from 'react-native-elements'
import { DangerZone, WebBrowser, Constants, ScreenOrientation } from 'expo'
import * as helper from '../functions/Main'
import ImagePreview from 'react-native-image-preview'
// import VideoPlayer from '@expo/videoplayer'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import SnackBar from 'react-native-snackbar-dialog-options'

const { Lottie } = DangerZone

global.playAgain = 0

export default class RenderView extends Component {
  constructor ({ navigation }) {
    super()
    this.state = {
      data: null,
      showTreasure: false,
      visible: this.calculateimages(navigation.state.params.data),
      loading: true,
      spinner: true,
      spinnerImages: true,
      videoURL: null,
      showAmbassador: null,
      animatedText: new Animated.Value(0),
      picture: null,
      activeSlide: 0,
      AmbassadorAnimation: true,
      play: true,
      isConnected: null,
      cachedImagesArray: null,
      options: ['Informate de lo que comés', 'No comprés productos fuera de talla', 'Reducí el uso de plástico', 'No comás huevos de tortuga', 'Compartí el mensaje'],
      isStable: true
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
      headerLeft:
  <Icon
    name='arrow-back'
    color='#fff'
    size={30}
    containerStyle={{
      marginLeft: 10
    }}
    underlayColor='transparent'
    onPress={() => {
      navigation.goBack(null)
    }}
  />,
      headerTitle: `${navigation.state.params.data[1].headerTitle}`,
      headerTitleStyle: { marginLeft: 0, paddingRight: 20 },
      headerStyle: {
        backgroundColor: navigation.state.params.data[2].headerBackgroundColor,
        height: 70,
        margin: 0,
        marginTop: -Constants.statusBarHeight
      },
      headerTintColor: 'white'
    }
  }

  componentDidUpdate () {
    if (this.state.data && (this.state.showTreasure || this.state.showAmbassador) && (global.playAgain === 0)) {
      this.animation.play()
      global.playAgain++
    }
  }

  resetGlobal () {
    global.playAgain = 0
  }

  async componentDidMount () {
    this.setState({ isConnected: await helper.isConnected() })
    this.props.navigation.addListener('didFocus', async () => this.resetGlobal())
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL_BUT_UPSIDE_DOWN)
    let data = this.props.navigation.state.params.data
    if (!helper.isiOS) { await this.checkIfImageInCache(data) }

    // let videoURL = await this.getVideoURLS(data)
    // this.setState({ videoURL: videoURL })
    let user = JSON.parse(await AsyncStorage.getItem('user'))
    let picture = (user.provider) ? user.picture : 'https://cdn1.iconfinder.com/data/icons/unique-round-blue/93/user-512.png'
    this.setState({ picture: picture })
    let minTreasureAmountToAmbassador = await AsyncStorage.getItem('minTreasureAmountToAmbassador')
    let { lecture } = this.props.navigation.state.params
    if (!(this.state.isConnected)) {
      SnackBar.show('Sin conexión a internet', { tapToClose: true })
    }
    if (!(this.state.isStable)) {
      SnackBar.show('Conexión lenta o inestable', { tapToClose: true })
    }
    if (data[0].treasure === true) {
      if (user.treasures['0'] === 'none') {
        user.treasures['0'] = { title: data[1].headerTitle, panel: data[3].panel, lecture: lecture }
        await AsyncStorage.setItem('user', JSON.stringify(user))
        this.setState({ showTreasure: true, data })
        if (user.provider) {
          helper.updateUserInfo(user.uid, user.treasures, user.embajador)
        }
      } else {
        // let currentTreasures = Object.keys(user.treasures).length
        let iHaveThisTreasure = false

        Object.entries(user.treasures).forEach((u, i) => {
          if (u[1].title === data[1].headerTitle) {
            iHaveThisTreasure = true
          }
        })

        if (iHaveThisTreasure) {
          this.setState({ data: data })
        } else {
          let treasuresLength = Object.keys(user.treasures).length
          user.treasures[treasuresLength] = { title: data[1].headerTitle, panel: data[3].panel, lecture: lecture }

          if (Object.keys(user.treasures).length > minTreasureAmountToAmbassador) {
            await AsyncStorage.setItem('user', JSON.stringify(user))
            if (user.provider) { helper.updateUserInfo(user.uid, user.treasures, user.embajador, user.embajadorDate) }
            this.setState({ showTreasure: true, data: data })
          } else if (Object.keys(user.treasures).length === minTreasureAmountToAmbassador) {
            user.embajador = true
            user.embajadorDate = Date.now()
            await AsyncStorage.setItem('user', JSON.stringify(user))
            if (user.provider) { helper.updateUserInfo(user.uid, user.treasures, user.embajador, user.embajadorDate) }
            this.setState({ showAmbassador: true, data: data })
          } else {
            await AsyncStorage.setItem('user', JSON.stringify(user))
            if (user.provider) { helper.updateUserInfo(user.uid, user.treasures, user.embajador, user.embajadorDate) }
            this.setState({ showTreasure: true, data: data })
          }
        }
      }
    } else {
      this.setState({ data: data })
    }
  }

  componentWillUnmount () {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP)
    SnackBar.dismiss()
  }

  AnimateComponents () {
    Animated.timing(this.state.animatedText, {
      toValue: 1,
      duration: 800
    }).start()
  }

  async checkIfImageInCache (data) {
    let queryArray = []
    let cachedImagesArray = []
    data.map((u, i) => {
      if ('image' in u) {
        queryArray.push(u.image.url)
      } else if ('imageCarousel' in u) {
        u.imageCarousel.map((u, i) => {
          queryArray.push(u.url)
        })
      }
    })
    let cachedImages = await Image.queryCache(queryArray)
    Object.entries(cachedImages).forEach((u, i) => {
      cachedImagesArray.push(u[0])
    })
    this.setState({ cachedImagesArray })
  }

  async getVideoURLS (data) {
    this.setState({ isStable: true })
    let promises = data.map(async (u, i) => {
      if ('video' in u) {
        try {
          let video = await helper.fetch_timeout('https://www.nicaraguazul.com/wp-json/youtube/v1/links?id=' + u.video, 3000)
          video = await video.json()
          console.log('https://www.nicaraguazul.com/wp-json/youtube/v1/links?id=' + u.video)
          return video.map((u, i) => {
            if (u.quality === 'medium' && u.type.includes('video/mp4')) {
              return u.url
            }
          })
        } catch (e) {
          console.log(e)
          this.setState({ isStable: false })
        }
      }
    })
    let some = await Promise.all(promises)
    some = some.filter((u, i) => u !== undefined)
    if (some.length > 0) {
      some = some.map((u, i) => {
        return u.filter((u, i) => u !== undefined)
      })
      some = some.map((u, i) => {
        return u[0]
      })
      return some
    }
    return some
  }

  calculateimages (some) {
    let images = {}
    let imageCount = 0
    some.map((u, i) => {
      if ('image' in u) {
        imageCount++
        images['visible' + imageCount] = false
      } else if ('imageCarousel' in u) {
        u.imageCarousel.map((uc, ic) => {
          imageCount++
          images['visible' + imageCount] = false
        })
      }
    })
    return images
  }

  buildContent () {
    let cachedImagesArray = this.state.cachedImagesArray
    // let videoCounter = -1
    return this.state.data.map((u, i) => {
      switch (true) {
        case ('image' in u):
          let img = u.image.url
          if (!helper.isiOS) {
            if (cachedImagesArray.indexOf(img) > -1 || this.state.isConnected) {
              return (
                <View key={i} style={{ marginBottom: 10, marginTop: 15, paddingHorizontal: 15 }}>
                  <ImagePreview
                    visible={this.state.visible['visible' + u.image.id]}
                    source={{ uri: u.image.url }}
                    close={() => {
                      let datavisible = this.state.visible
                      datavisible['visible' + u.image.id] = false
                      this.setState({ visible: datavisible })
                    }}
                  />
                  <TouchableWithoutFeedback
                    onPress={() => {
                      let datavisible = this.state.visible
                      datavisible['visible' + u.image.id] = true
                      this.setState({ visible: datavisible })
                    }}
                  >
                    <View style={{ width: '100%', height: 180 }}>
                      <Image
                        source={{ uri: u.image.url, cache: 'force-cache' }}
                        style={{ width: '100%', height: 180 }}
                        onLoadEnd={() => this.setState({ spinnerImages: false })}
                        resizeMode={u.image.resizeMode}
                        fadeDuration={0}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.spinnerImages && (
                    <ActivityIndicator
                      style={{ position: 'absolute', top: '45%', left: '45%' }}
                      size='large'
                      color={this.props.navigation.state.params.data[2].headerBackgroundColor}
                    />
                  )}
                </View>
              )
            }
          } else if (helper.isiOS) {
            if (this.state.isConnected) {
              return (
                <View key={i} style={{ marginBottom: 10, marginTop: 15, paddingHorizontal: 15 }}>
                  <ImagePreview
                    visible={this.state.visible['visible' + u.image.id]}
                    source={{ uri: u.image.url }}
                    close={() => {
                      let datavisible = this.state.visible
                      datavisible['visible' + u.image.id] = false
                      this.setState({ visible: datavisible })
                    }}
                  />
                  <TouchableWithoutFeedback
                    onPress={() => {
                      let datavisible = this.state.visible
                      datavisible['visible' + u.image.id] = true
                      this.setState({ visible: datavisible })
                    }}
                  >
                    <View style={{ width: '100%', height: 180 }}>
                      <Image
                        source={{ uri: u.image.url, cache: 'force-cache' }}
                        style={{ width: '100%', height: 180 }}
                        onLoadEnd={() => this.setState({ spinnerImages: false })}
                        resizeMode={u.image.resizeMode}
                        fadeDuration={0}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.spinnerImages && (
                    <ActivityIndicator
                      style={{ position: 'absolute', top: '45%', left: '45%' }}
                      size='large'
                      color={this.props.navigation.state.params.data[2].headerBackgroundColor}
                    />
                  )}
                </View>
              )
            }
          } else {
            return (
              <View key={i} style={{ width: helper.width, height: 180, marginBottom: 10, marginTop: 15, paddingHorizontal: 15 }}>
                <Image
                  source={require('../assets/Nic-azul.jpg')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='cover'
                  fadeDuration={0}
                />
              </View>
            )
          }
          break
        case ('bulletpoints' in u):
          return (
            <View key={i} style={{ marginBottom: 10, paddingHorizontal: 15 }}>
              {
                u.bulletpoints.map((uc, ic) => {
                  return (
                    <Text style={{ color: '#777777', fontSize: 16, marginBottom: 5 }} key={ic + 'children'}>• {uc}</Text>
                  )
                })
              }
            </View>
          )
        case ('title' in u):
          return (
            <View key={i} style={{ marginBottom: 10, paddingHorizontal: 15 }} >
              <Text style={{ color: '#000', fontSize: 18 }}> {u.title}</Text>
            </View>
          )
        case ('moreinfo' in u):
          return (
            <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(u.moreinfo)} key={i} style={{ marginBottom: 10, paddingHorizontal: 15 }} >
              <Text style={{ color: '#007FFF', fontSize: 16, textDecorationLine: 'underline' }}>Mas información</Text>
            </TouchableOpacity>
          )
        case ('titleCenter' in u):
          return (
            <View key={i} style={{ marginBottom: 10, paddingHorizontal: 15 }} >
              <Text style={{ color: '#000', fontSize: 18, textAlign: 'center' }}> {u.titleCenter}</Text>
            </View>
          )
        case ('text' in u):
          return (
            <View key={i} style={{ marginBottom: 5, paddingHorizontal: 20 }}>
              {
                u.text.map((uc, ic) => {
                  return (
                    <Text style={{ color: '#777777', fontSize: 16, marginBottom: 5 }} key={ic + 'children'}>{uc}</Text>
                  )
                })
              }
            </View>
          )
        case ('subtitle' in u):
          return (
            <View key={i} style={{ marginBottom: 10, paddingHorizontal: 15 }}>
              <Text style={{ color: '#404040', fontSize: 17 }}> {u.subtitle}</Text>
            </View>
          )
        case ('author' in u):
          return (
            <View key={i} style={{ marginBottom: 10, paddingHorizontal: 15 }}>
              <Text style={{ color: '#404040', fontSize: 12 }}> {u.author}</Text>
            </View>
          )
        case ('separator' in u):
          return (
            <View key={i} style={{ height: 1, width: helper.width / 1.2, backgroundColor: u.separator, marginVertical: 20, alignSelf: 'center', paddingHorizontal: 15 }} />
          )
        case ('video' in u):
          // let videoData = this.state.videoURL
          // videoCounter++
          if (this.state.isConnected) {
            return (
              <WebView
                key={i}
                style={{ height: helper.height / 3, width: helper.width }}
                javaScriptEnabled
                source={{ uri: `https://www.youtube.com/embed/${u.video}?rel=0&autoplay=0&showinfo=0&controls=0&modestbranding=1` }}
              />
            )
            /*
            return (
              <View key={i} style={{ marginBottom: 10, backgroundColor: 'black' }}>
                <VideoPlayer
                  videoProps={{
                    shouldPlay: false,
                    resizeMode: Video.RESIZE_MODE_CONTAIN,
                    source: {
                      uri: videoData[videoCounter]
                    }
                  }}
                  fadeOutDuration={1000}
                  hideControlsTimerDuration={1000}
                  showFullscreenButton={false}
                  style={{ width: helper.width, height: helper.height / 3 }}
                  isPortrait
                  showControlsOnLoad
                  playFromPositionMillis={0}
                  errorCallback={(e) => {
                    console.log(e)
                  }}
                />
              </View>
            )
            */
          } else {
            return (
              <View key={i} style={{ width: helper.width, height: 180, marginBottom: 10 }}>
                <Image
                  source={require('../assets/Nic-azul.jpg')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='cover'
                  fadeDuration={0}
                />
              </View>
            )
          }
        case ('imageCarousel' in u):
          return (
            <View key={i} style={{ marginBottom: 10, paddingHorizontal: 15 }}>
              {
                u.imageCarousel.map((u, i) => {
                  return (
                    <ImagePreview
                      key={i}
                      visible={this.state.visible['visible' + u.id]}
                      source={{ uri: u.url }}
                      close={() => {
                        let datavisible = this.state.visible
                        datavisible['visible' + u.id] = false
                        this.setState({ visible: datavisible })
                      }}
                    />
                  )
                })
              }
              <FlatList
                data={u.imageCarousel}
                renderItem={({ item }) => {
                  if (!helper.isiOS) {
                    if (cachedImagesArray.indexOf(img) > -1 || this.state.isConnected) {
                      return (
                        <View>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              let datavisible = this.state.visible
                              datavisible['visible' + item.id] = true
                              this.setState({ visible: datavisible })
                            }}
                          >
                            <View style={{ borderWidth: 1, borderColor: '#696969', padding: 5, marginHorizontal: 5 }}>
                              <Image source={{ uri: item.url }} style={{ width: helper.width / 3.5, height: helper.height / 4 }} />
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                      )
                    }
                  } else if (helper.isiOS) {
                    if (this.state.isConnected) {
                      return (
                        <View>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              let datavisible = this.state.visible
                              datavisible['visible' + item.id] = true
                              this.setState({ visible: datavisible })
                            }}
                          >
                            <View style={{ borderWidth: 1, borderColor: '#696969', padding: 5, marginHorizontal: 5 }}>
                              <Image source={{ uri: item.url }} style={{ width: helper.width / 3.5, height: helper.height / 4 }} />
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                      )
                    }
                  } else {
                    return (
                      <View style={{ borderWidth: 1, borderColor: '#696969', padding: 5, marginHorizontal: 5 }}>
                        <Image source={require('../assets/Nic-azul2.jpg')} style={{ width: helper.width / 3.5, height: helper.height / 4 }} />
                      </View>
                    )
                  }
                }}
                keyExtractor={(item, index) => index.toString()}
                horizontal
              />
            </View>
          )
      }
    })
  }

  loading () {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', height: helper.height / 1.2, width: helper.width }}>
        <Lottie
          ref={(animation) => {
            if (animation) { animation.play() }
          }}
          hardwareAccelerationAndroid
          loop
          source={require('../assets/animations/loader.json')}
          resizeMode='contain'
        />
      </View>
    )
  }

  renderTreasure () {
    return (
      <View style={{
        position: 'absolute',
        backgroundColor: '#fff',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
      }}>
        <View style={{ marginTop: '-20%' }}>
          <Lottie
            ref={(animation) => {
              this.animation = animation
              // (animation) ? animation.play() : null
            }}
            hardwareAccelerationAndroid
            style={{ width: helper.width, height: 300 }}
            loop={false}
            source={require('../assets/animations/treasure.json')}
            resizeMode='cover'
          />
        </View>
        <View style={{ backgroundColor: '#00A2FF', flex: 1, alignItems: 'center', justifyContent: 'center', width: helper.width, marginTop: -50 }}>
          <Text
            style={{
              fontSize: 25,
              color: '#fff',
              marginHorizontal: '10%',
              textAlign: 'center',
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 2
            }}
          >
            ¡HAS ENCONTRADO UN TESORO!
          </Text>
          <Button
            raised
            title='Aceptar'
            rounded
            fontSize={20}
            backgroundColor='#fff'
            color='#0085DE'
            containerStyle={{ borderRadius: 50, marginTop: 30 }}
            onPress={() => {
              this.setState({ showTreasure: false })
            }}
          />
        </View>
      </View>
    )
  }

  _renderItem ({ item }) {
    return (
      <View style={{ width: helper.width }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            zIndex: 3,
            color: 'rgba(255,255,255,1)'
          }}
        >
          {item}
        </Text>
      </View>
    )
  }

  get pagination () {
    return (
      <Pagination
        dotsLength={this.state.options.length}
        activeDotIndex={this.state.activeSlide}
        containerStyle={{ backgroundColor: 'transparent' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  renderAmbassador () {
    // const AmbassadorRules = ['Informate de lo que comés', 'No comprés productos fuera de talla', 'Reducí el uso de plástico', 'No comás huevos de tortuga', 'Compartí el mensaje']
    return (
      <View style={{
        position: 'absolute',
        backgroundColor: '#fff',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
      }}>
        <View style={{ position: 'absolute', backgroundColor: 'transparent', height: helper.height, width: helper.width }}>
          <View style={{ height: helper.height / 2, alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: 20,
                color: '#27A9FF',
                marginHorizontal: '10%',
                textAlign: 'center',
                marginTop: 65
              }}
            >
              ¡AHORA SOS UN EMBAJADOR AZUL!
            </Text>
            <Avatar
              height={helper.height / 3.5}
              rounded
              source={{ uri: this.state.picture }}
              activeOpacity={0.7}
              containerStyle={{ marginTop: 35 }}
            />
          </View>
          <View style={{ height: helper.height / 2, alignItems: 'center', justifyContent: 'center', marginTop: 50 }} />
        </View>
        <View style={{ position: 'absolute' }}>
          <Lottie
            ref={(animation) => {
              this.animation = animation
              setTimeout(() => { this.AnimateComponents() }, 3000)
            }}
            hardwareAccelerationAndroid
            style={{ width: helper.width, height: helper.height }}
            loop={false}
            source={require('../assets/animations/Ambassador2.json')}
            resizeMode='cover'
          />
        </View>
        <View style={{ position: 'absolute', backgroundColor: 'transparent', height: helper.height, width: helper.width }}>
          <View style={{ height: helper.height / 2, alignItems: 'center', justifyContent: 'center' }} />
          <Animated.View style={{ height: helper.height / 2, alignItems: 'center', justifyContent: 'center', opacity: this.state.animatedText }}>
            <View style={{ marginTop: 20, marginBottom: 15 }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#fff',
                  marginHorizontal: '2%',
                  textAlign: 'center'
                }}
              >
                Tu responsabilidad y compromiso es:
              </Text>
            </View>
            <View style={{ maxHeight: '20%' }}>
              <Carousel
                ref={(c) => { this._carousel = c }}
                data={this.state.options}
                renderItem={this._renderItem}
                sliderWidth={helper.width}
                itemWidth={helper.width}
                onSnapToItem={(index) => this.setState({ activeSlide: index })}
                loop
              />
            </View>
            <View style={{ maxHeight: '27%', marginTop: '-13%' }}>
              {this.pagination}
            </View>
            <View>
              <Button
                raised
                title='Aceptar'
                rounded
                fontSize={18}
                backgroundColor='#fff'
                color='#0085DE'
                containerStyle={{ borderRadius: 50, marginBottom: 15 }}
                buttonStyle={{ maxHeight: 45 }}
                onPress={() => {
                  this.setState({ showAmbassador: false })
                }}
              />
            </View>
          </Animated.View>
        </View>
      </View>
    )
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        {
          (this.state.showTreasure) ? this.renderTreasure() : null
        }
        {
          (this.state.showAmbassador) ? this.renderAmbassador() : null
        }
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {
            (this.state.data) ? this.buildContent() : this.loading()
          }
        </ScrollView>
      </View>
    )
  }
}
