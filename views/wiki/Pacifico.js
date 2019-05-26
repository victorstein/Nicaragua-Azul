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
import { DangerZone, Constants, ScreenOrientation } from 'expo';
import * as helper from '../../functions/Main';
const { Lottie } = DangerZone;

export default class Pacifico extends Component {

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
      headerTitle: "Pacífico",
      headerStyle: { backgroundColor: "#FFC107", height: 70, margin: 0, marginTop: -Constants.statusBarHeight },
      headerTintColor: "white",
    }
  }

  async componentDidMount(){
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
    let data = JSON.parse(await AsyncStorage.getItem('Wiki'));
    let wiki = [];
    Object.entries(data.Pacifico).forEach((u, i)=>{
      let C = u[0];
      Object.entries(u[1]).forEach((u, i)=>{
        if(u[0] == "Biodiversidad"){
          let C = u[0];
          let Biodiversidad = [];
          Object.entries(u[1]).forEach((u, i)=>{
            Biodiversidad.push({
              title: u[1][1].headerTitle,
              panel: u[1][3].panel,
              data: u[1],
              lecture: {
                F: 'Pacifico',
                C: C,
                CC: u[0]
              }
            })
          })
          wiki.push({"Biodiversidad": Biodiversidad})
        }
        else if(u[0] == "Tortugas"){
          let C = u[0];
          let Tortugas = [];
          Object.entries(u[1]).forEach((u, i)=>{
            Tortugas.push({
              title: u[1][1].headerTitle,
              panel: u[1][3].panel,
              data: u[1],
              lecture: {
                F: 'Pacifico',
                C: C,
                CC: u[0]
              }
            })
          })
          wiki.push({"Tortugas": Tortugas})
        }
        else{
          wiki.push({
            title: u[1][1].headerTitle,
            panel: u[1][3].panel,
            data: u[1],
            lecture: {
              F: 'Pacifico',
              C: C,
              CC: u[0]
            }
          })
        }
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
          if("Biodiversidad" in item){
            return(
              <TouchableOpacity
                style={{ flexDirection: 'row', width: '100%', height: helper.height/8 }}
                onPress={()=>{
                  this.props.navigation.navigate('RenderBioView', {data: 'Pacifico', header: 'Biodiversidad', headerBackgroundColor: '#FFC107'} );
                }}
              >
                <View style={{ width: '80%', justifyContent: 'center', paddingLeft: 30 }}>
                  <Text style={{ fontSize: 18, }}>Biodiversidad</Text>
                  <Text style={{ fontSize: 14, color: '#BCBEBF' }}>Pacifico</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon
                    name='info'
                    color='#BCBEBF'
                  />
                </View>
              </TouchableOpacity>
            )
          }
          else if("Tortugas" in item){
            return(
              <TouchableOpacity
                style={{ flexDirection: 'row', width: '100%', height: helper.height/8 }}
                onPress={()=>{
                  this.props.navigation.navigate('RenderBioView', {data: 'Pacifico', header: 'Tortugas Marinas de Nicaragua', headerBackgroundColor: '#FFC107'} );
                }}
              >
                <View style={{ width: '80%', justifyContent: 'center', paddingLeft: 30 }}>
                  <Text style={{ fontSize: 18, }}>Tortugas Marinas de Nicaragua</Text>
                  <Text style={{ fontSize: 14, color: '#BCBEBF' }}>Pacifico</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon
                    name='info'
                    color='#BCBEBF'
                  />
                </View>
              </TouchableOpacity>
            )
          }
          else{
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
          }
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
