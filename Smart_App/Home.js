import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Dialog from "react-native-dialog";
import SemiCircleProgress from './SemiCircle';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { LocalNotification, ScheduledLocalNotification } from './LocalPushController'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

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

export class Home extends Component{

    constructor(props){
        super(props)
        this._testScheduleNotification();
        this.state = {
            visibility:false,
        }
        
    }

    _testnotification = async() => {
        LocalNotification()
    }

    _testScheduleNotification = async() => {
        ScheduledLocalNotification()
    }

    render() {
        const {prob} = this.props.route.params?this.props.route.params:0
        return(
            <View style={styles.container}>
                <Dialog.Container visible={this.state.visibility}> 
                    <Dialog.Title>Missing Data</Dialog.Title>
                    <Dialog.Description>
                        Oops! There seems to be some vital data missing.
                    </Dialog.Description>
                    <Dialog.Button label="OK" onPress = {() => this.setState({visibility:false},this.props.navigation.navigate('Profile') )}/>
                </Dialog.Container>
                <View style={styles.subcontainer} alignSelf='center'> 
                    <SemiCircleProgress
                        percentage={prob*100}

                        progressColor={'green'}
                    >
                        <Text style={{ fontSize: 32, color:'orange' }}> {prob?Math.round(prob*100):0}%</Text>
                    </SemiCircleProgress>
                 </View>
                <View style={styles.subcontainer} alignSelf='center'>
                    <Text style={{ fontSize: 24, color:'red'}}>"You have Covid"</Text>
                </View>   
                <View style={styles.subcontainerButton}>                                     
                    <TouchableOpacity style={styles.leftbutton} activeOpacity = {.5} onPress={ () => this.props.navigation.navigate('Self Assessment')}>
                                <Text style={styles.btntext}>Self Assessment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} activeOpacity = {.5} onPress={ () => this.setState({visibility:true,})}>
                            <Text style={styles.btntext}>Check for Covid</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    subcontainer:{
        flexDirection: "row",
        alignSelf:"stretch",
        justifyContent:"space-between",
        paddingBottom:70
    },
    subcontainerButton:{
        flexDirection: "row",
        alignSelf:"stretch",
        justifyContent:"space-around",
        paddingBottom:70
    },
    btntext:{
        color:'white',
        fontSize:18,
    },
    leftbutton: {
        alignSelf:'center',
        alignItems:'center',
        padding:20,
        backgroundColor:'#00B0B9',
        borderRadius:20,
        marginTop: 30,
        width:180,
    },
    button: {
        alignSelf:'center',
        alignItems:'center',
        padding:20,
        backgroundColor:'#00B0B9',
        borderRadius:20,
        marginTop: 30,
        width:200,
    },
});

