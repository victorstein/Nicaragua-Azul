import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as helper from '../functions/Main';
import { DangerZone, ScreenOrientation, Constants } from 'expo';
const { Lottie } = DangerZone;

export default class Ambassadors extends Component {

  constructor(){
    super();
    this.state = {
      Ambassadors: null
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
      headerTitle: 'Embajadores',
      headerStyle: { backgroundColor: '#006DDB', height: 70, marginVertical: -Constants.statusBarHeight },
      headerTintColor: 'white'
    }
  }

  async componentDidMount(){
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
    let data = await helper.getUsersDataBase();
    data = JSON.stringify(data);
    data = JSON.parse(data);
    dataArray=[];
    if(data){
      Object.entries(data).forEach((u, i)=>{
        if(u[1].embajador === true){
          dataArray.push(u[1]);
        }
      })
    }
    dataArray = dataArray.reverse();
    this.setState({ Ambassadors: dataArray })
  }

  generateList = ()=>{
    if(this.state.Ambassadors){
      return(
        <FlatList
          data={this.state.Ambassadors}
          renderItem={({item}) => {
            return(
              <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <View style={{ width: helper.width/4, justifyContent: 'center', alignItems: 'center' }}>
                  <Avatar
                    rounded
                    source={{ uri: item.picture }}
                  />
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#C5C5C5', flexDirection: 'row', paddingBottom: 10 }}>
                  <View style={{ width: helper.width/2, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  </View>
                  <View style={{ width: helper.width/4 }}>
                    <Image
                      source={require('../assets/medalla.png')}
                      style={{ height: 50, width: 50, }}
                    />
                  </View>
                </View>
              </View>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      )
    }
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
            source={require('../assets/animations/loader.json')}
            resizeMode="contain"
          />
      </View>
    )
  }

  render(){
    return(
      <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
        <View style={{ backgroundColor: '#0085DE', height: helper.height/7, alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text style={{ paddingLeft: 30, fontSize: 20, fontWeight: '200', color: '#fff' }}>Lista de</Text>
          <Text style={{ paddingLeft: 30, fontSize: 20, fontWeight: '500', color: '#fff' }}>Embajadores azules</Text>
        </View>
        <View style={{ flex: 1 }}>
          {
            (this.state.Ambassadors) ? this.generateList() : this.loading()
          }
        </View>
      </View>
    )
  }
}
