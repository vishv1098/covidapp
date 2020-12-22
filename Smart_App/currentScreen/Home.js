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

const covid_modelJson = require('../components/COVIDOnly/model.json')
const covid_modelWeights = require('../components/COVIDOnly/group1-shard1of1.bin')

const influ_modelJson = require('../components/InfluenzaOnly/model.json')
const influ_modelWeights = require('../components/InfluenzaOnly/group1-shard1of1.bin')

const covid_infl_modelJson = require('../components/COVIDvsInfluenza/model.json')
const covid_infl_modelWeights = require('../components/COVIDvsInfluenza/group1-shard1of1.bin')

const BACKEND_CONFIG = 'cpu';

export class Home extends Component{

    constructor(props){
        super(props)
        this._testScheduleNotification();
        this.getData();
        this.state = {
            visibility:false,
            covid: false,
            influ: false,
            safe: false,
            result: false,
            res_score: 0,
            res_msg: 'Please click on the button to check result',
            g_color: 'green',
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
        }
        
    }

    async componentDidMount() {
        //
        await tf.setBackend(BACKEND_CONFIG);
        await tf.ready();
        console.log("componentDidMount: tf.ready is set");
        console.log("the MyModelLoadLocal component is mounted");
    }

    getData = async () => {
        var oxygen = await AsyncStorage.getItem('oxygen_saturation')
        var bloodp = await AsyncStorage.getItem('diastolic_bloodpressure')
        var bloodsp = await AsyncStorage.getItem('systolic_bloodpressure')
        var hr = await AsyncStorage.getItem('heart_rate')
        var rp = await AsyncStorage.getItem('respiratory_rate')
        var temp = await AsyncStorage.getItem('temperature')
        var s = await AsyncStorage.getItem('sex')
        var white = await AsyncStorage.getItem('white-valid')
        var black = await AsyncStorage.getItem('black-valid')
        var other = await AsyncStorage.getItem('others-valid')
        var ethini = await AsyncStorage.getItem('ethini-valid')
        var age = await AsyncStorage.getItem('age-group')
        // const oxygen = await AsyncStorage.getItem('oxygen_saturation');
        // console.log("Hi bye 1")
        // console.log(z)
        // console.log("Hi bye 2")
        this.setState({
            oxy: parseInt(oxygen),
            dbp: parseInt(bloodp),
            sbp: parseInt(bloodsp),
            hr: parseInt(hr),
            res_r: parseInt(rp),
            b_tmp: parseFloat(temp),
            sex: parseInt(s),
            white: parseInt(white),
            black: parseInt(black),
            others: parseInt(other),
            ethini: parseInt(ethini),
            age: parseFloat(age),
        })
    }

    _testnotification = async() => {
        LocalNotification()
    }

    _testScheduleNotification = async() => {
        ScheduledLocalNotification()
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

    checkValidation = async () => {
        await this.getData();
        if (this.state.datapresent === false) {
            this.setState({
                visibility:true,
            })
        } else {
            await this.getCovidTest();
            // console.log(this.state.oxy)
            // var z = [this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]
            // console.log(z)
        }
        
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
                        percentage={this.state.res_score}

                        progressColor={this.state.g_color}
                    >
                        <Text style={{ fontSize: 32, color:this.state.g_color }}> {this.state.res_score}%</Text>
                    </SemiCircleProgress>
                 </View>
                <View style={styles.subcontainer} alignSelf='center'>
                    <Text style={{ fontSize: 24, alignContent: 'space-around', color:this.state.g_color}}>{this.state.res_msg}</Text>
                </View>   
                <View style={styles.subcontainerButton}>                                     
                    <TouchableOpacity style={styles.leftbutton} activeOpacity = {.5} onPress={ () => this.props.navigation.navigate('Self Assessment')}>
                                <Text style={styles.btntext}>Self Assessment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} activeOpacity = {.5} onPress={this.checkValidation}>
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

