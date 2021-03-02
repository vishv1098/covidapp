import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, Platform, PixelRatio } from 'react-native';
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

class NoPrediction extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text adjustsFontSizeToFit style={styles.titleNameStyle}>COVID-19 Assessment Result</Text>
                    <Text adjustsFontSizeToFit style={styles.titleContentStyle}>A prediction could not be provided due to the lack of necessary data, please fill in your vital details to get a prediction.</Text>
                    <Text adjustsFontSizeToFit style={styles.titleContentStyle}>Please consult your physician if you are unwell.</Text>
                    <TouchableOpacity style={styles.profileButtonTop} activeOpacity = {.5} onPress={ async() => { this.props.navigation.navigate('Home')}}>
                        <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default NoPrediction

const styles = EStyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        padding: 10,
        backgroundColor: 'white'
    },
    contentContainer: {
        width: "100%",
        aspectRatio: SCREEN_WIDTH/SCREEN_HEIGHT,
    },
    headerTitle: {
        flex: 0.3,
        width: '100%'
    },
    headerInfo: {
        flex: 0.3,
        width: '100%'
    },
    headerResult: {
        width: '100%'
    },
    headerMessage: {
        width: '100%'
    },
    reset: {
        width: '100%',
        paddingTop: '20rem'
    },
    titleNameStyle: {
        fontSize: '20rem',
        fontWeight: 'bold',
        marginTop: '5rem',
        marginBottom: '3rem',
        marginLeft: '10rem',
        marginRight: '10rem',
        alignItems: 'center',
        alignContent: 'center'
    },
    titleContentStyle: {
        marginTop: '10rem',
        marginBottom: '10rem',
        marginLeft: '10rem',
        marginRight: '10rem',
        fontSize: '16rem',
    },
    testButtonTop: {
        backgroundColor: '#a5d6a7',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '20rem', 
        marginRight: '20rem',
        marginTop: '5rem',
        marginBottom: '5rem'
    },
    profileButtonTop: {
        backgroundColor: '#adadad',
        height: '55rem', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '20rem', 
        marginRight: '20rem',
        marginTop: '5rem',
        marginBottom: '5rem'
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

