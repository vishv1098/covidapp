import React, {Component} from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, Dimensions, Platform, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { LocalNotification, ScheduledLocalNotification } from './LocalPushController'
import config from '../configFiles/config'
import googleConfig from '../configFiles/googleConfig'
import { ConfirmDialog } from 'react-native-simple-dialogs';
import AddModal from './AddModal';

var screenWidth = Dimensions.get('screen').width;
var screenHeight = Math.round(Dimensions.get('window').height);

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 380;

let entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
  
export function normalize(size) {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

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

class Home extends Component {

    constructor(props){
        super(props)
        this._testScheduleNotification();
        this.state = {
            googleFitName: 'Connect to Google Fit',
            fitbitName: 'Connect to a Fitbit tracker',
            fitbit_accesstoken: '',
            google_accesstoken: '',
            infodialogVisible: false,
            aboutAppDialogVisible: false,
            termsandcondition: false,
            missingInfoWarn: false,
        }
        this._onFormData = this._onFormData.bind(this);
    }

    async componentDidMount() {
        await this.getData();
        await this.getFitbitData();
    }

    _testnotification = async() => {
        LocalNotification()
    }

    _testScheduleNotification = async() => {
        ScheduledLocalNotification()
    }

    getFitbitData = async () => {
        try {
          const refreshtoken = await AsyncStorage.getItem('fitbit_refreshtoken')
          await refresh_Fitbit(refreshtoken)
          const value = await AsyncStorage.getItem('fitbit_accesstoken')
          if(value !== null) {
            this.setState({
              fitbit_accesstoken: value,
              fitbitName: 'Disconnect from Fitbit tracker'
            })
          }
        } catch(e) {
        }
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('googlefit_accesstoken')
            // console.log("cur:"+value);
            if(value !== null) {
                await this.refreshData();
            }
        } catch(e) {
        }
    }

    refreshData = async () =>{
        await GoogleSignin.clearCachedAccessToken(await AsyncStorage.getItem('googlefit_accesstoken'));
        const currentUser = GoogleSignin.getTokens().then(async(res)=>{
            try {
                // console.log("Res:"+res.accessToken)
                await AsyncStorage.setItem('googlefit_accesstoken', res.accessToken)
            } catch (e) {
                // alert('Failed to save the data to the storage. Please Sign out of the fitness tracker and login once again')
            }
            g_accessToken = res.accessToken
            this.setState({
                google_accesstoken: g_accessToken,
                googleFitName: 'Disconnect from Google Fit'
            })
        });
    }

    _onFitbit = async() => {
        if (this.state.fitbitName === "Connect to a Fitbit tracker") {
            const authdata = await OAuth_Fitbit()
            var x_data = ''
            await axios.get('https://api.fitbit.com/1/user/-/profile.json',{
                headers:{
                    Authorization: 'Bearer ' + authdata.accessToken
                }
            }).then((resp) => {
                x_data = resp.data
            }).catch((error) => {
            })
            this.setState({
                fitbit_accesstoken: authdata.accessToken,
                fitbitName: 'Disconnect from Fitbit tracker',
            })

        } else {
            await OAuth_Fitbit_logout()
            await AsyncStorage.setItem('fitbit_accesstoken', '')
            await AsyncStorage.setItem('fitbit_refreshtoken', '')
            this.setState({
                fitbitName: 'Connect to a Fitbit tracker',
                fitbit_accesstoken: ''
            })
        }
    }

    _onGooglefit = async() => {
        if (this.state.googleFitName === "Connect to Google Fit") {
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
                            } catch (e) {
                                alert('Failed to save the data to the storage. Please Sign out of the fitness tracker and login onces again')
                            }
                            g_accessToken = res.accessToken
                            this.setState({
                                google_accesstoken: g_accessToken
                            })
                            this.setState({
                                googleFitName: 'Disconnect from Google Fit'
                            })
                        });
                    })
                    .catch((error) => {
                    });
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
                googleFitName: 'Connect to Google Fit',
            })
        }
    }

    storeData = async() => {
        var x_access = this.state.google_accesstoken.toString()
        var check = await AsyncStorage.getItem("googlefit_accesstoken")
    }

    setData = async () => {
        //
    }

    _onFormData = async() => {
        this.refs.addModal.showAddModal();
    }

    dataChecker = async() =>{
        if(await AsyncStorage.getItem('userHeight') !== null && await AsyncStorage.getItem('userWeight') !== null && await AsyncStorage.getItem('userFullDob')
        && await AsyncStorage.getItem('userGender') && await AsyncStorage.getItem('userRace')) {
            this.props.navigation.navigate('Self Assessment');
        }
        else{
            this.setState({
                missingInfoWarn:true
            })
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.contentContainer}>
                    <ConfirmDialog
                        visible={this.state.infodialogVisible}
                        title="Disclaimer"
                        titleStyle={styles.disclaimer}
                        dialogStyle={styles.disclaimerDialog}
                        onTouchOutside={() => this.setState({infodialogVisible: false})}
                        positiveButton={{
                            title: "OK",
                            titleStyle: styles.disclaimerButtonStyle,
                            style: styles.disclaimerButton,
                            onPress: () => this.setState({infodialogVisible: false})
                        }}
                        >
                        <ScrollView>
                            <Text style={styles.disclaimerContent}>This App provides real-time tracking of vital signs and self-reported symptoms to predict the probability of having COVID-19 vs Influenza on an individual basis. The data and services provided by this App are an information resource only, and are not to be used or relied on for any diagnostic or treatment purpose. This information does not create any patient-physician relationship, and should not be used as a substitute for professional diagnosis and treatment.</Text>
                            <Text style={styles.disclaimerContent}>The App cannot be held accountable for any decisions made based on the information provided. Consult your healthcare provider before making any healthcare decisions or for guidance about a specific medical condition.</Text>
                            <Text style={styles.disclaimerContent}>Your data is used to make predictions on-device using Machine Learning models, and is not collected or stored for any other purpose.</Text>
                        </ScrollView>
                    </ConfirmDialog>
                    <ConfirmDialog
                        visible={this.state.aboutAppDialogVisible}
                        title="About this App"
                        titleStyle={styles.disclaimer}
                        dialogStyle={styles.disclaimerDialog}
                        onTouchOutside={() => this.setState({aboutAppDialogVisible: false})}
                        positiveButton={{
                            title: "OK",
                            titleStyle: styles.disclaimerButtonStyle,
                            style: styles.disclaimerButton,
                            onPress: () => this.setState({aboutAppDialogVisible: false})
                        }}
                        >
                        <ScrollView>
                            <Text style={styles.disclaimerContent}>Any details we wish to provide, such as developers, contacts and other licensing information.</Text>
                            <Text style={styles.disclaimerContent}>Would be good to include some details on the models too.</Text>
                        </ScrollView>
                    </ConfirmDialog>
                    <ConfirmDialog
                        visible={this.state.missingInfoWarn}
                        title="Missing Data"
                        titleStyle={styles.disclaimer}
                        dialogStyle={styles.disclaimerDialog}
                        onTouchOutside={() => this.setState({missingInfoWarn: false})}
                        positiveButton={{
                            title: "Edit Profile",
                            titleStyle: styles.disclaimerButtonStyleBold,
                            style: styles.disclaimerButton,
                            onPress: () => {this.setState({missingInfoWarn: false}),this.props.navigation.navigate('profile')}
                        }}
                        negativeButton={{
                            title: "Continue",
                            titleStyle: styles.disclaimerButtonStyle,
                            style: styles.disclaimerButton,
                            onPress: () =>{this.setState({missingInfoWarn: false}),this.props.navigation.navigate('Self Assessment')} 
                        }}
                        >
                        <ScrollView>
                            <Text style={styles.disclaimerContent}>Oops! You haven't provided some data about yourself.</Text>
                            <Text style={styles.disclaimerContent}>Missing data may cause the model to predict incorrect results. </Text>
                        </ScrollView>
                    </ConfirmDialog>
                    <View style={styles.titleBox}>
                        {/* <View style={styles.trackerTitle}> */}
                        <Text adjustsFontSizeToFit style={styles.titleNameStyle}>Connect your Fitness Tracker</Text>
                        {/* </View> */}
                        {/* <View style={styles.trackerContent}> */}
                        <Text adjustsFontSizeToFit style={styles.titleContentStyle}>Our Machine Learning models use your vital signs to make predictions about your health. Connect to your Fitbit® tracker or Google Fit in order to use your vitals data in this App.</Text>
                        {/* </View> */}
                    {/* </View> */}
                    {/* <View style={styles.fitbitBox}> */}
                        <TouchableOpacity style={styles.fitbitButtonTop} activeOpacity = {.5} onPress={this._onFitbit}>
                            <Image source={require('../appIcons/fitbit.png')} resizeMode='contain' style={styles.ImageIconStyle}></Image>
                            <Text adjustsFontSizeToFit style={styles.fitbitButtonTextStyle}>{this.state.fitbitName}</Text>
                        </TouchableOpacity>
                    {/* </View> */}
                    {/* <View style={styles.googleFitBox}> */}
                        <TouchableOpacity style={styles.googlefitButtonTop} activeOpacity = {.5} onPress={this._onGooglefit}>
                            <Image source={{ uri: "https://www.gstatic.com/images/branding/product/1x/gfit_512dp.png" }} resizeMode='contain' style={styles.ImageIconStyle}></Image>
                            <Text adjustsFontSizeToFit style={styles.googleFitButtonTextStyle}>{this.state.googleFitName}</Text>
                        </TouchableOpacity>
                    {/* </View> */}
                    {/* <View style={styles.assessmentBox}> */}
                        {/* <View style={styles.assessInfo}> */}
                            <View style={styles.testTitle}>
                                {/* <View style={styles.testName}> */}
                                    <Text adjustsFontSizeToFit style={styles.titleNameStyle}>Take a COVID-19 Assessment</Text>
                                {/* </View> */}
                                <TouchableOpacity style={styles.testIcon} activeOpacity = {.5} onPress={()=>this.setState({infodialogVisible:true})}>
                                    <Icon name='information-circle-outline' size={30} />
                                </TouchableOpacity>
                            </View>
                            {/* <View style={styles.testInfo}> */}
                                    <Text adjustsFontSizeToFit style={styles.titleContentStyle}>Predict whether you should take a COVID-19 test, based on your symptoms and vitals data.</Text>
                            {/* </View> */}
                        {/* </View> */}
                        {/* <View style={styles.assessButton}> */}
                            <TouchableOpacity style={styles.buttonTop} activeOpacity = {.5} onPress={ async() => { this.dataChecker() }}>
                                <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Start Assessment</Text>
                            </TouchableOpacity>
                        {/* </View> */}
                    {/* </View> */}
                    {/* <View style={styles.profileBox}> */}
                        {/* <View style={styles.profileText}> */}
                            <Text adjustsFontSizeToFit style={styles.titleNameStyle}>Profile and Settings</Text>
                        {/* </View> */}
                        {/* <View style={styles.profileButton}> */}
                            <TouchableOpacity style={styles.profileButtonTop} activeOpacity = {.5} onPress={ async() => { this.props.navigation.navigate('profile')}}>
                                <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>View Profile</Text>
                            </TouchableOpacity>
                        {/* </View> */}
                    </View>
                    <View style={styles.termsAndConditionBox}>
                        <View style={styles.aboutApp}>
                            <TouchableOpacity style={styles.aboutButtonTop} activeOpacity = {.5} onPress={()=>this.setState({aboutAppDialogVisible:true})}>
                                <Text adjustsFontSizeToFit style={styles.aboutAppTextStyle}>About this App</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.termsBox}>
                            <TouchableOpacity style={styles.tcButtonTop} activeOpacity = {.5} onPress={this._onFormData}>
                                <Text adjustsFontSizeToFit style={styles.aboutAppTextStyle}>T {"&"} C</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <AddModal ref={'addModal'} setData={this.setData}>
                    </AddModal>
                </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = EStyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        // justifyContent: 'center',
        // alignItems: 'center',
        // flex:1,
        padding: 10,
        backgroundColor: 'white'
    },
    contentContainer: {
        width: "100%",
        // paddingTop: '30rem',
        aspectRatio: SCREEN_WIDTH/SCREEN_HEIGHT,
        // flexDirection: "column",
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    disclaimer: {
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '24rem',
        fontWeight: 'bold'
    },
    disclaimerDialog: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    disclaimerContent: {
        fontSize: '16rem',
        paddingBottom: '10rem',
    },
    disclaimerButtonStyle: {
        fontSize:'16rem',
        color:'#007aff',
        fontWeight:'400'
    },
    disclaimerButtonStyleBold: {
        fontSize:'16rem',
        color:'#007aff',
        fontWeight:'bold'
    },
    disclaimerButton: {
        // paddingBottom: '10rem'
    },
    ImageIconStyle: {
        height: '40rem',
        width: '40rem',
        resizeMode : 'stretch',
        marginLeft: '20rem'
    },
    titleBox: {
        // flex: 2.5,
        width: "100%",
        flexDirection: 'column',
    },
    assessInfo: {
        // flex: 1,
        flexDirection: 'column'
    },
    testName: {
        // flex: 9,
    },
    testIcon: {
        // flex: 1.5,
        marginTop: '3.5rem',
        alignSelf: 'center',
    },
    assessButton: {
        // flex: 1,
        marginTop: '10rem'
    },
    testTitle: {
        // flex: 2,
        flexDirection: 'row'
    },
    buttonTop: {
        backgroundColor: '#169169',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '10rem', 
        marginRight: '10rem',
        marginTop: '10rem',
        marginBottom: '10rem'
    },
    fitbitButtonTop: {
        backgroundColor: '#000000',
        flexDirection: 'row',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '10rem', 
        marginRight: '10rem',
        marginTop: '10rem',
        marginBottom: '7.5rem',
    },
    googlefitButtonTop: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '10rem', 
        marginRight: '10rem',
        marginTop: '7.5rem',
        marginBottom: '10rem',
    },
    profileButtonTop: {
        backgroundColor: '#adadad',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '10rem',
        marginLeft: '10rem', 
        marginRight: '10rem',
        marginBottom: '7.5rem'
    },
    aboutButtonTop: {
        backgroundColor: '#adadad',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '7.5rem',
        marginLeft: '10rem', 
        marginRight: '7.5rem',
    },
    tcButtonTop: {
        backgroundColor: '#adadad',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '7.5rem',
        marginLeft: '7.5rem', 
        marginRight: '10rem',
    },
    buttonTextStyle: {
        textAlign: 'center', 
        alignContent:'flex-start', 
        marginLeft: '25rem', 
        marginRight: '25rem',
        fontSize: '18rem', 
        color: '#000000',
    },
    fitbitButtonTextStyle: {
        flex: 10, 
        textAlign: 'center', 
        alignContent:'flex-start',
        marginRight: '25rem',
        fontSize: '18rem', 
        color: 'white',
    },
    googleFitButtonTextStyle: {
        flex: 10, 
        textAlign: 'center', 
        alignContent:'flex-start',
        marginRight: '25rem',
        fontSize: '18rem', 
        color: '#000000',
    },
    testInfo: {
        // flex: 2.5,
    },
    trackerTitle: {
        // flex: 1.3,
        // justifyContent: 'center',
        // alignContent: 'center',
    },
    titleNameStyle: {
        fontSize: '20rem',
        fontWeight: 'bold',
        marginTop: '5rem',
        // marginBottom: '3rem',
        marginLeft: '10rem',
        marginRight: '10rem',
        // alignItems: 'center',
        // alignContent: 'center'
    },
    titleContentStyle: {
        marginLeft: '10rem',
        marginRight: '10rem',
        marginTop: '10rem',
        marginBottom: '5rem',
        fontSize: '16rem',
    },
    trackerContent: {
        backgroundColor: 'blue'
    },
    fitbitBox: {
        // flex: 1.5,
        justifyContent: 'center',
        width: "100%",
    },
    googleFitBox: {
        // flex: 1.5,
        justifyContent: 'center',
        width: "100%",
    },
    assessmentBox: {
        // flex: 3,
        width: "100%",
    },
    profileBox: {
        // flex: 2,
        width: "100%",
        flexDirection: 'column'
    },
    termsAndConditionBox: {
        // flex: 2,
        width: "100%",
        flexDirection: 'row'
    },
    profileText: {
        flex: 1,
    },
    aboutApp: {
        flex: 1,
    },
    aboutAppTextStyle: {
        textAlign: 'center', 
        alignContent:'flex-start', 
        marginLeft: '10rem', 
        marginRight: '10rem',
        fontSize: '18rem', 
        color: '#000000',
    },
    termsBox: {
        flex: 1,
        // marginBottom: '30rem'
        // paddingBottom: '10rem'
    },
    profileButton: {
        // flex: 2,
    },
})

export default Home
