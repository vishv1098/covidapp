import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, Dimensions, Platform, PixelRatio } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { ConfirmDialog } from 'react-native-simple-dialogs';

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

const covid_modelJson = require('../components/COVIDOnly/model.json')
const covid_modelWeights = require('../components/COVIDOnly/group1-shard1of1.bin')

const influ_modelJson = require('../components/InfluenzaOnly/model.json')
const influ_modelWeights = require('../components/InfluenzaOnly/group1-shard1of1.bin')

const covid_infl_modelJson = require('../components/COVIDvsInfluenza/model.json')
const covid_infl_modelWeights = require('../components/COVIDvsInfluenza/group1-shard1of1.bin')

const BACKEND_CONFIG = 'cpu';

class VitalsScreen extends Component {

  constructor(props) {
    super(props);
    this.getData();
    
    this.state = {
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
      age: -1,
      google_token: '',
      fitbit_token: '',
      startDate: '',
      endDate: Date.now(),
      hrplaceholder: 'Enter your heart rate in bpm',
      hreditable: true,
      ethiniDetails: false,
      ethiniData: '',
      genData: '',
      genDetails: false,
      raceData: '',
      raceDetails: false,
      ageData: '',
      ageDetails: false,
      fitbitStartDate: '',
      fitbitEndDate: '',
      tmp_unit: 'c',
      dataOldWarn:false
    }
  }

  async componentDidMount() {
    var ourDate = new Date();
    var pastDate = ourDate.getDate() - 20;
    ourDate.setDate(pastDate);
    var n = ourDate.getTime()
    var x = ourDate.toISOString().split('T')
    var m = new Date().toISOString().split('T')
    this.setState({
      startDate: n,
      fitbitStartDate: x[0],
      fitbitEndDate: m[0],
    })
    await tf.setBackend(BACKEND_CONFIG);
    await tf.ready();
  }

