import React, {Component} from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, Dimensions, Platform, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

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

class Home extends Component {

    constructor(props){
        super(props)
        // this._testScheduleNotification();
        // this.getData();
        this.state = {
            //
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{flexGrow: 1,}}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleBox}>
                        <View style={styles.trackerTitle}>
                            <Text adjustsFontSizeToFit style={styles.titleNameStyle}>Connect your Fitness Tracker</Text>
                        </View>
                        <View style={styles.trackerContent}>
                                <Text adjustsFontSizeToFit style={styles.titleContentStyle}>Our Machine Learning models use your vital signs to make predictions about your health. Connect to your Fitbit® tracker or Google Fit in order to use your vitals data in this App.</Text>
                        </View>
                    </View>
                    <View style={styles.fitbitBox}>
                        <TouchableOpacity style={styles.fitbitButtonTop} activeOpacity = {.5}>
                            <Image source={require('../appIcons/fitbit.png')} resizeMode='contain' style={styles.ImageIconStyle}></Image>
                            <Text adjustsFontSizeToFit style={styles.fitbitButtonTextStyle}>Connect to a Fitbit tracker</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.googleFitBox}>
                        <TouchableOpacity style={styles.googlefitButtonTop} activeOpacity = {.5}>
                            <Image source={{ uri: "https://www.gstatic.com/images/branding/product/1x/gfit_512dp.png" }} resizeMode='contain' style={styles.ImageIconStyle}></Image>
                            <Text adjustsFontSizeToFit style={styles.googleFitButtonTextStyle}>Connect to Google Fit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.assessmentBox}>
                        <View style={styles.assessInfo}>
                            <View style={styles.testTitle}>
                                <View style={styles.testName}>
                                    <Text adjustsFontSizeToFit style={styles.titleNameStyle}>Take a COVID-19 Assessment</Text>
                                </View>
                                <View style={styles.testIcon}>
                                    <Icon name='information-circle-outline' size={30} />
                                </View>
                            </View>
                            <View style={styles.testInfo}>
                                    <Text adjustsFontSizeToFit style={styles.titleContentStyle}>Predict whether you should take a COVID-19 test, based on your symptoms and vitals data.</Text>
                            </View>
                        </View>
                        <View style={styles.assessButton}>
                            <TouchableOpacity style={styles.buttonTop} activeOpacity = {.5} onPress={ async() => { this.props.navigation.navigate('Self Assessment')}}>
                                <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Start Assessment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.profileBox}>
                        <View style={styles.profileText}>
                            <Text adjustsFontSizeToFit style={styles.titleNameStyle}>Profile and Settings</Text>
                        </View>
                        <View style={styles.profileButton}>
                            <TouchableOpacity style={styles.profileButtonTop} activeOpacity = {.5} onPress={ async() => { this.props.navigation.navigate('profile')}}>
                                <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>View Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.termsAndConditionBox}>
                        <View style={styles.aboutApp}>
                            <TouchableOpacity style={styles.profileButtonTop} activeOpacity = {.5}>
                                <Text adjustsFontSizeToFit style={styles.aboutAppTextStyle}>About this App</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.termsBox}>
                            <TouchableOpacity style={styles.profileButtonTop} activeOpacity = {.5}>
                                <Text adjustsFontSizeToFit style={styles.aboutAppTextStyle}>T {"&"} C</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        padding: 10,
        backgroundColor: 'white'
    },
    contentContainer: {
        width: "100%",
        paddingTop: '30rem',
        aspectRatio: 0.5,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageIconStyle: {
        height: '40rem',
        width: '40rem',
        resizeMode : 'stretch',
        marginLeft: '20rem'
    },
    titleBox: {
        flex: 2.5,
        width: "100%",
        flexDirection: 'column',
    },
    assessInfo: {
        flex: 1,
        flexDirection: 'column'
    },
    testName: {
        flex: 9,
    },
    testIcon: {
        flex: 1.5,
    },
    assessButton: {
        flex: 1,
    },
    testTitle: {
        flex: 2,
        flexDirection: 'row'
    },
    buttonTop: {
        backgroundColor: '#158158',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '10rem', 
        marginRight: '10rem'
    },
    fitbitButtonTop: {
        backgroundColor: '#000000',
        flexDirection: 'row',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '10rem', 
        marginRight: '10rem'
    },
    googlefitButtonTop: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '10rem', 
        marginRight: '10rem'
    },
    profileButtonTop: {
        backgroundColor: '#adadad',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '10rem', 
        marginRight: '10rem'
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
        flex: 2.5,
    },
    trackerTitle: {
        flex: 1.3,
        justifyContent: 'center',
        alignContent: 'center',
    },
    titleNameStyle: {
        fontSize: '21rem',
        fontWeight: 'bold',
        marginTop: '5rem',
        marginBottom: '3rem',
        marginLeft: '10rem',
        marginRight: '10rem',
        alignItems: 'center',
        alignContent: 'center'
    },
    titleContentStyle: {
        marginTop: '3rem',
        marginBottom: '5rem',
        marginLeft: '10rem',
        marginRight: '10rem',
        fontSize: '15rem',
    },
    trackerContent: {
        flex: 3,
    },
    fitbitBox: {
        flex: 1.5,
        justifyContent: 'center',
        width: "100%",
    },
    googleFitBox: {
        flex: 1.5,
        width: "100%",
    },
    assessmentBox: {
        flex: 3,
        width: "100%",
    },
    profileBox: {
        flex: 2,
        width: "100%",
        flexDirection: 'column'
    },
    termsAndConditionBox: {
        flex: 2,
        width: "100%",
        flexDirection: 'row'
    },
    profileText: {
        flex: 1.
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
    },
    profileButton: {
        flex: 2,
    }
})

export default Home
