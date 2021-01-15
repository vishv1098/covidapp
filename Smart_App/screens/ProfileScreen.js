import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, Platform, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
        this.getData();
        this.state = {
            height: '',
            weight: '',
            dob: '',
            gen: '',
            race: '',
            ethini: '',
        }
    }

    getData = async () => {
        var height = await AsyncStorage.getItem('userHeight');
        var realFeet = ((height*0.393700) / 12);
        var feet = Math.floor(realFeet);
        var inches = Math.round((realFeet - feet) * 12);
        var weight_val = await AsyncStorage.getItem('userWeight');
        var dob_val = await AsyncStorage.getItem('userFullDob');
        var gender = await AsyncStorage.getItem('userGender');
        var race_val = await AsyncStorage.getItem('userRace');
        var ethini_val = await AsyncStorage.getItem('userEthini');
        if (ethini_val === 'Hispanic or Latino') {
            ethini_val = "Yes"
        } else {
            ethini_val = "No"
        }
        this.setState({
            height: feet + " ft, " + inches + ' in',
            weight: weight_val + " kg",
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
                        <Icon name='person-circle-outline' size={normalize(150)} color="black" style={styles.headerIconStyle} />
                    </View>
                    <View style={styles.profileTitle}>
                        <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                        My Profile
                        </Text>
                    </View>
                    <View style={styles.profileContent}>
                        <View style={styles.profileContentHeight}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>
                                Height: {this.state.height}
                            </Text>
                        </View>
                        <View style={styles.profileContentWeight}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>
                                Weight: {this.state.weight}
                            </Text>
                        </View>
                        <View style={styles.profileContentDob}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>
                                Date of Birth: {this.state.dob}
                            </Text>
                        </View>
                        <View style={styles.profileContentSex}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>
                                Sex: {this.state.gen}
                            </Text>
                        </View>
                        <View style={styles.profileContentRace}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>
                                Race: {this.state.race}
                            </Text>
                        </View>
                        <View style={styles.profileContentEthini}>
                            <Text adjustsFontSizeToFit style={styles.headerContentText}>
                                Hispanic or Latino?: {this.state.ethini}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.profileSubmitButton}>
                        <TouchableOpacity style={styles.profileButtonTop} activeOpacity = {.5} onPress={ async() => { this.props.navigation.navigate('EditProfile')}}>
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
        aspectRatio: 0.5,
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
        fontSize: '18rem', 
        fontWeight: 'bold', 
        color: '#000000', 
        textAlign: 'center',  
        marginLeft: '10rem', 
        marginRight: '10rem'
    },
    headerContentText: {
        fontSize: '18rem', 
        color: '#000000',
        marginLeft: '30rem', 
        marginRight: '30rem',
    },
    profileContentHeight: {
        flex: 0.7,
        width: '100%',
    },
    profileContentWeight: {
        flex: 0.7,
        width: '100%',
    },
    profileContentDob: {
        flex: 0.7,
        width: '100%',
    },
    profileContentSex: {
        flex: 0.7,
        width: '100%',
    },
    profileContentRace: {
        flex: 0.7,
        width: '100%',
    },
    profileContentEthini: {
        flex: 1,
        width: '100%',
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
        fontSize: '20rem', 
        color: '#000000',
    },
})
