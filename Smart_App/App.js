import React, { Component } from 'react';
import { StyleSheet, Text, Alert, View, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import axios from 'axios';
import config from './configFiles/config'
import googleConfig from './configFiles/googleConfig'

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Math.round(Dimensions.get('window').height);

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

async function OAuth_Fitbit_logout() {
    const refreshedToken = await AsyncStorage.getItem('fitbit_refreshtoken')
    // Revoke token
    await revoke(configFitbit, {
        tokenToRevoke: refreshedToken,
        includeBasicAuth: true
    });
}

async function oAuth_Google() {
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


class App extends Component {

    constructor(props) {
        super(props);
        this.getData();
        this.state = {
            fitbit_accesstoken: '',
            google_accesstoken: '',
            text: '',
            textdata: 'Sign-in to your fitness tracker account to get vital signs',
            fitbitdata: 'fitbit',
            googledata: 'Google Fit',
            googlename: '',
            fitbitname: '',
            flashMessage: false,
            formfill: false
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
    }

    _onFitbit = async() => {
        if (this.state.fitbitdata === "fitbit") {
            const authdata = await OAuth_Fitbit()
            var x_data = ''
            await axios.get('https://api.fitbit.com/1/user/-/profile.json',{
                headers:{
                    Authorization: 'Bearer ' + authdata.accessToken
                }
            }).then((resp) => {
                console.log(resp.data)
                x_data = resp.data
            }).catch((error) => {
                console.log(error)
            })

            this.setState({
                fitbit_accesstoken: authdata.accessToken,
                text: 'you now connected to fitbit',
                fitbitdata: 'Sign-out fitbit',
                textdata: 'You have signed-in as ' + x_data['user']['fullName'],
                fitbitname: x_data['user']['fullName']
            })

        } else {
            await OAuth_Fitbit_logout()
            this.setState({
                text: '',
                fitbitdata: 'fitbit',
                fitbitname: '',
                fitbit_accesstoken: ''
            })
            if (this.state.googlename === '') {
                this.setState({
                    textdata: 'Sign-in to your fitness tracker account to get vital signs',
                })
            }
            if (this.state.fitbitname !== '') {
                this.setState({
                    textdata: 'You have signed-in as ' + this.state.fitbitname
                })
            }
        }
        console.log(this.state.fitbit_accesstoken)
    }

    _onGooglefit = async() => {
        if (this.state.googledata === "Google Fit") {
            await oAuth_Google()
            try {
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                console.log(userInfo)
                this.setState({
                    google_accesstoken: userInfo.idToken,
                    textdata: 'You have signed-in as ' + userInfo.user.name,
                    googlename: userInfo.user.name,
                    googledata: 'Sign-out Google Fit'
                })
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
            // this.setState({
            //     text: 'you now connected to Google Fit',
                
            // })
        } else {
            this.setState({
                google_accesstoken: '',
                text: '',
                googledata: 'Google Fit',
                googlename: ''
            })
            if (this.state.fitbitname === '') {
                this.setState({
                    textdata: 'Sign-in to your fitness tracker account to get vital signs',
                })
            }
            if (this.state.fitbitname !== '') {
                this.setState({
                    textdata: 'You have signed-in as ' + this.state.fitbitname
                })
            }
        }
        console.log(this.state.google_accesstoken)
    }

    _onFormData = async() => {
        // this.setState({
        //     formfill: true,
        // })
        Alert.alert("You are filling the data")
    }

    onFlashPress(){
        if (this.state.fitbit_accesstoken === '' && this.state.google_accesstoken === '') {
            this.setState({
                flashMessage: true
            },()=>{setTimeout(() => this.closeFlashMessage(), 3000)})
        }
    }
    
    closeFlashMessage(){
        this.setState({
            flashMessage: false
        })
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={{paddingTop: 80}}>
                        <Text style={{ fontSize: 40, paddingLeft: 25, paddingRight:25, paddingTop: 30, paddingBottom: 5, textAlign: 'center', fontWeight: 'bold' }}>Get Vital Signs</Text>
                    </View>
                    <View>
                        <Text style={{ paddingTop: 140, paddingBottom:4, textAlign: 'center', fontSize: 16, paddingLeft: 25, paddingRight: 25}}>{this.state.textdata}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} onPress={this._onFitbit}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>{this.state.fitbitdata}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} onPress={this._onGooglefit}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>{this.state.googledata}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} onPress={this._onFormData}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Manual Data Entry</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ paddingTop: 100}}>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} onPress={()=>{this.onFlashPress()}}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.flashMessage==true?
                    <View style={styles.flashMessage}>
                        <Text style={{color:'red'}}>You should Sign-in to one device atleast</Text>
                    </View>
                    :
                    null
                    } */}
                    {/* {this.state.formfill==true?
                    <View>
                        <Text style={{color:'red'}}>You should Sign-in to one device atleast</Text>
                    </View>
                    :
                    null
                    } */}
                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    flashMessage:{
        position: 'relative',
        width:'100%', 
        justifyContent:'center', 
        alignItems:'center',           
        height:40, 
        top: -140
    }
})

export default App

