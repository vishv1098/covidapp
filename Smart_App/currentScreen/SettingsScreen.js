import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, ScrollView, TouchableOpacity } from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import axios from 'axios';
import config from '../configFiles/config'
import googleConfig from '../configFiles/googleConfig'
import AddModal from './AddModal';

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

class SettingsScreen extends Component {

    constructor(props) {
        super(props);
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
        }
        this._onFormData = this._onFormData.bind(this);
    }

    async componentDidMount() {
        await this.getData();
        await this.getFitbitData();
    }

    // componentWillUnmount(){
    //     dataAccess()
    //   }

    getVitalData = async() => {
        var hr = await AsyncStorage.getItem('HeartRate')
        this.setState({
            oxy: parseInt(hr),
            hrplaceholder: "Oxygen Saturation value   : " + hr
        })
    }

    getFitbitData = async () => {
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
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('googlefit_accesstoken')
            console.log(value)
            if(value !== null) {
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
                        const currentUser = GoogleSignin.getTokens().then(async(res)=>{
                            try {
                                await AsyncStorage.setItem('googlefit_accesstoken', res.accessToken)
                                alert('Data successfully saved')
                            } catch (e) {
                                alert('Failed to save the data to the storage')
                            }
                            g_accessToken = res.accessToken
                            this.setState({
                                google_accesstoken: g_accessToken
                            })

                        });
                    })
                    .catch((error) => {
                      console.log("....." + JSON.stringify(error))
                    });
                this.setState({
                    textdata: 'You have signed-in as ' + userInfo.user.name,
                    googlename: userInfo.user.name,
                    googledata: 'Sign-out Google Fit'
                })
                await this.storeData()
            } catch (error) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                } else if (error.code === statusCodes.IN_PROGRESS) {
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                } else {
                }
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
    }

    storeData = async() => {
        var x_access = this.state.google_accesstoken.toString()
        var check = await AsyncStorage.getItem("googlefit_accesstoken")
    }

    _onFormData = async() => {
        this.refs.addModal.showAddModal();
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