  getData = async () => {
    try {
      var google_token_fetch = await AsyncStorage.getItem('googlefit_accesstoken')
      var fitbit_token_fetch = await AsyncStorage.getItem('fitbit_accesstoken')
      var gender = await AsyncStorage.getItem('userGender');
      if (gender !== null) {
        await this.setState({
          genData: gender,
          genDetails: true,
        })
      }
      var race_val = await AsyncStorage.getItem('userRace');
      if (race_val !== null) {
        await this.setState({
          raceData: race_val,
          raceDetails: true,
        })
      }
      var ethini_val = await AsyncStorage.getItem('userEthini');
      if (ethini_val !== null) {
        await this.setState({
          ethiniData: ethini_val,
          ethiniDetails: true,
        })
      }
      if (google_token_fetch !== null) {
        await this.setState({
          google_token: google_token_fetch,
        })
      }
      if (fitbit_token_fetch !== null) {
        await this.setState({
          fitbit_token: fitbit_token_fetch,
        })
      }
      var age_val = await AsyncStorage.getItem('userDOB')
      if (age_val !== null) {
        await this.setState({
          ageData: age_val,
          ageDetails: true,
        })
      }
    } catch(e) {
    }

    //new
    if (google_token_fetch !== null) {
      await this.heartRateData();
    }
    if (fitbit_token_fetch !== null) {
      await this.fitbitData();
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
                if (array[q]["device"]["uid"] === "3d58d1e0") {
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
            }
        }
        if ((heart_rate_token === '') && (step_count_token === '') && (distance_token === '') && (calories_token === '') && (activity_token === '')) {
        }
    })
  }

  heartRateData = async() => {
    // await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/'+this.state.heart_rate_token+'/datasets/'+this.state.startDate+'000000-'+this.state.endDate+'000000',{
    await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm/datasets/'+this.state.startDate+'000000-'+this.state.endDate+'000000',{
        headers: {
            'Authorization': 'Bearer ' + this.state.google_token
        }
    }).then(async (resp) => {
        console.log(this.state.google_token);
        var array = resp.data["point"]
        console.log("Array:"+array);
        var x = array[array.length - 1]
        var res = x.value[0].fpVal
        //new
        var milli_last = Math.round(x.endTimeNanos/1000000) 
        var now = new Date();
        now.setDate(now.getDate())
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        var milli_compare  = now.getTime();
        console.log(milli_last+' '+milli_compare)
        if(milli_last < milli_compare){
          await this.setState({
            hreditable: false,
            hrplaceholder: parseInt(res)+'',
          })
         }else{
          await this.setState({
            dataOldWarn
: true,
          })
        }

    })
  }

  handleTempbox = async (inputText) => {
    if (inputText === '') {
      await this.setState({
        b_tmp: -1,
      })
    } else {
        await this.setState({
          b_tmp: parseFloat(inputText),
        })
    }
  }

  handleUnitbox = (inputText) => {
    if (inputText.value === 'f') {
        this.setState({
            tmp_unit:'f', 
        })
    }else{
      this.setState({
        tmp_unit:'c'  
    })
    }
  }

  fitbitData = async() => {
    console.log('entered fit')
    await axios.get('https://api.fitbit.com/1/user/-/activities/heart/date/2021-01-01/2021-04-08/1min.json',{
      headers:{
        Authorization: 'Bearer ' + this.state.fitbit_token
      }
    }).then((resp) => {
      var testRead = resp
      console.log('entered then')
      console.log(testRead.data["activities-heart"][testRead.data["activities-heart"].length-1]["dateTime"])
      console.log(JSON.stringify(testRead.data["activities-heart"][testRead.data["activities-heart"].length-1]["value"]["heartRateZones"][0]["max"]))
    }).catch((error) => {
      //
    })
  }

  handleOxygenbox = async (inputText) => {
    if (inputText === '') {
      await this.setState({
        oxy: -1,
      })
    } else {
      await this.setState({
        oxy: parseFloat(inputText),
      })
    }
  }

  handleHRbox = async (inputText) => {
    if (inputText === '') {
      await this.setState({
        hr: -1,
      })
    } else {
      await this.setState({
        hr: parseInt(inputText),
      })
    }
  }

  handleRRbox = async (inputText) => {
    if (inputText === '') {
      await this.setState({
        res_r: -1,
      })
    } else {
      await this.setState({
        res_r: parseInt(inputText),
      })
    }
  }

  handleTempbox = async (inputText) => {
    if (inputText === '') {
      await this.setState({
        b_tmp: -1,
      })
    } else {
      await this.setState({
        b_tmp: parseFloat(inputText),
      })
    }
  }

  handleDBPbox = async (inputText) => {
    if (inputText === '') {
      await this.setState({
        dbp: -1,
      })
    } else {
      await this.setState({
        dbp: parseFloat(inputText),
      })
    }
  }

  handleSBPbox = async (inputText) => {
    if (inputText === '') {
      await this.setState({
        sbp: -1,
      })
    } else {
      await this.setState({
        sbp: parseFloat(inputText),
      })
    }
  }

  getCovidPrediction = async () => {
    var z = [this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]
    console.log(z)
    const model = await tf.loadLayersModel(bundleResourceIO(covid_modelJson, covid_modelWeights));
    const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
    const res = model.predict(a);
    const da = await res.data();
    const y = JSON.stringify(da).toString()
    return da[0]
  }

  getInfluenzaPrediction = async () => {
    const model = await tf.loadLayersModel(bundleResourceIO(influ_modelJson, influ_modelWeights));
    const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
    const res = model.predict(a);
    const da = await res.data();
    const y = JSON.stringify(da).toString()
    return da[0]
  }

  getCovidInfluPrediction = async () => {
    const model = await tf.loadLayersModel(bundleResourceIO(covid_infl_modelJson, covid_infl_modelWeights));
    const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
    const res = model.predict(a);
    const da = await res.data();
    const y = JSON.stringify(da).toString()
    return da[0]
  }

  getCovidTest = async () => {//new
    const covidscore = await this.getCovidPrediction();
    const influscore = await this.getInfluenzaPrediction();
    if(this.state.oxy == -1 && this.state.res_r == -1 && this.state.b_tmp == -1 && this.state.sbp == -1
      && this.state.dbp == -1 && this.state.hr == -1){
        this.props.navigation.navigate('nopredict')
    } else if (covidscore < 0.5 && influscore < 0.5 ) {
      await this.setHistory('Healthy')
      this.props.navigation.navigate('safe')
    } else if (covidscore < 0.5 && influscore > 0.5 ) {
      await this.setHistory('Unwell')
      this.props.navigation.navigate('influ')
    } else if (covidscore > 0.5 && influscore < 0.5 ) {
      await this.setHistory('Visit physician')
      this.props.navigation.navigate('covid')
    } else {
      const covidinfluscore = await this.getCovidInfluPrediction();
      if (covidinfluscore < 0.5) {
        await this.setHistory('Unwell')
        this.props.navigation.navigate('influ')
      } else {
        await this.setHistory('Visit physician')
        this.props.navigation.navigate('covid')
      }
    }
  }
  setHistory = async (res)=>{ // new
    var history = [] ;
    var date = new Date()
    var x = date.toDateString().split(' ')
    var sdate = x[1]+' '+x[2]+', '+x[3]; 
    if(await AsyncStorage.getItem('history') === null){
      history.push({key:'1',date:sdate, result:res});
    }else{
      history = await AsyncStorage.getItem('history');
      history = JSON.parse(history);
      var id = parseInt(history[history.length-1].key)+1;
      history.push({key:id.toString(),date:sdate, result:res});
    }
    await AsyncStorage.setItem('history',JSON.stringify(history).toString());
  }
  updateData = async () => {
    if(this.state.hreditable === false) {
      await this.setState({
        hr: parseInt(this.state.hrplaceholder),
      })
    }
    if(this.state.ethiniDetails === true) {
      if (this.state.ethiniData === 'Hispanic or Latino') {
        await this.setState({
          ethini: 1,
        })
      } else {
        await this.setState({
          ethini: 0,
        })
      }
    }
    if(this.state.genDetails === true) {
      if(this.state.genData === 'Female') {
        await this.setState({
          sex: 1,
        })
      } else {
        await this.setState({
          sex: 0,
        })
      }
    }
    if (this.state.raceDetails === true) {
      if (this.state.raceData === 'White') {
        await this.setState({
          white: 1,
          black: 0,
          others: 0,
        })
      }
      if (this.state.raceData === 'Black or African American') {
        await this.setState({
          white: 0,
          black: 1,
          others: 0,
        })
      }
      if (this.state.raceData === 'Others') {
        await this.setState({
          white: 0,
          black: 0,
          others: 1,
        })
      }
    }
    if (this.state.ageDetails === true) {
      await this.setState({
        age: parseInt(this.state.ageData),
      })
    }
    if(this.state.tmp_unit ==='f'){ 
      await this.setState(
          { 
            b_tmp: parseInt(this.state.b_tmp - 32)* 5/9, 
          })
        }
    await this.getCovidTest();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.headerTitle}>
                    <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                        COVID-19 Assessment
                    </Text>
                </View>
                <View style={styles.headerIcon}>
                    <Icon name='heartbeat' size={normalize(130)} color="black" style={styles.headerIconStyle}/>
                </View>
                <View style={styles.headerField}>
                    <Text style={styles.tcP}>Vitals</Text>
                    <Text style={styles.tcsub}>Enter the remaining vitals if you know them.</Text>
                </View>
                <View style={styles.headerElField}>
                    <View style={styles.innerTopHeaderHtField}>
                      <Text style={styles.tcP}>Oxygen Saturation</Text>
                    </View>
                    <View style={styles.innerBottomHeaderHtField}>
                      <View style={styles.innerBottFieldHeaderHtField}>
                          <TextInput
                            style={styles.fieldStyle}
                            onChangeText = { (text) => this.handleOxygenbox(text) }
                            placeholder = {'Enter your oxygen saturation value'}
                            placeholderTextColor="#000000" 
                            keyboardType={'numeric'}
                            numeric
                          />
                      </View>
                      <View style={styles.innerBottUnitHeaderHtField}>
                        <Text style={styles.tcL}>%</Text>
                      </View>
                    </View>
                </View>
                <View style={styles.headerElField}>
                    <View style={styles.innerTopHeaderHtField}>
                      <Text style={styles.tcP}>Heart Rate</Text>
                    </View>
                    <View style={styles.innerBottomHeaderHtField}>
                      <View style={styles.innerBottFieldHeaderHtField}>
                          <TextInput
                            style={styles.fieldStyle}
                            onChangeText = { (text) => this.handleHRbox(text) }
                            placeholder = {this.state.hrplaceholder}
                            placeholderTextColor="#000000" 
                            keyboardType={'numeric'}
                            editable={this.state.hreditable}
                            numeric
                          />
                      </View>
                      <View style={styles.innerBottUnitHeaderHtField}>
                        <Text style={styles.tcL}>bpm</Text>
                      </View>
                    </View>
                </View>
                <View style={styles.headerElField}>
                    <View style={styles.innerTopHeaderHtField}>
                      <Text style={styles.tcP}>Respiratory Rate</Text>
                    </View>
                    <View style={styles.innerBottomHeaderHtField}>
                      <View style={styles.innerBottFieldHeaderHtField}>
                          <TextInput
                            style={styles.fieldStyle}
                            onChangeText = { (text) => this.handleRRbox(text) }
                            placeholder = {'Enter your respiratory rate value'}
                            placeholderTextColor="#000000" 
                            keyboardType={'numeric'}
                            numeric
                          />
                      </View>
                    </View>
                </View>
                <View style={styles.headerElField}>
                    <View style={styles.innerTopHeaderHtField}>
                      <Text style={styles.tcP}>Body Temperature</Text>
                    </View>
                    <View style={styles.innerBottomHeaderHtField}>
                      <View style={styles.innerBottFieldHeaderHtField}>
                          <TextInput
                            style={styles.fieldStyle}
                            onChangeText = { (text) => this.handleTempbox(text) }
                            placeholder = {'Enter your body temperature'}
                            placeholderTextColor="#000000" 
                            keyboardType={'numeric'}
                            numeric
                          />
                      </View>
                      <View style={styles.innerBottUnitHeaderHtField}>
                        <DropDownPicker
                            items={[
                                {label: '°C', value: 'c'},
                                {label: '°F', value: 'f'},
                            ]}
                            defaultValue={this.state.tmp_unit}
                            containerStyle={styles.unitStyle}
                            style={{backgroundColor: '#ef9a9a',borderColor:'black'}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: '#ef9a9a', width: 65,borderColor:'black'}}
                            onChangeItem={item => this.handleUnitbox(item)}
                        />
                      </View>
                    </View>
                </View>
                <View style={styles.headerElField}>
                    <View style={styles.innerTopHeaderHtField}>
                      <Text style={styles.tcP}>Blood Pressure</Text>
                    </View>
                    <View style={styles.innerBottomHeaderBpField}>
                      <View style={styles.innerBottFieldHeaderBpField}>
                          <TextInput
                            style={styles.fieldStyleBp}
                            onChangeText = { (text) => this.handleSBPbox(text) }
                            placeholder = {'Systolic BP'}
                            placeholderTextColor="#000000" 
                            keyboardType={'numeric'}
                            numeric
                          />
                      </View>
                      <View style={styles.innerBottFieldHeaderBpField}>
                          <TextInput
                            style={styles.fieldStyleBp}
                            onChangeText = { (text) => this.handleDBPbox(text) }
                            placeholder = {'Diastolic BP'}
                            placeholderTextColor="#000000" 
                            keyboardType={'numeric'}
                            numeric
                          />
                      </View>
                      <View style={styles.innerBottUnitHeaderBpField}>
                        <Text style={styles.tcLbp}>mmHg</Text>
                      </View>
                    </View>
                </View>
                <View style={styles.headerNavigate}>
                  <TouchableOpacity  activeOpacity = {.5} style={styles.buttonTop} onPress={this.updateData}>
                    <Text style={styles.buttonTextStyle}>View Result</Text>
                  </TouchableOpacity>
                </View>
                {/* new */}
                <ConfirmDialog
                    visible={this.state.dataOldWarn
}
                    title="Old Data"
                    titleStyle={styles.disclaimer}
                    dialogStyle={styles.disclaimerDialog}
                    onTouchOutside={() => this.setState({dataOldWarn: false})}
                    positiveButton={{
                        title: "OK",
                        titleStyle: styles.disclaimerButtonStyle,
                        style: styles.disclaimerButton,
                        onPress: () => this.setState({dataOldWarn: false})
                    }}
                    >
                    <ScrollView>
                        <Text style={styles.disclaimerContent}>Your data seems to be too old for an accurate diagnosis.</Text>
                    </ScrollView>
                </ConfirmDialog>
            </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default VitalsScreen;

