import React, { Component } from 'react';
import { StyleSheet, Text, Image, Alert, View, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Settings } from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import axios from 'axios';
import config from '../configFiles/config'
import googleConfig from '../configFiles/googleConfig'
import AddModal from './AddModal';

var screenWidth = Dimensions.get('screen').width;
var screenHeight = Math.round(Dimensions.get('window').height);

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

export class SettingsScreen extends Component {

    constructor(props) {
        super(props);
        this.getData();
        this.state = {
            fitbit_accesstoken: '',
            google_accesstoken: '',
            text: '',
            textdata: 'Sign-in to your fitness tracker account to get vital signs',
            fitbitdata: 'Login with fitbit',
            googledata: 'Login with Google Fit',
            googlename: '',
            fitbitname: '',
            flashMessage: false,
            formfill: false,
            oxy: -1,
            dbp: -1,
            sbp: -1,
            hr: -1,
            res_r: -1,
            b_tmp: -1,
            sex: 0,
            white: 1,
            black: 0,
            others: 0,
            ethini: 0,
            age: 1,
            toggle: false,
            gender: 'male',
            race: 'white',
            ethnicity: 'nothispanic/latino',
            covid: false,
            influ: false,
            safe: false,
            covidTest: false,
            result: false,
            res_score: 0,
            res_msg: '',
            g_color: 'green',
            // hea_da: ''
        }
        this._onFormData = this._onFormData.bind(this);
    }

    getData = async () => {
        try {
          const refreshtoken = await AsyncStorage.getItem('fitbit_refreshtoken')
          await refresh_Fitbit(refreshtoken)
          const value = await AsyncStorage.getItem('fitbit_accesstoken')
          if(value !== null) {
            this.setState({
              fitbit_accesstoken: value,
              fitbitdata: 'Sign-out fitbit'
            })
          }
        } catch(e) {
          console.log(e)
        }
        try {
            const value = await AsyncStorage.getItem('googlefit_accesstoken')
            console.log(value)
            if(value !== null) {
                console.log("hi")
              this.setState({
                google_accesstoken: value,
                googledata: 'Sign-out Google Fit'
              })
            }
        } catch(e) {
            console.log(e)
        }
    }

