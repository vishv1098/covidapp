/**
 * @author Prem Kumar Bammidi
 */
import React, { Component } from 'react';
import { StyleSheet, Text, Alert, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import config from '../configFiles/config';
import googleConfig from '../configFiles/googleConfig';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

async function OAuth_Fitbit() {
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
  
  // Log in to get an authentication token
  const authState = await authorize(configFitbit);
  console.log(authState)

  try {
    await AsyncStorage.setItem('fitbit_accesstoken', authState.accessToken)
  } catch (error) {
    console.log(error)
  }

  return authState
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
      value: '',
      date: '',
      isloading: true,
    }
  }

  componentDidMount() {
      //
  }

  getData = async () => {
    try {
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

    await axios.get('https://api.fitbit.com/1/user/-/profile.json',{
      headers:{
        Authorization: 'Bearer ' + this.state.fitbit_accesstoken
      }
    }).then((resp) => {
      console.log(resp.data)
    }).catch((error) => {
      console.log(error)
    })

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
  
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to Device Integration
          </Text>
        </View>
        <View style={styles.device}>
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
        </View>
      </ScrollView>
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
