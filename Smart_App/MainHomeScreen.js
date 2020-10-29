import React, { Component } from 'react';
import { StyleSheet, Text, Image, Alert, View, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import axios from 'axios';
import config from './configFiles/config'
import googleConfig from './configFiles/googleConfig'
import AddModal from './AddModal';
import SemiCircleProgress from './SemiCircle'
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';

var screenWidth = Dimensions.get('screen').width;
var screenHeight = Math.round(Dimensions.get('window').height);

const covid_modelJson = require('./components/COVIDOnly/model.json')
const covid_modelWeights = require('./components/COVIDOnly/group1-shard1of1.bin')

const influ_modelJson = require('./components/InfluenzaOnly/model.json')
const influ_modelWeights = require('./components/InfluenzaOnly/group1-shard1of1.bin')

const covid_infl_modelJson = require('./components/COVIDvsInfluenza/model.json')
const covid_infl_modelWeights = require('./components/COVIDvsInfluenza/group1-shard1of1.bin')

const modelJson = require('./components/model.json');
const modelWeights = require('./components/group1-shard1of1.bin');
// const nextImageTensor = images.next().value
// const nextImageTensor2 = nextImageTensor.reshape([[-1.0, -1.0, 80.0, 142.0, -1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 53.0, 0.0]])
const BACKEND_CONFIG = 'cpu';

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


export class MainHomeScreen extends Component {

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

    async componentDidMount() {
        //
        await tf.setBackend(BACKEND_CONFIG);
        await tf.ready();
        console.log("componentDidMount: tf.ready is set");
        console.log("the MyModelLoadLocal component is mounted");
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

            // var ht_dat = ''
            // await axios.get('https://api.fitbit.com/1/user/-/activities/heart/date/2020-09-29/2020-09-30/1min.json', {
            //     headers:{
            //       Authorization: 'Bearer ' + authdata.accessToken
            //     }
            // }).then((resp) => {
            //     console.log(resp.data)
            //     try {
            //         console.log(resp.data["activities-heart-intraday"].dataset)
            //         var x = ''
            //         for (var i = 0; i < 8; i++) {
            //             x = x + resp.data["activities-heart-intraday"].dataset[i].time
            //             x = x + " : " + resp.data["activities-heart-intraday"].dataset[i].value + "\n"
            //         }
            //         ht_dat = x
            //     } catch (error) {
            //         console.log("Hi")
            //         ht_dat = "No data"
            //     }
            // }).catch((error) => {
            //     console.log(error)
            // })

            this.setState({
                fitbit_accesstoken: authdata.accessToken,
                text: 'you now connected to fitbit',
                fitbitdata: 'Sign-out fitbit',
                textdata: 'You have signed-in as ' + x_data['user']['fullName'],
                fitbitname: x_data['user']['fullName']
                // hea_da: ht_dat
            })

        } else {
            await OAuth_Fitbit_logout()
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
                // const userInfo = await GoogleSignin.signIn();
                // console.log(userInfo)
                var userInfo = ''
                var g_accessToken = ''
                await GoogleSignin.signIn()
                    .then((data) => {
                        userInfo = data
                        // console.log(data)
                        // console.log("TEST " + JSON.stringify(data));
                        const currentUser = GoogleSignin.getTokens().then((res)=>{
                            // console.log(res)
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
        // this.setState({
        //     formfill: true,
        // })
        // Alert.alert("You are filling the data")
        
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

    setData = (data) => {
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

    getCovidPrediction = async () => {
        var z = [this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]
        console.log(z)
        const model = await tf.loadLayersModel(bundleResourceIO(covid_modelJson, covid_modelWeights));
        const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
        const res = model.predict(a);
        const da = await res.data();
        const y = JSON.stringify(da).toString()
        var msg= '';
        if (da[0] > 0.5) {
            msg = "You are likely to be covid";
        } else {
            msg = "You are unlikely to be covid";
        }
        return da[0]
      }
    
      getInfluenzaPrediction = async () => {
        var z = [this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]
        const model = await tf.loadLayersModel(bundleResourceIO(influ_modelJson, influ_modelWeights));
        const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
        const res = model.predict(a);
        const da = await res.data();
        const y = JSON.stringify(da).toString()
        var msg= '';
        if (da[0] > 0.5) {
            msg = "You are likely to have Influenza";
        } else {
             msg = "You are unlikely to have Influenza";
        }
        return da[0]
      }
    
      getCovidInfluPrediction = async () => {
        var z = [this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]
        const model = await tf.loadLayersModel(bundleResourceIO(covid_infl_modelJson, covid_infl_modelWeights));
        const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
        const res = model.predict(a);
        const da = await res.data();
        const y = JSON.stringify(da).toString()
        var msg= '';
        if (da[0] > 0.5) {
            msg = "You are likely to be Covid";
        } else {
            msg = "You are likely to have Influenza";
        }
        return da[0]
    }

    getCovidTest = async () => {
        const covidscore = await this.getCovidPrediction();
        const influscore = await this.getInfluenzaPrediction();
        var msg= '';
        if (covidscore < 0.5 && influscore < 0.5 ) {
            msg = "You are unlikely to have COVID or Influenza"
            this.setState({
                safe: true,
                result: true,
                res_msg: msg,
                res_score: parseInt((100 - ((covidscore/0.5)*100)).toFixed(0)),
                g_color: 'green'
            })
        } else if (covidscore < 0.5 && influscore > 0.5 ) {
            msg = "You are likely to have Influenza"
            this.setState({
                influ: true,
                result: true,
                res_msg: msg,
                res_score: parseInt(((influscore)*100).toFixed(0)),
                g_color: 'orange'
            })
        }  else if (covidscore > 0.5 && influscore < 0.5 ) {
            msg = "You are likely to have COVID"
            this.setState({
                covid: true,
                result: true,
                res_msg: msg,
                res_score: parseInt(((covidscore)*100).toFixed(0)),
                g_color: 'red'
            })
        } else {
            const covidinfluscore = await this.getCovidInfluPrediction();
            if (covidinfluscore < 0.5) {
                msg = "You are likely to have Influenza"
                this.setState({
                    influ: true,
                    result: true,
                    res_msg: msg,
                    res_score: parseInt((100 - ((covidinfluscore/0.5)*100)).toFixed(0)),
                    g_color: 'orange'
                })
            } else {
                msg = "You are likely to have COVID"
                this.setState({
                    covid: true,
                    result: true,
                    res_msg: msg,
                    res_score: parseInt(((1-((1-covidinfluscore)/0.5))*100).toFixed(0)),
                    g_color: 'red'
                })
            }
        }
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
        // const value = this.props.navigation.getParam('lst','Getting data of loss of smell and taste no checkbox for test');
        // console.log(this.state.hea_da)
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
                        <TouchableOpacity style={styles.FitbitLoginStyle} activeOpacity={0.5} onPress={this._onFitbit}>
                            <Image source={{ uri: "https://lh3.googleusercontent.com/QhMCymTyxJbzRiwMBA-GYooS-nVKm3fHg2CSRyKHvhmC-e5vOibfST73y1MmScvtPw" }} style={styles.ImageIconStyle} />
                            <View style={styles.SeparatorLine} />
                            <Text style={styles.TextStyle}>{this.state.fitbitdata}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* {this.state.fitbit_accesstoken !== '' ?
                    <View style={{paddingTop: 20}}>
                        <Text>{this.state.hea_da}</Text>
                    </View>
                    :
                    null
                    } */}
                    <View>
                        <TouchableOpacity style={styles.GoogleLoginButtonStyle} activeOpacity={0.5} onPress={this._onGooglefit}>
                            <Image source={{ uri: "https://www.gstatic.com/images/branding/product/1x/gfit_512dp.png" }} style={styles.ImageIconStyle} />
                            <View style={styles.SeparatorLine} />
                            <Text style={styles.TextStyleGoogle}>{this.state.googledata}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} onPress={() => this.props.navigation.navigate('Symptom')}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Symptoms</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingTop: 10}}>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} onPress={this._onFormData}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Manual Data Entry</Text>
                        </TouchableOpacity>
                    </View>
                    <AddModal ref={'addModal'} setData={this.setData}>

                    </AddModal>
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
                    {/* <View>
                        <Text style={{color:'red'}}>{this.state.oxy}</Text>
                        <Text style={{color:'red'}}>{this.state.dbp}</Text>
                        <Text style={{color:'red'}}>{this.state.sbp}</Text>
                        <Text style={{color:'red'}}>{this.state.hr}</Text>
                        <Text style={{color:'red'}}>{this.state.res_r}</Text>
                        <Text style={{color:'red'}}>{this.state.b_tmp}</Text>
                        <Text style={{color:'red'}}>{this.state.sex}</Text>
                        <Text style={{color:'red'}}>{this.state.white}</Text>
                        <Text style={{color:'red'}}>{this.state.black}</Text>
                        <Text style={{color:'red'}}>{this.state.others}</Text>
                        <Text style={{color:'red'}}>{this.state.ethini}</Text>
                        <Text style={{color:'red'}}>{this.state.age}</Text>
                    </View> */}
                    {/* <View>
                        <SemiCircleProgress
                            percentage={100}
                            progressColor={"red"}
                        >
                            <Text style={{ fontSize: 32, color: "green" }}>40%</Text>
                        </SemiCircleProgress>
                    </View>
                    <View style={{paddingTop: 20, paddingBottom: 10}}>
                        <Text>Developed by CMU</Text>
                    </View> */}
                    {this.state.result === true?
                    <View style={{paddingTop: 80}}> 
                        <SemiCircleProgress
                            percentage={this.state.res_score}
                            progressColor={this.state.g_color}
                        >
                            <Text style={{ fontSize: 32, color:this.state.g_color }}>{this.state.res_score}%</Text>
                        </SemiCircleProgress>
                    </View>
                    :
                    null
                    }
                    {this.state.result === true?
                    <View style={{paddingTop: 20}}> 
                        <Text style={{ fontSize: 24, color:this.state.g_color}}>{this.state.res_msg}</Text>
                    </View>
                    :
                    null
                    }
                    {this.state.covidTest === true?
                    <View style={{paddingTop: 60, paddingBottom: 50}}>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} onPress={this.getCovidTest}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Check for COVID or Influenza</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.flashMessage}>
                        <Text style={{color:'red'}}>Fill in your details through manual data entry</Text>
                    </View>
                    }
                    {/* {this.state.covidTest === true?
                    <View style={{paddingTop: 10, paddingBottom: 20}}>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} onPress={this.getReset}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Reset</Text>
                        </TouchableOpacity>
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
        top: -120
    },

    FitbitLoginStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00B0B9',
        height: 80,
        borderRadius: 25,
        margin: 10,
        paddingLeft: 25,
        paddingRight: 25,
        width: 360,
       
      },
      GoogleLoginButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        height: 80,
        borderRadius: 25,
        margin: 10,
        paddingLeft: 25,
        paddingRight: 25,
        width: 360,
       
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
        paddingLeft: 20,
        textAlign: 'center'
      },
      TextStyleGoogle :{
        textAlign: 'center',
        color: "white",
        marginBottom : 4,
        marginRight :20,
        fontSize: 28,
        fontWeight: 'bold',
        paddingLeft: 15,
        textAlign: 'center'
      },
       
      SeparatorLine :{
      backgroundColor : '#fff',
      width: 1,
      height: 80
       
      }
})

export default MainHomeScreen
