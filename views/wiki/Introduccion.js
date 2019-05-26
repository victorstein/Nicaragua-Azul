import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  AsyncStorage,
  TouchableOpacity,
  Image
} from 'react-native';
import { Icon } from 'react-native-elements';
import { DangerZone, ScreenOrientation, Constants } from 'expo';
import * as helper from '../../functions/Main';
const { Lottie } = DangerZone;

export default class Introduccion extends Component {

  constructor(){
    super();
    this.state = {
      wiki: null
    }
  }

  static navigationOptions ({ navigation }) {
    return {
      headerRight:
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            borderRadius: 100/2,
            backgroundColor: 'white',
            marginHorizontal: 15,
            elevation: 10
          }}
          onPress={()=>{
            navigation.navigate('Main');
          }}
        >
          <Image source={require('../../assets/iconSmall.png')} style={{ width: 50, height: 50, }} />
        </TouchableOpacity>
      ,
      headerLeft:
      <Icon
        name='arrow-back'
        color='#fff'
        size={30}
        containerStyle={{
          marginLeft: 10
        }}
        underlayColor='transparent'
        onPress={()=>{
          navigation.goBack(null)
        }}
      />,
      headerTitle: "Introducción",
      headerStyle: { backgroundColor: "#00BCD5", height: 70, margin: 0, marginTop: -Constants.statusBarHeight },
      headerTintColor: "white",
    }
  }

  async componentDidMount () {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
    let data = JSON.parse(await AsyncStorage.getItem('Wiki'));
    let wiki = [];
    Object.entries(data.Introduccion).forEach((u, i)=>{
      let C = u[0];
      Object.entries(u[1]).forEach((uc, ic)=>{
        wiki.push({
          title: uc[1][1].headerTitle,
          panel: uc[1][3].panel,
          data: uc[1],
          lecture: {
            F: 'Introduccion',
            C: C,
            CC: uc[0]
          }
        })
      })
    });
    this.setState({ wiki });
  }

  renderContent = ()=>{
    return(
      <FlatList
        data={this.state.wiki}
        style={{ marginTop: 10 }}
        renderItem={({item}) => {
          return(
            <TouchableOpacity
              style={{ flexDirection: 'row', width: '100%', height: helper.height/8 }}
              onPress={()=>{
                this.props.navigation.navigate('RenderView', { data: item.data, lecture: item.lecture })
              }}
            >
              <View style={{ width: '80%', justifyContent: 'center', paddingLeft: 30 }}>
                <Text style={{ fontSize: 18, }}>{item.title}</Text>
                <Text style={{ fontSize: 14, color: '#BCBEBF' }}>{item.panel}</Text>
              </View>
              <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                <Icon
                  name='info'
                  color='#BCBEBF'
                />
              </View>
            </TouchableOpacity>
          )
        }}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={()=>{
          return(
            <View style={{ height: 1, width: helper.width, backgroundColor: '#BCBEBF' }} />
          )
        }}
      />
    )
  }

  loading = ()=>{
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Lottie
            ref={(animation) => {
              (animation) ? animation.play() : null
            }}
            hardwareAccelerationAndroid
            loop={true}
            source={require('../../assets/animations/loader.json')}
            resizeMode="contain"
          />
      </View>
    )
  }

  render(){
    return(
      <View style={{ flex: 1 }}>
        {
          (this.state.wiki) ? this.renderContent() : this.loading()
        }
      </View>
    )
  }
}
