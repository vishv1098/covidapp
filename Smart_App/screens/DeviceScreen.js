/**
 * @author Prem Kumar Bammidi
 */
import React, { Component } from 'react';
import { StyleSheet, Image, Text, Alert, View, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import config from '../configFiles/config';
import googleConfig from '../configFiles/googleConfig';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import * as data from '../DeviceData.json';

const configFitbit = {
  clientId: config.client_id,
  clientSecret: config.client_secret,
  redirectUrl: config.redirect_id,
  scopes: ['activity', 'sleep', 'profile', 'heartrate', 'location', 'weight', 'nutrition', 'social'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.fitbit.com/oauth2/authorize',
    tokenEndpoint: 'https://api.fitbit.com/oauth2/token',
    revocationEndpoint: 'https://api.fitbit.com/oauth2/revoke'
  }
};

async function OAuth_Fitbit() {
  
  // Log in to get an authentication token
  const authState = await authorize(configFitbit);
  console.log(authState)

  try {
    await AsyncStorage.setItem('fitbit_accesstoken', authState.accessToken)
    await AsyncStorage.setItem('fitbit_refreshtoken', authState.refreshToken)
  } catch (error) {
    console.log(error)
  }

  return authState
}

async function OAuth_logout_Fitbit() {
  try {
    const refreshtoken_l = await AsyncStorage.getItem('fitbit_refreshtoken')
    await revoke(config, {
      tokenToRevoke: refreshtoken_l,
      includeBasicAuth: true
    });
    await AsyncStorage.setItem('fitbit_accesstoken', null)
    await AsyncStorage.setItem('fitbit_refreshtoken', null)
  } catch (error) {
    console.log(error)
  }
}

async function refresh_Fitbit(fitbit_refreshtoken) {
  const refreshedState = await refresh(configFitbit, {
    refreshToken: fitbit_refreshtoken,
  });

  try {
    await AsyncStorage.setItem('fitbit_accesstoken', refreshedState.accessToken)
    await AsyncStorage.setItem('fitbit_refreshtoken', refreshedState.refreshToken)
  } catch (error) {
    console.log(error)
  }
  
}

async function OAuth_Google() {
  console.log("Check")
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/fitness.activity.read', 'https://www.googleapis.com/auth/fitness.blood_glucose.read',
    'https://www.googleapis.com/auth/fitness.blood_pressure.read', 'https://www.googleapis.com/auth/fitness.body.read', 
    'https://www.googleapis.com/auth/fitness.body_temperature.read', 'https://www.googleapis.com/auth/fitness.location.read', 'https://www.googleapis.com/auth/fitness.nutrition.read',
    'https://www.googleapis.com/auth/fitness.oxygen_saturation.read', 'https://www.googleapis.com/auth/fitness.reproductive_health.read'], // what API you want to access on behalf of the user, default is email and profile
    webClientId: googleConfig.google_webClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  });
}

export default class DeviceScreen extends Component {

  constructor(props) {
    super(props);
    this.getData();
    this.state = {
      fitbit_accesstoken: '',
      fitbit_refreshtoken: '',
      value: '',
      date: '',
      isloading: true,
      dataSource: data.device_array,
      profileData: '',
      fitbitToggle: false
    }
  }

  componentDidMount() {
      //
  }

  getData = async () => {
    try {
      const refreshtoken = await AsyncStorage.getItem('fitbit_refreshtoken')
      await refresh_Fitbit(refreshtoken)
      const value = await AsyncStorage.getItem('fitbit_accesstoken')
      if(value !== null) {
        // value previously stored
        this.setState({
          fitbit_accesstoken: value
        })
      }
    } catch(e) {
      // error reading value
      console.log(e)
    }
    this.onFitbit();
  }

  onFitbitlogin = async () => {
    const authdata = await OAuth_Fitbit()
    // Alert.alert(authdata.accessToken)
    this.setState({
      fitbit_accesstoken: authdata.accessToken
    })
    this.onFitbit();
  }

  onFitbit = async () => {
    
    await axios.get('https://api.fitbit.com/1/user/-/activities/steps/date/2020-06-29/1d/1min.json',{
      headers:{
        Authorization: 'Bearer ' + this.state.fitbit_accesstoken
      }
    }).then((resp) => {
      this.setState({
        isloading: false,
        value: resp.data["activities-steps"][0]["value"],
        date: resp.data["activities-steps"][0]["dateTime"]
      })
    }).catch((error) => {
      console.log(error)
      Alert.alert("No data associated with this account")
    })

    var x_data = ''

    await axios.get('https://api.fitbit.com/1/user/-/profile.json',{
      headers:{
        Authorization: 'Bearer ' + this.state.fitbit_accesstoken
      }
    }).then((resp) => {
      console.log(resp.data)
      x_data = resp.data
    }).catch((error) => {
      console.log(error)
    })

    await this.setState({
      profileData: x_data
    })

    console.log(data.device_array)
    console.log(this.state.profileData['user'])

    try {
      await AsyncStorage.setItem('user_age', this.state.profileData['user']['age'].toString())
      await AsyncStorage.setItem('user_avatar', this.state.profileData['user']['avatar'])
      await AsyncStorage.setItem('user_avgDailySteps', this.state.profileData['user']['averageDailySteps'].toString())
      await AsyncStorage.setItem('user_dob', this.state.profileData['user']['dateOfBirth'])
      await AsyncStorage.setItem('user_name', this.state.profileData['user']['fullName'])
      await AsyncStorage.setItem('user_gender', this.state.profileData['user']['gender'])
      await AsyncStorage.setItem('user_height', this.state.profileData['user']['height'].toString())
      await AsyncStorage.setItem('user_weight', this.state.profileData['user']['weight'].toString())
    } catch (error) {
      console.log(error)
    }

    var test_red = ''

    await axios.get('https://api.fitbit.com/1/user/-/activities/heart/date/2020-09-29/2020-09-30/1min.json',{
      headers:{
        Authorization: 'Bearer ' + this.state.fitbit_accesstoken
      }
    }).then((resp) => {
      console.log(resp)
      test_red = resp
      console.log(resp.data["activities-heart"][0]["dateTime"])
      console.log(resp.data["activities-heart"][0]["value"])
      console.log(JSON.stringify(test_red.data["activities-heart"][0]["value"]))
      // x_data = resp.data
    }).catch((error) => {
      console.log(error)
    })

    try {
      await AsyncStorage.setItem('test_red1', test_red.data["activities-heart"][0]["dateTime"])
      await AsyncStorage.setItem('test_red2', JSON.stringify(test_red.data["activities-heart"][0]["value"]))
    } catch (error) {
      console.log(error)
    }

  }