    _onFitbit = async() => {
        if (this.state.fitbitdata === "Login with fitbit") {
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
            await AsyncStorage.setItem('fitbit_accesstoken', '')
            await AsyncStorage.setItem('fitbit_refreshtoken', '')
            this.setState({
                text: '',
                fitbitdata: 'Login with fitbit',
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
        if (this.state.googledata === "Login with Google Fit") {
            await oAuth_Google()
            try {
                await GoogleSignin.hasPlayServices();
                var userInfo = ''
                var g_accessToken = ''
                await GoogleSignin.signIn()
                    .then((data) => {
                        userInfo = data
                        const currentUser = GoogleSignin.getTokens().then((res)=>{
                            g_accessToken = res.accessToken
                            console.log(res.accessToken ); //<-------Get accessToken
                        });
                    })
                    .catch((error) => {
                      console.log("....." + JSON.stringify(error))
                    });
                this.setState({
                    google_accesstoken: g_accessToken,
                    textdata: 'You have signed-in as ' + userInfo.user.name,
                    googlename: userInfo.user.name,
                    googledata: 'Sign-out Google Fit'
                })
                await AsyncStorage.setItem('googlefit_accesstoken', this.state.google_accesstoken)
            } catch (error) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                } else if (error.code === statusCodes.IN_PROGRESS) {
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                } else {
                }
                console.log(error)
            }
        } else {
            await AsyncStorage.setItem('googlefit_accesstoken', '')
            this.setState({
                google_accesstoken: '',
                text: '',
                googledata: 'Login with Google Fit',
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
        this.refs.addModal.showAddModal();
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

    setData = async (data) => {
        this.setState({ 
            oxy: data[0],
            dbp: data[1],
            sbp: data[2],
            hr: data[3],
            res_r: data[4],
            b_tmp: data[5],
            sex: data[6],
            white: data[7],
            black: data[8],
            others: data[9],
            ethini: data[10],
            age: data[11],
            covidTest: true
        })
        // console.log(this.state.oxy)
        console.log(this.state.oxy,"hi")
        await this.storage();
    }

    storage = async () => {
        await AsyncStorage.setItem('oxygen_saturation', ""+this.state.oxy)
        await AsyncStorage.setItem('diastolic_bloodpressure', ""+this.state.dbp)
        await AsyncStorage.setItem('systolic_bloodpressure', ""+this.state.sbp)
        await AsyncStorage.setItem('heart_rate', ""+this.state.hr)
        await AsyncStorage.setItem('respiratory_rate', ""+this.state.res_r)
        await AsyncStorage.setItem('temperature', ""+this.state.b_tmp)
    }

    getReset = async () => {
        this.setState({
            oxy: -1,
            dbp: -1,
            sbp: -1,
            hr: -1,
            res_r: -1,
            b_tmp: -1,
            sex: 0,
            white: 1,
            black: 0,
            others: 0,
            ethini: 0,
            age: 1,
            covidTest: false,
            result: false
        })
    }

    render() {
        console.log(this.state.google_accesstoken)
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={{paddingTop: 80}}>
                        <Text style={{ fontSize: 39, paddingLeft: 25, paddingRight:25, paddingTop: 30, paddingBottom: 35, textAlign: 'center', fontWeight: 'bold' }}>Connect fitness tracker</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.FitbitLoginStyle} activeOpacity={0.5} onPress={this._onFitbit}>
                            <Image source={{ uri: "https://lh3.googleusercontent.com/QhMCymTyxJbzRiwMBA-GYooS-nVKm3fHg2CSRyKHvhmC-e5vOibfST73y1MmScvtPw" }} style={styles.ImageIconStyle} />
                            <View style={styles.SeparatorLine} />
                            <Text style={styles.TextStyle}>{this.state.fitbitdata}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.GoogleLoginButtonStyle} activeOpacity={0.5} onPress={this._onGooglefit}>
                            <Image source={{ uri: "https://www.gstatic.com/images/branding/product/1x/gfit_512dp.png" }} style={styles.ImageIconStyle} />
                            <View style={styles.SeparatorLine} />
                            <Text style={styles.TextStyleGoogle}>{this.state.googledata}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingTop: 50}}>
                        <Text style={{ fontSize: 39, paddingLeft: 25, paddingRight:25, paddingTop: 30, paddingBottom: 35, textAlign: 'center', fontWeight: 'bold' }}>No fitness tracker?</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} onPress={this._onFormData}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Enter vital signs</Text>
                        </TouchableOpacity>
                    </View>
                    <AddModal ref={'addModal'} setData={this.setData}>
                    </AddModal>
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
        top: -120
    },
    FitbitLoginStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00B0B9',
        height: 80,
        borderRadius: 25,
        margin: 10,
        paddingLeft: 10,
        width: 360,
        justifyContent: 'flex-start'
       
      },
      GoogleLoginButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        height: 80,
        borderRadius: 25,
        margin: 10,
        paddingLeft: 10,
        width: 360,
        justifyContent: 'flex-start'
       
      },
       
      ImageIconStyle: {
        padding: 10,
        margin: 2,
        height: 62,
        width: 62,
        resizeMode : 'stretch',
        paddingRight: 10
      },
       
      TextStyle :{
        textAlign: 'center',
        color: "white",
        marginBottom : 4,
        marginRight :20,
        fontSize: 28,
        fontWeight: 'bold',
        paddingLeft: 10,
        textAlign: 'center'
      },
      TextStyleGoogle :{
        textAlign: 'center',
        color: "white",
        marginBottom : 4,
        marginRight :20,
        fontSize: 28,
        fontWeight: 'bold',
        paddingLeft: 10,
        textAlign: 'center'
      },
       
      SeparatorLine :{
      backgroundColor : '#fff',
      width: 1,
      height: 80
       
      }
})

export default SettingsScreen

