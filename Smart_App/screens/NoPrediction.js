import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, Platform, PixelRatio } from 'react-native';
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

class NoPrediction extends Component {

    constructor(props) {
        super(props);
        this.state = {//new
            date:'No History',
            result:'',
        }
        this.prevHistory();//new
    }
    prevHistory = async() =>{//new
        var history = await AsyncStorage.getItem('history');
        console.log('Entered Test');
        history = JSON.parse(history);
        console.log(history[history.length - 1].result.toString());
        if(history[history.length - 1] !== undefined){
            this.setState({
               date: history[history.length - 1].date.toString(), 
               result: history[history.length - 1].result.toString(),
            })
        }
    }
    setColor(text){//new
        if(text.toString() === 'Healthy'){
            return '#a5d6a7';
        } else if(text.toString() === 'Unwell'){
            return '#ffcc80';
        } else if(text.toString() === "Visit physician"){
            return '#ef9a9a';
        }
        return '#adadad'//new
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
                    {/* new */}
                    <Text adjustsFontSizeToFit style={styles.previousContentStyle}>Previous result</Text> 
                    <View style={[styles.resultContent,{backgroundColor:this.setColor(this.state.result)}]}>
                        <Text style={styles.headerContentText}>{this.state.date}</Text>
                        <Text style={styles.headerContentResultText}>{this.state.result}</Text>
                    </View>
                    {/* <TouchableOpacity style={styles.profileButtonTop} activeOpacity = {.5} onPress={ async() => { this.props.navigation.navigate('hist')}}>
                        <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Assessment history</Text>
                    </TouchableOpacity> */}
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
         //new
         previousContentStyle: {
            marginTop: '10rem',
            marginLeft: '10rem',
            marginRight: '10rem',
            fontSize: '16rem',
            fontWeight:'bold',
        },
         headerContentText: {
            flex:1,
            fontSize: '20rem', 
            color: '#000000',
            marginLeft:30,
        },
        headerContentResultText: {
            flex:1,
            marginRight:30,
            textAlign:'right',
            fontSize: '20rem', 
            color: '#000000',
        },
        resultContent: {
            height: '55rem',
            marginLeft: '20rem', 
            marginRight: '20rem',
            flexDirection: 'row',
            marginTop: '15rem',
            marginBottom: '15 rem',
            alignItems:'center',
            justifyContent: 'center', 
            borderRadius: 10,
          
        }
    
})

