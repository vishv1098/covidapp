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

class CovidScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    {/* <View style={styles.headerTitle}> */}
                        <Text adjustsFontSizeToFit style={styles.titleNameStyle}>COVID-19 Assessment Result</Text>
                    {/* </View> */}
                    {/* <View style={styles.headerInfo}> */}
                        <Text adjustsFontSizeToFit style={styles.titleContentStyle}>Based on your symptoms and vitals, we think</Text>
                    {/* </View> */}
                    {/* <View style={styles.headerResult}> */}
                        <TouchableOpacity style={styles.testButtonTop} activeOpacity = {.5}>
                            <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>You should take a test</Text>
                        </TouchableOpacity>
                    {/* </View> */}
                    {/* <View style={styles.headerMessage}> */}
                        <Text adjustsFontSizeToFit style={styles.titleContentStyle}>Consult your physician at the earliest and receive their recommendation on whether you should take a COVID-19 test.</Text>
                    {/* </View> */}
                    {/* <View style={styles.reset}> */}
                        <TouchableOpacity style={styles.profileButtonTop} activeOpacity = {.5} onPress={ async() => { this.props.navigation.navigate('Home')}}>
                            <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Home</Text>
                        </TouchableOpacity>
                    {/* </View> */}
                </View>
            </View>
        );
    }
}

export default CovidScreen

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
    headerTitle: {
        flex: 0.3,
        width: '100%'
    },
    headerInfo: {
        flex: 0.3,
        width: '100%'
    },
    headerResult: {
        // flex: 0.6,
        width: '100%'
    },
    headerMessage: {
        // flex: 0.6,
        width: '100%'
    },
    reset: {
        // flex: 3,
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
        backgroundColor: '#ef9a9a',
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
