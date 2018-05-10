import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  AsyncStorage,
  TouchableOpacity,
  Image
} from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { DangerZone } from 'expo';
import * as helper from '../functions/Main';
const { Lottie } = DangerZone;

export default class RenderBioView extends Component {

  constructor(){
    super();
    this.state = {
      wiki: null
    }
  }

  static navigationOptions = ({ navigation })=>({
    headerRight:
      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          borderRadius: 100/2,
          backgroundColor: 'white',
          marginHorizontal: 15,
          elevation: 10
        }}
        onPress={()=>{
          navigation.navigate('Main');
        }}
      >
        <Image source={require('../assets/iconSmall.png')} style={{ width: 60, height: 60, }} />
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
    headerTitle: navigation.state.params.header,
    headerStyle: { backgroundColor: navigation.state.params.headerBackgroundColor, height: 70, margin: 0 },
    headerTintColor: "white",
  })

  async componentDidMount(){
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
    let data = JSON.parse(await AsyncStorage.getItem('Wiki'));
    let module = this.props.navigation.state.params.data;
    let header = this.props.navigation.state.params.header;
    let wiki = [];
    Object.entries(data[module]).forEach((u, i)=>{
      let C = u[0];
      Object.entries(u[1]).forEach((u, i)=>{
        if(u[0] == "Biodiversidad" && header == "Biodiversidad"){
          let CC = u[0];
          Object.entries(u[1]).forEach((u, i)=>{
            wiki.push({
              title: u[1][1].headerTitle,
              panel: u[1][3].panel,
              data: u[1],
              lecture: {
                F: module,
                C: C,
                CC: CC,
                CCC: u[0],
              }
            })
          })
        }
        else if(u[0] == "Tortugas" && header == "Tortugas Marinas de Nicaragua"){
          let CC = u[0];
          Object.entries(u[1]).forEach((u, i)=>{
            wiki.push({
              title: u[1][1].headerTitle,
              panel: u[1][3].panel,
              data: u[1],
              lecture: {
                F: module,
                C: C,
                CC: CC,
                CCC: u[0],
              }
            })
          })
        }
        else if(u[0] == "Tortugas" && header == "Especies Migratorias e Introducidas de Agua Dulce"){
          let CC = u[0];
          Object.entries(u[1]).forEach((u, i)=>{
            wiki.push({
              title: u[1][1].headerTitle,
              panel: u[1][3].panel,
              data: u[1],
              lecture: {
                F: module,
                C: C,
                CC: CC,
                CCC: u[0],
              }
            })
          })
        }
        else if(u[0] == "Tortugas" && header == "Especies con regulaciones de pesca"){
          let CC = u[0];
          Object.entries(u[1]).forEach((u, i)=>{
            wiki.push({
              title: u[1][1].headerTitle,
              panel: u[1][3].panel,
              data: u[1],
              lecture: {
                F: module,
                C: C,
                CC: CC,
                CCC: u[0],
              }
            })
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
        keyExtractor={(item, index) => index}
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
            loop={true}
            source={require('../assets/animations/loader.json')}
            resizeMode="contain"
          />
      </View>
    )
  }

  render(){
    return(
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"
          hidden={false}
          animated={true}
          showHideTransition="slide"
        />
        {
          (this.state.wiki) ? this.renderContent() : this.loading()
        }
      </View>
    )
  }
}
