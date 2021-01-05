import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Dialog from "react-native-dialog";
import SemiCircleProgress from './SemiCircle';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { LocalNotification, ScheduledLocalNotification } from './LocalPushController'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import AddModal from './AddModal';

const covid_modelJson = require('../components/COVIDOnly/model.json')
const covid_modelWeights = require('../components/COVIDOnly/group1-shard1of1.bin')

const influ_modelJson = require('../components/InfluenzaOnly/model.json')
const influ_modelWeights = require('../components/InfluenzaOnly/group1-shard1of1.bin')

const covid_infl_modelJson = require('../components/COVIDvsInfluenza/model.json')
const covid_infl_modelWeights = require('../components/COVIDvsInfluenza/group1-shard1of1.bin')

const BACKEND_CONFIG = 'cpu';

var screenWidth = Dimensions.get('screen').width;
var screenHeight = Math.round(Dimensions.get('window').height);

class Home extends Component {

    constructor(props){
        super(props)
        this._testScheduleNotification();
        this.getData();
        this.state = {
            visibility:false,
            infoVisibility:false,
            covid: false,
            influ: false,
            safe: false,
            result: false,
            res_score: 0,
            res_msg: 'Please wait till the result get displayed',
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
            assessmentResultMessage: '',
            firstSave: 'false',
            startTest: false,
            symptomsCheck: false,
            symp_res_msg: '',
            symp_g_color: '',
            symp_assessmentResultMessage: '',
            symp_res_score: 0,
            vitalTest: false,
            formFill: false,
        }
        this._onFormData = this._onFormData.bind(this);
    }