const styles = EStyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    padding: normalize(25),
    backgroundColor: '#ef9a9a'
  },
  contentContainer: {
    width: "100%",
    aspectRatio: SCREEN_WIDTH/SCREEN_HEIGHT,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 0.3,
    width: "100%",
  },
  headerIcon: {
    flex: 1.4,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10rem', 
    marginRight: '10rem'
  },
  headerIconStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10rem', 
    marginRight: '10rem',
    marginTop: '5rem',
  },
  headerField: {
    flex: 0.6,
    width: "100%",
  },
  headerElField: {
    flex: 0.67,
    width: "100%",
  },
  headerMeaasge: {
    flex: 1,
    width: "100%",
  },
  headerNavigate: {
    flex: 0.67,
    width: "100%",
    paddingTop: '20rem',
  },
  headerTitleText: {
    fontSize: '26rem', 
    fontWeight: 'bold', 
    color: '#000000', 
    textAlign: 'center',  
    marginLeft: '10rem', 
    marginRight: '10rem'
  },
  innerTopHeaderHtField: {
    flex: 1,
  },
  innerBottomHeaderHtField: {
    flex: 1.4,
    flexDirection: 'row'
  },
  innerBottomHeaderBpField: {
    flex: 1.4,
    flexDirection: 'row',
    marginLeft: '10rem',
    justifyContent: 'flex-start',
  },
  tcP: {
    marginTop: '5rem',
    marginBottom: '3rem',
    fontSize: '15rem',
    fontWeight: 'bold',
    marginLeft: '10rem',
    marginRight: '10rem'
  },
  tcsub: {
    marginLeft: '10rem',
    fontSize: '15rem',
  },
  tcL: {
    fontSize: '15rem',
  },
  tcLbp: {
    fontSize: '15rem',
    marginTop: '10rem'
  },
  innerBottFieldHeaderHtField: {
    flex:16,
    justifyContent: 'center'
  },
  innerBottFieldHeaderBpField: {
    flex:1,
  },
  innerBottUnitHeaderHtField: {
    flex:4,
    justifyContent: 'center'
  },
  innerBottUnitHeaderBpField: {
    flex:1,
  },
  fieldStyle: {
    height: '38rem',
    fontSize: '15rem',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginLeft: '10rem',
    marginRight: '10rem'
  },
  fieldStyleBp: {
    height: '38rem',
    width: '90rem',
    fontSize: '15rem',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  content:{
    marginTop: '12rem',
    marginBottom: '5rem',
    fontSize: '15rem',
    marginLeft: '30rem',
    marginRight: '30rem'
  },
  buttonTextStyle: {
    flex: 10,
    textAlign: 'center',
    alignContent:'center',
    fontSize: '18rem',
    color: '#000000'
  },
  buttonTop: {
    backgroundColor: '#ba6b6c',
    flexDirection: 'row',
    height: '53rem',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '30rem',
    marginRight: '30rem',
  },
  iconStyle: {
    flex: 1.7,
    backgroundColor: '#ba6b6c',
  },
  unitStyle: { 
    height: 35, 
    width: 65
  },
  // new
  disclaimer: {
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '24rem',
    fontWeight: 'bold'
},
disclaimerDialog: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
},
disclaimerContent: {
    fontSize: '16rem',
    paddingBottom: '10rem',
},
disclaimerButtonStyle: {
    fontSize:'16rem',
    color:'#007aff',
    fontWeight:'400'
},
})
