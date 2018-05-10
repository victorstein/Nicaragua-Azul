import React, { Component } from 'react';
import { ScrollView, View, Text, Image, StatusBar, FlatList, AsyncStorage, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as helper from '../functions/Main';
import { DangerZone } from 'expo';
const { Lottie } = DangerZone;

export default class MyTreasures extends Component {

  constructor(){
    super();
    this.state = {
      loading: true,
      treasuresTotal: null,
      user: null
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
    headerTitle: "Mis Tesoros",
    headerStyle: { backgroundColor: "#006DDB", height: 70, margin: 0 },
    headerTintColor: "white"
  })

  async componentDidMount(){
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
    let treasuresTotal = await AsyncStorage.getItem("treasuresTotal");
    let user = JSON.parse(await AsyncStorage.getItem("user"));
    let userTreasures = [];
    Object.entries(user.treasures).forEach((u,i)=>{
      if(u[1] != "none"){
        userTreasures.push(u[1]);
      }
    })

    this.setState({
      treasuresTotal: treasuresTotal,
      user: user,
      userTreasures: userTreasures,
      loading: false,
    })
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

  renderList = ()=>{
    return(
      <View>
        <View style={{ flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 10, }}>
          <View style={{ width: '70%', justifyContent: 'flex-end', paddingLeft: 10, bottom: -3 }}>
            <Text style={{ color: '#767676', fontSize: 26, fontWeight: '100' }}>
              Encontrados
            </Text>
          </View>
          <View style={{  width: '30%', alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 10 }}>
            <Text style={{ color: '#767676', fontSize: 18, opacity: 0.8 }}>
              { (this.state.user.treasures["0"] == "none") ? 0 : Object.keys(this.state.user.treasures).length }/{ this.state.treasuresTotal }
            </Text>
          </View>
        </View>
        <View>
          <FlatList
            data={this.state.userTreasures}
            renderItem={({item}) => {
              return(
                <TouchableOpacity
                  onPress={ async ()=>{
                    let wiki = JSON.parse(await AsyncStorage.getItem('Wiki'));
                    let father = item.lecture.F;
                    let child = item.lecture.C;
                    let childochild = item.lecture.CC;
                    let childochildochild = (item.lecture.CCC) ? item.lecture.CCC : null;
                    let wikiData = (childochildochild) ? wiki[father][child][childochild][childochildochild] : wiki[father][child][childochild];
                    this.props.navigation.navigate('RenderView', { data: wikiData } );
                  }}
                  style={{
                     flexDirection: 'row', marginVertical: 10
                  }}
                >
                  <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar
                      width={50}
                      heigth={50}
                      rounded
                      overlayContainerStyle={{ backgroundColor: 'transparent' }}
                      source={require('../assets/bottle.png')}
                    />
                  </View>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#C5C5C5', flexDirection: 'row', paddingBottom: 10 }}>
                    <View style={{ width: '80%', justifyContent: 'center', alignItems: 'flex-start' }}>
                      <Text style={{ fontSize: 16 }}>{item.title}</Text>
                      <Text style={{ fontSize: 12 }}>{item.panel}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
            keyExtractor={ (item, index) => index }
          />
        </View>
      </View>
    )
  }

  render(){
    return(
      <ScrollView style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"
          hidden={false}
          animated={true}
          showHideTransition="slide"
        />
        {
          (this.state.loading) ? this.loading() : this.renderList()
        }
      </ScrollView>
    )
  }
}
