import React, { PureComponent } from 'react'
import { View, Image, Text, Animated, Easing, TouchableWithoutFeedback } from 'react-native'
import * as helper from '../../functions/Main'
import { Icon } from 'react-native-elements'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { LinearGradient, Constants, ScreenOrientation } from 'expo'

export default class Wiki extends PureComponent {
  constructor () {
    super()
    this.state = {
      options: [
        {
          key: 0,
          name: 'Introducción',
          image: require('../../assets/wikiassets/Introductorio.png'),
          clouds: require('../../assets/wikiassets/Introductorio-nubes.png'),
          route: 'Introduccion'
        }, {
          key: 1,
          name: 'Pacífico',
          image: require('../../assets/wikiassets/Pacifico.png'),
          clouds: require('../../assets/wikiassets/Pacifico-nubes.png'),
          route: 'Pacifico'
        }, {
          key: 2,
          name: 'Agua Dulce',
          image: require('../../assets/wikiassets/Aguadulce.png'),
          clouds: require('../../assets/wikiassets/Aguadulce-nubes.png'),
          route: 'AguaDulce'
        }, {
          key: 3,
          name: 'Caribe',
          image: require('../../assets/wikiassets/Atlantico.png'),
          clouds: require('../../assets/wikiassets/Atlantico-nubes.png'),
          route: 'Caribe'
        }, {
          key: 4,
          name: 'Reflexión',
          image: require('../../assets/wikiassets/Reflexion.png'),
          clouds: require('../../assets/wikiassets/Reflexion-nubes.png'),
          route: 'Reflexion'
        }
      ],
      activeSlide: 0,
      cloudAnimation: new Animated.ValueXY({ x: 20, y: 0 })
    }
  }

  static navigationOptions ({ navigation }) {
    return {
      headerLeft:
  <Icon
    name='arrow-back'
    color='#fff'
    size={40}
    containerStyle={{
      marginLeft: 10
    }}
    underlayColor='transparent'
    onPress={() => {
      navigation.goBack(null)
    }}
  />,
      headerTransparent: true,
      headerStyle: {
        elevation: 0,
        headerTitle: 'Calendario',
        borderBottomWidth: 0,
        marginTop: -Constants.statusBarHeight
      }
    }
  }

  componentDidMount () {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP)
    this.cycleAnimation()
  }

  cycleAnimation () {
    // console.log(this.state.cloudAnimation)
    Animated.sequence([
      Animated.timing(this.state.cloudAnimation, {
        toValue: { x: -20, y: 0 },
        duration: 10000,
        easing: Easing.ease
      }),
      Animated.timing(this.state.cloudAnimation, {
        toValue: { x: 20, y: 0 },
        duration: 10000,
        easing: Easing.ease
      })
    ]).start(() => {
      this.cycleAnimation()
    })
  }

  _renderItem ({ item }) {
    return (
      <TouchableWithoutFeedback style={{ flex: 1 }}
        onPress={() => {
          this.props.navigation.navigate(item.route)
        }}
      >
        <View>
          <View style={{ top: 15, height: helper.height, width: helper.width, alignItems: 'center' }}>
            <Animated.Image source={item.clouds} style={{ width: helper.width / 1.15, left: this.state.cloudAnimation.x }} resizeMode='contain' />
          </View>
          <View style={{ top: 20, position: 'absolute', height: helper.height, width: helper.width, alignItems: 'center' }}>
            <Image fadeDuration={0} source={item.image} style={{ width: helper.width / 1.15 }} resizeMode='contain' />
          </View>
          <View style={{ bottom: '12.5%', height: helper.height, width: helper.width, alignItems: 'center' }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 40,
                zIndex: 3,
                color: 'rgba(255,255,255,0.8)',
                fontFamily: 'RobotoThin'
              }}
            >
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  get pagination () {
    return (
      <Pagination
        dotsLength={this.state.options.length}
        activeDotIndex={this.state.activeSlide}
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
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

  render () {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
        <LinearGradient
          colors={['#83EAF3', '#1C8580', '#06595D']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: helper.height
          }}
        />
        <Carousel
          ref={(c) => { this._carousel = c }}
          data={this.state.options}
          renderItem={(item) => this._renderItem(item)}
          sliderWidth={helper.width}
          itemWidth={helper.width}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
          loop
        />
        { this.pagination }
      </View>
    )
  }
}
