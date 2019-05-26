import React, { Component } from 'react';
import { ImageBackground, Text, View, AsyncStorage, TouchableHighlight } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import * as helper from '../functions/Main';

export default class Welcome extends Component {

  state = {
    loading: false
  }

  static navigationOptions =   {
      header: null,
  }

  componentDidMount(){
    Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
  }

  resetNavigation = async (page) => {
    await AsyncStorage.setItem('firstTimeUse', 'used');
    this.props.navigation.navigate(page);
  };

  render() {
    return (
      <ImageBackground
        fadeDuration={0}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        source={require('../assets/login-1.jpg')}>
        <View
          style={{
            height: helper.height * 0.7,
            width: helper.width,
            alignItems: 'flex-start',
          }}>
          <Button
            title="OMITIR"
            fontWeight="400"
            type="clear"
            fontSize={18}
            underlayColor='transparent'
            titleStyle={{
              color: '#2293D4',
              fontFamily: 'IndieFlower'
            }}
            TouchableComponent={TouchableHighlight}
            color="#888"
            containerStyle={{ position: 'absolute', right: 5, top: 15 }}
            onPress={async () => {
              await helper.createLocalUser();
              this.resetNavigation('Main');
            }}
          />
        </View>
        <View style={{ height: helper.height * 0.3 }}>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: 10,
              fontSize: 18,
              color: 'rgba(255,255,255,1)',
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: {width: -1, height: 1},
              textShadowRadius: 10,
              fontFamily: 'IndieFlower'
            }}
          >
            Iniciar sesión con
          </Text>
          <Button
            title="Facebook"
            backgroundColor="#035DB8"
            raised
            fontWeight="400"
            fontSize={18}
            buttonStyle={{ paddingLeft: 30, paddingRight: 30 }}
            borderRadius={30}
            loadingRight
            loading={this.state.loading}
            onPress={async () => {
              this.setState({ loading: true });
              let isUserLoggedIn = await helper.facebook();
              this.setState({ loading: false });
              (isUserLoggedIn) ? this.resetNavigation('Main') : null;
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}