    async componentDidMount() {
        await tf.setBackend(BACKEND_CONFIG);
        await tf.ready();
        var google_token_fetch = await AsyncStorage.getItem('googlefit_accesstoken')
        if (google_token_fetch !== null) {
            this.setState({
                google_token: google_token_fetch,
            })
        }
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
        var google_token_fetch = await AsyncStorage.getItem('googlefit_accesstoken')
        if(google_token_fetch !== null) {
            this.setState({
                google_token: google_token_fetch
            })
        }
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
                g_color: 'green',
                assessmentResultMessage: 'This result is based on Vitals assessment'
            })
        } else if (covidscore < 0.5 && influscore > 0.5 ) {
            msg = "Your probability to have Influenza"
            this.setState({
                influ: true,
                result: true,
                res_msg: msg,
                res_score: parseInt(((influscore)*100).toFixed(0)),
                g_color: 'orange',
                assessmentResultMessage: 'This result is based on Vitals assessment'
            })
        }  else if (covidscore > 0.5 && influscore < 0.5 ) {
            msg = "Your probability to have COVID"
            this.setState({
                covid: true,
                result: true,
                res_msg: msg,
                res_score: parseInt(((covidscore)*100).toFixed(0)),
                g_color: 'red',
                assessmentResultMessage: 'This result is based on Vitals assessment'
            })
        } else {
            const covidinfluscore = await this.getCovidInfluPrediction();
            if (covidinfluscore < 0.5) {
                msg = "Your probability to have Influenza"
                this.setState({
                    influ: true,
                    result: true,
                    res_msg: msg,
                    res_score: parseInt((100 - ((covidinfluscore/0.5)*100)).toFixed(0)),
                    g_color: 'orange',
                    assessmentResultMessage: 'This result is based on Vitals assessment'
                })
            } else {
                msg = "Your probability to have COVID"
                this.setState({
                    covid: true,
                    result: true,
                    res_msg: msg,
                    res_score: parseInt(((1-((1-covidinfluscore)/0.5))*100).toFixed(0)),
                    g_color: 'red',
                    assessmentResultMessage: 'This result is based on Vitals assessment'
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
            var array = resp.data["dataSource"]
            var heart_rate_token = ''
            var step_count_token = ''
            var distance_token = ''
            var calories_token = ''
            var activity_token = ''
            for( var q = 0; q < array.length; q++ ) {
                try {
                    if (array[q]["device"]["uid"] === "e3fc9470") {
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
                    this.setState({
                        heart_rate_token: heart_rate_token,
                        step_count_token: step_count_token,
                        distance_token: distance_token,
                        calories_token: calories_token,
                        activity_token: activity_token
                    })
                    
                } catch (error) {
                    console.log(error)
                }
            }
            if ((heart_rate_token === '') && (step_count_token === '') && (distance_token === '') && (calories_token === '') && (activity_token === '')) {
                alert('There is no device connected to your Google fit account. Please enter your vital signs manually from settings')
            }
        })


    }

    heartRateData = async() => {
        var myDate = new Date(this.state.startDate+"T00:00:00+0000");
        var result1 = myDate.getTime();
        var result2 = this.state.endDate
        await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/'+this.state.heart_rate_token+'/datasets/'+this.state.startDate+'000000-'+result2+'000000',{
            headers: {
                'Authorization': 'Bearer ' + this.state.google_token
            }
        }).then(async (resp) => {
            var array = resp.data["point"]
            var x = array[array.length - 1]
            var res = x.value[0].fpVal
            await AsyncStorage.setItem("HeartRate",res+'')
        })

    }

    checkValidation = async () => {
        await this.getData();
        var google_token_fetch = await AsyncStorage.getItem('googlefit_accesstoken')
        var first = await AsyncStorage.getItem('first_save')
        if(google_token_fetch !== null) {
            this.setState({
                google_token: google_token_fetch
            })
        }
        if(first !== null) {
            this.setState({
                firstSave: first
            })
        }
        if (this.state.google_token === null) {
            this.setState({
                visibility:true,
            })
        } else if(this.state.firstSave === 'false') {
            await this.dataSources();
            await this.heartRateData();
            alert("There are some missing vitals values please enter those values through manual data entry")
        } else {
            await this.dataSources();
            await this.heartRateData();
            await this.getCovidTest();
        }
        
    }

    checkValid = async () => {
        await this.getData();
        var google_token_fetch = await AsyncStorage.getItem('googlefit_accesstoken')
        var first = await AsyncStorage.getItem('first_save')
        if(google_token_fetch !== null) {
            this.setState({
                google_token: google_token_fetch
            })
        }
        if (this.state.google_token === null) {
            this.setState({
                visibility:true,
            })
        }
        await this.dataSync()
    }

    dataSync = async () => {
        await this.dataSources();
        await this.heartRateData();
    }

    onSymptomAssess = () => { 
        const {prob} = this.props.route.params?this.props.route.params:0 
        if(isNaN(prob) === false){ 
            if(prob*100>=50) { 
                this.setState({ 
                    symp_res_msg:"You're likely to have Covid", 
                    symp_g_color:'red',
                    symp_assessmentResultMessage: 'This result is based on Symptoms assessment',
                    symp_res_score:Math.round(prob*100),
                }) 
            } else { 
                this.setState({ 
                    symp_res_msg:"You're likely to have influenza", 
                    symp_g_color:'orange',
                    symp_assessmentResultMessage: 'This result is based on Symptoms assessment',
                    symp_res_score:Math.round(prob*100),
                }) 
            } 
            this.setState({
                symptomsCheck: true,
                startTest: false
            }) 
        }
    } 

    onStartTest = async() => {
        await this.setState({
            startTest: true
        })
    }

    _onFormData = async() => {
        this.refs.addModal.showAddModal();
    }

    Reset = async () => {
        this.setState({
            formFill: false,
            startTest: false,
            symptomsCheck: false,
            vitalTest: false
        })
    }

    setData = async() => {
        this.setState({
            formFill: true,
            startTest: false,
            symptomsCheck: false,
            vitalTest: false
        })
        console.log("Test")
        await this.dataSources();
        await this.heartRateData();
        await this.getCovidTest();
    }

    render() {
        return (
            <ScrollView style={{backgroundColor: '#F5FCFF'}}>
                <View style={styles.container}>
                    <View style={styles.infoButtonContainer}>                                     
                        <TouchableOpacity style={styles.infoButton} activeOpacity = {.5} onPress={()=>this.setState({infoVisibility:true})}>
                                <Icon name='information-circle-outline' size={30} style={{position: 'relative'}} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.header}>COVID-19 Assessment</Text>
                    <Dialog.Container visible={this.state.visibility}> 
                        <Dialog.Title style={{textAlign:'center'}}>Missing Data</Dialog.Title>
                            <Dialog.Description>
                                Please Sign-In to your fitness tracker.
                            </Dialog.Description>
                        <Dialog.Button label="OK" onPress = {() => this.setState({visibility:false},this.props.navigation.navigate('Profile') )}/>
                    </Dialog.Container>
                    <Dialog.Container visible={this.state.infoVisibility}> 
                        <Dialog.Title style={{textAlign:'center'}}>Disclaimer</Dialog.Title>
                            <Dialog.Description>
                            This App provides real-time tracking of vital signs and self-reported symptoms to predict probability of having COVID-19 vs Influenza on an individual basis. The data and services provided by this application is provided as an information resource only, and is not to be used or relied on for any diagnostic or treatment purpose. This information does not create any patient-physician relationship, and should not be used as a substitute for professional diagnosis and treatment.
                            </Dialog.Description>
                            <Dialog.Description>
                            The application cannot be held accountable for any decisions made based on the information provided. Consult your healthcare provider before making any healthcare decisions or for guidance about a specific medical condition.
                            </Dialog.Description>
                            <Dialog.Description>
                            Data Privacy: Your data is only used to make predictions on-device using Machine Learning models and is not stored or collected for other use.
                            </Dialog.Description>
                        <Dialog.Button label="OK" onPress = {() => this.setState({infoVisibility:false} )}/>
                    </Dialog.Container>
                    {this.state.startTest === false && this.state.symptomsCheck === false && this.state.vitalTest === false && this.state.formFill === false ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex:1, paddingTop: screenHeight/6.0 }}>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center', }} activeOpacity = {.5} onPress={this.onStartTest}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Start the COVID test</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    null
                    }
                    {this.state.startTest === true && this.state.symptomsCheck === false && this.state.vitalTest === false ?
                    <>
                        <View style={{paddingTop:30}}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color:'blue', fontWeight: 'bold'}}>Your COVID test is in progress</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex:1, paddingTop: screenHeight/6.0 }}>
                            <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center', }} activeOpacity = {.5} onPress={() => this.props.navigation.navigate('Self Assessment', {assess:this.onSymptomAssess.bind(this)})}>
                                <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Symptoms</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    null
                    }
                    {this.state.startTest === false && this.state.symptomsCheck === true && this.state.vitalTest === false && this.state.google_token === null ?
                    <>
                        <View style={{paddingTop:30}}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color:'blue', fontWeight: 'bold'}}>Your COVID test is in progress</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex:1, paddingTop: screenHeight/6.0 }}>
                            <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center', }} activeOpacity = {.5} onPress={this.checkValid}>
                                <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Vitals</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    null
                    }
                    {this.state.startTest === false && this.state.symptomsCheck === true && this.state.vitalTest === false && this.state.google_token !== null ?
                    <>
                        <View style={{paddingTop:30}}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color:'blue', fontWeight: 'bold'}}>Your COVID test is in progress</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex:1, paddingTop: screenHeight/6.0 }}>
                            <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center', }} activeOpacity = {.5} onPress={this._onFormData}>
                                <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Vitals</Text>
                            </TouchableOpacity>
                        </View>
                        <AddModal ref={'addModal'} setData={this.setData}>
                        </AddModal>
                    </>
                    :
                    null
                    }
                    {this.state.startTest === false && this.state.symptomsCheck === false && this.state.vitalTest === false && this.state.formFill === true ?
                    <>
                        <View style={{paddingTop:30}}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color:'blue', fontWeight: 'bold'}}>Here are your results</Text>
                        </View>
                        <View style={styles.subcontainer} alignSelf='center'> 
                            <SemiCircleProgress
                                percentage={this.state.res_score}

                                progressColor={this.state.g_color}
                            >
                                <Text style={{ fontSize: 32, color:this.state.g_color }}> {this.state.res_score}%</Text>
                            </SemiCircleProgress>
                        </View>
                        <View style={styles.subcontainer}>
                            <Text style={{ fontSize: 24, textAlign: 'center', color:this.state.g_color}}>{this.state.res_msg}</Text>
                        </View>
                        <View style={{paddingTop:30}}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color:'blue', fontWeight: 'bold'}}>{this.state.assessmentResultMessage}</Text>
                        </View> 
                        <View style={{paddingTop: 40}}></View>
                        <View style={styles.subcontainer} alignSelf='center'> 
                            <SemiCircleProgress
                                percentage={this.state.symp_res_score}

                                progressColor={this.state.symp_g_color}
                            >
                                <Text style={{ fontSize: 32, color:this.state.symp_g_color }}> {this.state.symp_res_score}%</Text>
                            </SemiCircleProgress>
                        </View>
                        <View style={styles.subcontainer}>
                            <Text style={{ fontSize: 24, textAlign: 'center', color:this.state.symp_g_color}}>{this.state.symp_res_msg}</Text>
                        </View>
                        <View style={{paddingTop:30}}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color:'blue', fontWeight: 'bold'}}>{this.state.symp_assessmentResultMessage}</Text>
                        </View> 
                        <View style={{paddingTop:60, paddingBottom:5}}>
                            <Text style={{ fontSize: 12, textAlign: 'center', color:'black', fontWeight: 'bold'}}>Note: The probability here will represent only the confidence level of the model</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex:1, paddingTop: screenHeight/6.0 }}>
                        <TouchableOpacity style={{ margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center', }} activeOpacity = {.5} onPress={this.Reset}>
                            <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Reset</Text>
                        </TouchableOpacity>
                    </View> 
                    </>
                    :
                    null
                    }
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        fontSize:35,
        color:'#00B0B9',
        paddingBottom:50,
        paddingTop: 10,
        alignSelf:"center",
      },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    subcontainer:{
        paddingTop:20,
        alignSelf:"stretch",
        paddingBottom:5
    },
    subcontainerButton:{
        flexDirection: "row",
        alignSelf:"stretch",
        justifyContent:"space-around",
        paddingBottom:70
    },
    infoButtonContainer:{
        flexDirection: "row",
        alignSelf:"stretch",
        justifyContent:"flex-end",
        paddingRight:20,
        paddingBottom:10
    },
    btntext:{
        color:'white',
        fontSize:22,
        textAlign:'center'
    },
    infobtntext:{
        color:'black',
        fontFamily:'monospace',
        fontSize:22,
        textAlign:'center'
    },
    leftbutton: {
        alignSelf:'center',
        alignItems:'center',
        padding:20,
        backgroundColor:'#00B0B9',
        borderRadius:20,
        marginTop: 30,
        width:150, 
    },
    infoButton: {
        padding:20,
        backgroundColor:'#F5FCFF',
        borderRadius:200,
        marginTop: 30,
        width:80,
        height:50,
        justifyContent:'center',
    },
    button: {
        alignSelf:'center',
        alignItems:'center',
        padding:20,
        backgroundColor:'#00B0B9',
        borderRadius:20,
        marginTop: 30,
        width:150,
    },
});

export default Home