  onFitbitlogout = async () => {
    await OAuth_logout_Fitbit()
    console.log(this.state.fitbit_accesstoken)
  }

  _onPress = async () => {
    const newState = !this.state.fitbitToggle;
    await this.setState({
      fitbitToggle: newState
    })
    // await AsyncStorage.setItem('fitbit_logout', this.state.fitbitToggle)
    if (newState === true) {
      this.onFitbitlogin()
    }
    if (newState === false) {
      this.onFitbitlogout()
    }
  }

  onGoogle = async () => {
    console.log("Hi")
    OAuth_Google()
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      console.log(error)
    }
  }

  onGoogleFit = () => {
    // The list of available scopes inside of src/scopes.js file
    if(GoogleFit.checkIsAuthorized()) {
      Alert.alert("You are already connected to google fit")
    } else {
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BLOOD_GLUCOSE_READ,
          Scopes.FITNESS_BODY_TEMPERATURE_READ,
          Scopes.FITNESS_REPRODUCTIVE_HEALTH_READ,
          Scopes.FITNESS_BLOOD_PRESSURE_READ,
          Scopes.FITNESS_NUTRITION_READ,
          Scopes.FITNESS_LOCATION_READ,
          Scopes.FITNESS_OXYGEN_SATURATION_READ
        ],
      }
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            console.log(authResult)
          } else {
            console.log(authResult.message)
          }
        })
        .catch(() => {
          console.log("auth error")
        })
      // Call when authorized
      GoogleFit.startRecording((callback) => {
        // Process data from Google Fit Recording API (no google fit app needed)
      });
    }
  }


  renderItem = ({ item }) => {
    const {fitbitToggle} = this.state;
    console.log(this.state.fitbitToggle)
    const textValue = fitbitToggle?"disconnect":"connect"
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 3}}>
        <Image style={{ width: 60, height: 60, margin: 5}}
        source={{ uri: item.device_image }}/>
        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 5}}>
          <Text style={{ fontSize: 30, color: 'green', marginBottom: 15, marginLeft: 25}}>
            {item.device_name}
          </Text>
        </View>
        <View>
          <TouchableOpacity style={{margin: 10, flex: 1, width: 100, height: 50, backgroundColor:'#00a8b5', borderRadius: 25, justifyContent: 'center'}} onPress={this._onPress}>
            <Text style={{textAlign:'center', fontSize: 16}}>{textValue}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderSeparator = () => {
    return (
      <View style={{ height: 1, marginLeft: 66, width: '100%', backgroundColor: 'black'}}>
      </View>
    )
  }
  
  render() {
    return (
      // this.state.isloading
      // ?
      // <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      //   <ActivityIndicator size="large" color="#00a8b5" animating/>
      // </View>
      // :
      <View>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.welcome}>
              Welcome to Device Integration
            </Text>
          </View>
          {/* <View style={styles.device}>
            <View style={{backgroundColor: "lightblue", textAlign: "center"}}>
              <TouchableOpacity style={styles.button} onPress={this.onFitbitlogin}>
                <Text style={{ fontSize: 30, marginTop: 100, color:'green' }}>Fit-Bit</Text>
              </TouchableOpacity>
            </View>
            <View style={{backgroundColor: "lightblue", textAlign: "center"}}>
              <TouchableOpacity style={styles.button} onPress={this.onGoogle}>
                <Text style={{ fontSize: 30, marginTop: 30, color:'green' }}>Google</Text>
              </TouchableOpacity>
            </View>
            <View style={{backgroundColor: "lightblue", textAlign: "center"}}>
              <TouchableOpacity style={styles.button} onPress={this.onGoogleFit}>
                <Text style={{ fontSize: 30, marginTop: 30, color:'green' }}>Google Fit</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text>{' '}</Text>
              <Text>{' '}</Text>
              <Text>{this.state.date} : {this.state.value}</Text>
            </View>
          </View> */}
        </ScrollView>
        <View>
          <FlatList
            data={this.state.dataSource}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent = {this.renderSeparator}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00a8b5',
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    color: '#fff',
    margin: 10,
  },
  device: {
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
