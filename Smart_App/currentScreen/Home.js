import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Dialog from "react-native-dialog";
import SemiCircleProgress from './SemiCircle';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { LocalNotification, ScheduledLocalNotification } from './LocalPushController'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const covid_modelJson = require('../components/COVIDOnly/model.json')
const covid_modelWeights = require('../components/COVIDOnly/group1-shard1of1.bin')

const influ_modelJson = require('../components/InfluenzaOnly/model.json')
const influ_modelWeights = require('../components/InfluenzaOnly/group1-shard1of1.bin')

const covid_infl_modelJson = require('../components/COVIDvsInfluenza/model.json')
const covid_infl_modelWeights = require('../components/COVIDvsInfluenza/group1-shard1of1.bin')

const BACKEND_CONFIG = 'cpu';

class Home extends Component {

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
            google_token: null,
            fitbit_token: null,
            heart_rate_token: '',
            distance_token: '',
            calories_token: '',
            step_count_token: '',
            activity_token: '',
            startDate: "1607538600000",
            endDate: Date.now(),
        }
        
    }

    async componentDidMount() {
        // const {prob} = this.props.route.params?this.props.route.params:0
        // console.log(prob)
        console.log("Hi")
        await tf.setBackend(BACKEND_CONFIG);
        await tf.ready();
        console.log("componentDidMount: tf.ready is set");
        console.log("the MyModelLoadLocal component is mounted");
        var google_token_fetch = await AsyncStorage.getItem('googlefit_accesstoken')
        if (google_token_fetch !== null) {
            this.setState({
                google_token: google_token_fetch,
            })
        }
    }

    // async componentDidUpdate() {
    //     console.log("Hello")
    // }

    // async componentDidCatch() {
    //     console.log("Bye")
    // }

    // async componentWillUnmount() {
    //     console.log("Test")
    // }

    getData = async () => {
        console.log("Hi")
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

    dataSources = async() => {
        await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources',{
            headers: {
                'Authorization': 'Bearer ' + this.state.google_token
            }
        }).then((resp) => {
            // console.log(resp.data)
            var array = resp.data["dataSource"]
            // console.log(array)
            var heart_rate_token = ''
            var step_count_token = ''
            var distance_token = ''
            var calories_token = ''
            var activity_token = ''
            for( var q = 0; q < array.length; q++ ) {
                try {
                    if (array[q]["device"]["uid"] === "e3fc9470") {
                        // console.log(array[q]["dataStreamId"])
                        if (array[q]["dataStreamId"].includes("heart_rate")) {
                          heart_rate_token = array[q]["dataStreamId"]
                        }
                        if (array[q]["dataStreamId"].includes("distance")) {
                          distance_token = array[q]["dataStreamId"]
                        }
                        if (array[q]["dataStreamId"].includes("step_count")) {
                          step_count_token = array[q]["dataStreamId"]
                        }
                        if (array[q]["dataStreamId"].includes("calories")) {
                          calories_token = array[q]["dataStreamId"]
                        }
                        if (array[q]["dataStreamId"].includes("activity")) {
                          activity_token = array[q]["dataStreamId"]
                        }
                      }
                    // console.log(heart_rate_token)
                    // console.log(step_count_token)
                    // console.log(distance_token)
                    // console.log(calories_token)
                    // console.log(activity_token)
                    this.setState({
                        heart_rate_token: heart_rate_token,
                        step_count_token: step_count_token,
                        distance_token: distance_token,
                        calories_token: calories_token,
                        activity_token: activity_token
                    })
                    
                } catch (error) {
                    // console.log(error)
                }
            }
            if ((heart_rate_token === '') && (step_count_token === '') && (distance_token === '') && (calories_token === '') && (activity_token === '')) {
                alert('There is no device connected to your Google fit account. Please enter your vital signs manually from settings')
            }
        })


    }

    heartRateData = async() => {
        // console.log(this.state.startDate+"T00:00:00+0000")
        var myDate = new Date(this.state.startDate+"T00:00:00+0000");
        // console.log(myDate)
        var result1 = myDate.getTime();
        var result2 = this.state.endDate
        // console.log('https://www.googleapis.com/fitness/v1/users/me/dataSources/'+this.state.heart_rate_token+'/datasets/'+this.state.startDate+'000000-'+result2+'000000')
        await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/'+this.state.heart_rate_token+'/datasets/'+this.state.startDate+'000000-'+result2+'000000',{
            headers: {
                'Authorization': 'Bearer ' + this.state.google_token
            }
        }).then(async (resp) => {
            var array = resp.data["point"]
            var x = array[array.length - 1]
            var res = x.value[0].fpVal
            console.log(typeof(res))
            await AsyncStorage.setItem("HeartRate",res+'')
        })

    }

    checkValidation = async () => {
        // console.log("HI")
        // console.log(this.state.google_token)
        await this.getData();
        if (this.state.google_token === null) {
            this.setState({
                visibility:true,
            })
        } else {
            await this.dataSources();
            await this.heartRateData();
            await this.getCovidTest();
        }
        
    }

    render() {
        const {prob} = this.props.route.params?this.props.route.params:0
        // console.log(prob)
        // console.log("Hi")
        return(
            <View style={styles.container}>
                <Dialog.Container visible={this.state.visibility}> 
                    <Dialog.Title>Missing Data</Dialog.Title>
                    <Dialog.Description>
                        Oops! There seems to be some vital data missing. Please fill in your Vital details.
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

export default Home
