import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions, Platform, PixelRatio } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';

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

class ProfileScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            height: '',
            weight: '',
            dob: '',
            gen: '',
            race: '',
            ethini: '',
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getData();
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }
       
    getData = async () => {
        if(await AsyncStorage.getItem('userHeight')===null) {
            var height = 'Unknown'
        } else {
            var height_unit = (await AsyncStorage.getItem('heightUnit')).toString();
            var height = await AsyncStorage.getItem('userHeight')+' '+height_unit;
        }
        if(await AsyncStorage.getItem('userWeight')===null) {
            var weight_val = 'Unknown'  
        } else {
            var weight_unit = (await AsyncStorage.getItem('weightUnit')).toString();
            var weight_val = await AsyncStorage.getItem('userWeight')+' '+weight_unit;
        }
        if(await AsyncStorage.getItem('userFullDob')){
            var dob_val = await AsyncStorage.getItem('userFullDob'); 
        } else {
            var dob_val = 'Unknown';
        }
        if(await AsyncStorage.getItem('userGender')) {
            var gender = await AsyncStorage.getItem('userGender');
        } else {
            var gender = 'Unknown';
        }
        if(await AsyncStorage.getItem('userRace')) {
            var race_val = await AsyncStorage.getItem('userRace');
        } else {
            var race_val = 'Unknown';
        }
        var ethini_val = await AsyncStorage.getItem('userEthini');
        if (ethini_val === 'Hispanic or Latino') {
            ethini_val = " Yes"
        } else {
            ethini_val = " No"
        }
        this.setState({
            height: height, 
            weight: weight_val ,
            dob: dob_val,
            gen: gender,
            race: race_val,
            ethini: ethini_val
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.profileLogo}>
                        <Image source={require('../appIcons/baseline_account_circle_black_48pt_3x.png')} resizeMode='contain' style={styles.headerIconStyle}></Image>
                    </View>
                    <View style={styles.profileTitle}>
                        <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                        My Profile
                        </Text>
                    </View>
                    <View style={styles.profileContent}>
                        <View style={styles.profileContentHeight}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>Height</Text>
                            <Text adjustsFontSizeToFit style={styles.headerContentResultText}>{this.state.height}</Text>
                        </View>
                        <View style={styles.profileContentWeight}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>Weight</Text>
                            <Text adjustsFontSizeToFit style={styles.headerContentResultText}>{this.state.weight}</Text>
                        </View>
                        <View style={styles.profileContentDob}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>Date of Birth</Text>
                            <Text adjustsFontSizeToFit style={styles.headerContentResultText}>{this.state.dob}</Text>
                        </View>
                        <View style={styles.profileContentSex}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>Sex</Text>
                            <Text adjustsFontSizeToFit style={styles.headerContentResultText}>{this.state.gen}</Text>
                        </View>
                        <View style={styles.profileContentRace}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>Race</Text>
                            <Text adjustsFontSizeToFit style={styles.headerContentResultText}>{this.state.race}</Text>
                        </View>
                        <View style={styles.profileContentEthini}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>Hispanic or Latino?</Text>
                            <Text adjustsFontSizeToFit style={styles.headerContentResultText}>{this.state.ethini}</Text>
                        </View>
                    </View>
                    <View style={styles.profileSubmitButton}>
                        <TouchableOpacity style={styles.profileButtonTop} activeOpacity = {.5} onPress={ async() => { this.props.navigation.navigate('edit')}}>
                            <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default ProfileScreen

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
        aspectRatio: SCREEN_WIDTH/SCREEN_HEIGHT,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileLogo: {
        flex: 2.5,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10rem', 
        marginRight: '10rem',
    },
    profileTitle: {
        flex: 0.7,
        width: '100%',
    },
    profileContent: {
        flex: 4,
        width: '100%',
        paddingTop: '8rem'
    },
    profileSubmitButton: {
        flex: 2,
        width: '100%',
        paddingTop: '10rem'
    },
    headerIconStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10rem', 
        marginRight: '10rem'
    },
    headerTitleText: {
        fontSize: '20rem', 
        fontWeight: 'bold', 
        color: '#000000', 
        textAlign: 'center',  
        marginLeft: '10rem', 
        marginRight: '10rem'
    },
    headerContentText: {
        flex: 1.2,
        fontSize: '18rem', 
        color: '#000000',
        marginLeft: '30rem',
    },
    headerContentResultText: {
        flex: 1,
        fontSize: '18rem', 
        color: '#000000',
        textAlign:'right',
        marginRight: '30rem',
    },
    profileContentHeight: {
        flex: 0.7,
        width: '100%',
        flexDirection: 'row',
    },
    profileContentWeight: {
        flex: 0.7,
        width: '100%',
        flexDirection: 'row'
    },
    profileContentDob: {
        flex: 0.7,
        width: '100%',
        flexDirection: 'row'
    },
    profileContentSex: {
        flex: 0.7,
        width: '100%',
        flexDirection: 'row'
    },
    profileContentRace: {
        flex: 0.7,
        width: '100%',
        flexDirection: 'row'
    },
    profileContentEthini: {
        flex: 1,
        width: '100%',
        flexDirection: 'row'
    },
    profileButtonTop: {
        backgroundColor: '#adadad',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '20rem', 
        marginRight: '20rem'
    },
    buttonTextStyle: {
        textAlign: 'center', 
        alignContent:'flex-start', 
        marginLeft: '25rem', 
        marginRight: '25rem',
        fontSize: '18rem', 
        color: '#000000',
    },
})
