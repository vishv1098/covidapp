import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard, Dimensions, Platform, PixelRatio } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

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
      tmp_unit:'c',//new
    }
  }

  async componentDidMount() {
    var ourDate = new Date();
    var pastDate = ourDate.getDate() - 7;
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
      console.log("new:"+google_token_fetch);
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
    // await this.dataSources();
    await this.heartRateData();
    await this.fitbitData();
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
        var array = resp.data["point"]
        var x = array[array.length - 1]
        var res = x.value[0].fpVal
        await this.setState({
          hreditable: false,
          hrplaceholder: parseInt(res)+'',
        })
    })
  }

  fitbitData = async() => {
    await axios.get('https://api.fitbit.com/1/user/-/activities/heart/date/'+this.state.fitbitStartDate+'/'+this.state.fitbitEndDate+'/1min.json',{
      headers:{
        Authorization: 'Bearer ' + this.state.fitbit_token
      }
    }).then((resp) => {
      var testRead = resp
      console.log(testRead.data["activities-heart"][0]["dateTime"])
      console.log(JSON.stringify(testRead.data["activities-heart"][0]["value"]))
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

  handleTempbox = async (inputText) => { //new
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
  handleUnitbox = (inputText) => {//new
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

  getCovidTest = async () => {
    const covidscore = await this.getCovidPrediction();
    const influscore = await this.getInfluenzaPrediction();
    if (covidscore < 0.5 && influscore < 0.5 ) {
      this.props.navigation.navigate('safe')
    } else if (covidscore < 0.5 && influscore > 0.5 ) {
      this.props.navigation.navigate('influ')
    } else if (covidscore > 0.5 && influscore < 0.5 ) {
      this.props.navigation.navigate('covid')
    } else {
      const covidinfluscore = await this.getCovidInfluPrediction();
      if (covidinfluscore < 0.5) {
        this.props.navigation.navigate('influ')
      } else {
        this.props.navigation.navigate('covid')
      }
    }
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
      if(this.state.genData === 'female') {
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
      if (this.state.raceData === 'white') {
        await this.setState({
          white: 1,
          black: 0,
          others: 0,
        })
      }
      if (this.state.raceData === 'black/african') {
        await this.setState({
          white: 0,
          black: 1,
          others: 0,
        })
      }
      if (this.state.raceData === 'others') {
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
      await this.setState({
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
                    {/* <Image source={require('../appIcons/heartbeat-solid.svg')} resizeMode='contain' style={styles.headerIconStyle}></Image> */}
                </View>
                <View style={styles.headerField}>
                  <View>
                    <Text style={styles.tcP}>Vitals</Text>
                  </View>
                  <View style={styles.headerField}>
                    <Text style={styles.tcsub}>Enter the remaining vitals if you know them.</Text>
                  </View>
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
                      {/* new */}
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
    padding: 10,
    backgroundColor: '#ef9a9a'
  },
  contentContainer: {
    width: "100%",
    aspectRatio: 0.55,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
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
    marginRight: '10rem'
  },
  headerField: {
    flex: 0.6,
    width: "100%",
  },
  headerElField: {
    flex: 0.8,
    width: "100%",
  },
  headerMeaasge: {
    flex: 1,
    width: "100%",
  },
  headerNavigate: {
    flex: 0.8,
    width: "100%",
    paddingTop: '20rem',
  },
  headerTitleText: {
    fontSize: '27rem', 
    fontWeight: 'bold', 
    color: '#000000', 
    textAlign: 'center',  
    marginLeft: '10rem', 
    marginRight: '10rem'
  },
  innerTopHeaderHtField: {
    flex: 2,
  },
  innerBottomHeaderHtField: {
    flex: 3,
    flexDirection: 'row'
  },
  innerBottomHeaderBpField: {
    flex: 3,
    flexDirection: 'row',
    marginLeft: '30rem',
    justifyContent: 'flex-start',
  },
  tcP: {
    marginTop: '5rem',
    marginBottom: '3rem',
    fontSize: '15rem',
    fontWeight: 'bold',
    marginLeft: '30rem',
    marginRight: '30rem'
  },
  tcsub: {
    marginLeft: '30rem',
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
    height: '40rem',
    width: '250rem',
    fontSize: '15rem',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginLeft: '30rem',
    marginRight: '30rem'
  },
  fieldStyleBp: {
    height: '40rem',
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
  unitStyle:{ //new
    height: 35, 
    width: 65
  }
})
