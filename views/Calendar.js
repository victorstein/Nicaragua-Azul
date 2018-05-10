import React, { Component } from 'react';
import { View, Text, Image, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Avatar, Icon } from 'react-native-elements';
import * as helper from '../functions/Main';

LocaleConfig.locales['fr'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['en.','febr.','mzo.','abr.','my.','jun.','jul.','agto.','sept.','oct.','nov.','dic.'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['D','L','M','M','J','V','S']
};
LocaleConfig.defaultLocale = 'fr';

export default class CalendarView extends Component {

  constructor(){
    super();
    this.state = {
      datesData: {
        date: "Seleccione una fecha",
        location: "Seleccione una fecha",
        time: "Seleccione una fecha"
      },
      today: this.today()
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
    headerTitle: "Calendario",
    headerStyle: { backgroundColor: "#006DDB", height: 70, margin: 0 },
    headerTintColor: "white"
  })

  componentDidMount(){
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
  }

  today= ()=>{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    today = yyyy + '-' + mm + '-' + dd;

    return today;
  }

  render(){
    return(
      <ScrollView>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <StatusBar
            backgroundColor="blue"
            barStyle="light-content"
            hidden={false}
            animated={true}
            showHideTransition="slide"
          />
          <Calendar
            markedDates={ dates }
            style={{ width: helper.width, paddingBottom: 10 }}
            markingType={'period'}
            theme={{
              calendarBackground: '#0085DE',
              textSectionTitleColor: '#84C4EF',
              dayTextColor: '#fff',
              arrowColor: '#84C4EF',
              monthTextColor: '#FFF',
              textDayFontSize: 16,
              textMonthFontSize: 22,
              textDayHeaderFontSize: 16
            }}
            current={this.state.today}
            minDate={'2018-01-01'}
            maxDate={'2018-12-31'}
            onDayPress={(day) => {
              if(day.dateString in dates){
                Object.entries(dates).forEach((u,i)=>{
                  if(day.dateString == u[0]){
                    this.setState({
                      datesData: {
                        date: u[1].date,
                        location: u[1].location,
                        time: u[1].time,
                      },
                      today: day.dateString
                    })
                  }
                })
              } else{
                this.setState({
                  datesData: {
                    date: "No hay eventos para este día",
                    location: "No hay eventos para este día",
                    time: "No hay eventos para este día",
                  },
                  today: day.dateString
                })
              }
            }}
            hideArrows={false}
            hideExtraDays={false}
            firstDay={1}
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
          />
            <View style={{ height: helper.height/9, width: helper.width, justifyContent: 'center', flexDirection: 'row' }}>
              <View style={{ width: '20%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Icon
                  name="date-range"
                  color="#00A0CE"
                  size={40}
                />
              </View>
              <View style={{ borderBottomWidth: 1, borderBottomColor: "#C9CACB", width: '80%', height: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text>{ this.state.datesData.date }</Text>
              </View>
            </View>
            <View style={{ height: helper.height/9, width: helper.width, justifyContent: 'center', flexDirection: 'row'}}>
              <View style={{ width: '20%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Icon
                  name="place"
                  color="#E91919"
                  size={40}
                />
              </View>
              <View style={{ borderBottomWidth: 1, borderBottomColor: "#C9CACB", width: '80%', height: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text>{ this.state.datesData.location }</Text>
              </View>
            </View>
            <View style={{ height: helper.height/9, width: helper.width, justifyContent: 'center', flexDirection: 'row' }}>
              <View style={{ width: '20%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Icon
                  name="access-time"
                  color="#000"
                  size={40}
                />
              </View>
              <View style={{ width: '80%', height: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text>{ this.state.datesData.time }</Text>
              </View>
            </View>
        </View>
      </ScrollView>
    )
  }
}

const dates = {
 '2018-06-07': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-08': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-09': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-10': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-11': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-12': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-13': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-14': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-15': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-16': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-17': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Puerto Salvador Allende, Managua', date: '7 Junio - 17 Junio' },
 '2018-06-22': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Rivas', date: '22 Junio - 27 Junio' },
 '2018-06-23': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Rivas', date: '22 Junio - 27 Junio' },
 '2018-06-24': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Rivas', date: '22 Junio - 27 Junio' },
 '2018-06-25': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Rivas', date: '22 Junio - 27 Junio' },
 '2018-06-26': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Rivas', date: '22 Junio - 27 Junio' },
 '2018-06-27': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Rivas', date: '22 Junio - 27 Junio' },
 '2018-07-03': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Granada', date: '03 Julio - 08 Julio' },
 '2018-07-04': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Granada', date: '03 Julio - 08 Julio' },
 '2018-07-05': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Granada', date: '03 Julio - 08 Julio' },
 '2018-07-06': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Granada', date: '03 Julio - 08 Julio' },
 '2018-07-07': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Granada', date: '03 Julio - 08 Julio' },
 '2018-07-08': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Granada', date: '03 Julio - 08 Julio' },
 '2018-07-24': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Chinandega', date: '24 Julio - 29 Julio' },
 '2018-07-25': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Chinandega', date: '24 Julio - 29 Julio' },
 '2018-07-26': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Chinandega', date: '24 Julio - 29 Julio' },
 '2018-07-27': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Chinandega', date: '24 Julio - 29 Julio' },
 '2018-07-28': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Chinandega', date: '24 Julio - 29 Julio' },
 '2018-07-29': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Chinandega', date: '24 Julio - 29 Julio' },
 '2018-08-07': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Leon', date: '07 Agosto - 12 Agosto' },
 '2018-08-08': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Leon', date: '07 Agosto - 12 Agosto' },
 '2018-08-09': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Leon', date: '07 Agosto - 12 Agosto' },
 '2018-08-10': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Leon', date: '07 Agosto - 12 Agosto' },
 '2018-08-11': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Leon', date: '07 Agosto - 12 Agosto' },
 '2018-08-12': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Leon', date: '07 Agosto - 12 Agosto' },
 '2018-08-26': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Corn Island (RAAS)', date: '26 Agosto - 2 Septiembre' },
 '2018-08-27': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Corn Island (RAAS)', date: '26 Agosto - 2 Septiembre' },
 '2018-08-28': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Corn Island (RAAS)', date: '26 Agosto - 2 Septiembre' },
 '2018-08-29': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Corn Island (RAAS)', date: '26 Agosto - 2 Septiembre' },
 '2018-08-30': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Corn Island (RAAS)', date: '26 Agosto - 2 Septiembre' },
 '2018-08-31': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Corn Island (RAAS)', date: '26 Agosto - 2 Septiembre' },
 '2018-09-01': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Corn Island (RAAS)', date: '26 Agosto - 2 Septiembre' },
 '2018-09-02': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Corn Island (RAAS)', date: '26 Agosto - 2 Septiembre' },
 '2018-09-08': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Bluefields (RAAS)', date: '8 Septiembre - 16 Septiembre' },
 '2018-09-09': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Bluefields (RAAS)', date: '8 Septiembre - 16 Septiembre' },
 '2018-09-10': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bluefields (RAAS)', date: '8 Septiembre - 16 Septiembre' },
 '2018-09-11': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bluefields (RAAS)', date: '8 Septiembre - 16 Septiembre' },
 '2018-09-12': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bluefields (RAAS)', date: '8 Septiembre - 16 Septiembre' },
 '2018-09-13': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bluefields (RAAS)', date: '8 Septiembre - 16 Septiembre' },
 '2018-09-14': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bluefields (RAAS)', date: '8 Septiembre - 16 Septiembre' },
 '2018-09-15': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Bluefields (RAAS)', date: '8 Septiembre - 16 Septiembre' },
 '2018-09-16': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Bluefields (RAAS)', date: '8 Septiembre - 16 Septiembre' },
 '2018-09-29': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Bilwi (RAAN)', date: '29 Septiembre - 7 Octubre' },
 '2018-09-30': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Bilwi (RAAN)', date: '29 Septiembre - 7 Octubre' },
 '2018-10-01': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bilwi (RAAN)', date: '29 Septiembre - 7 Octubre' },
 '2018-10-02': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bilwi (RAAN)', date: '29 Septiembre - 7 Octubre' },
 '2018-10-03': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bilwi (RAAN)', date: '29 Septiembre - 7 Octubre' },
 '2018-10-04': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bilwi (RAAN)', date: '29 Septiembre - 7 Octubre' },
 '2018-10-05': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Bilwi (RAAN)', date: '29 Septiembre - 7 Octubre' },
 '2018-10-06': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Bilwi (RAAN)', date: '29 Septiembre - 7 Octubre' },
 '2018-10-07': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Bilwi (RAAN)', date: '29 Septiembre - 7 Octubre' },
 '2018-10-16': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Jinotepe', date: '16 Octubre - 21 Octubre' },
 '2018-10-17': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Jinotepe', date: '16 Octubre - 21 Octubre' },
 '2018-10-18': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Jinotepe', date: '16 Octubre - 21 Octubre' },
 '2018-10-19': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Jinotepe', date: '16 Octubre - 21 Octubre' },
 '2018-10-20': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Jinotepe', date: '16 Octubre - 21 Octubre' },
 '2018-10-21': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Jinotepe', date: '16 Octubre - 21 Octubre' },
 '2018-11-16': { startingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Masaya', date: '16 Noviembre - 21 Noviembre' },
 '2018-11-17': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Masaya', date: '16 Noviembre - 21 Noviembre' },
 '2018-11-18': { color: 'white', textColor: '#0085DE', time: '9:00 AM - 5:00 PM ( Abierto al público )', location: 'Parque Central, Masaya', date: '16 Noviembre - 21 Noviembre' },
 '2018-11-19': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Masaya', date: '16 Noviembre - 21 Noviembre' },
 '2018-11-20': { color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Masaya', date: '16 Noviembre - 21 Noviembre' },
 '2018-11-21': { endingDay: true, color: 'white', textColor: '#0085DE', time: '9:00 PM - 4:00 PM ( Centros educativos )\n4:00 PM - 8:00 PM ( Abierto al público )', location: 'Parque Central, Masaya', date: '16 Noviembre - 21 Noviembre' },
}
