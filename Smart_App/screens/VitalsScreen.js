import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Dimensions, Platform, PixelRatio } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';
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
      startDate: "1607538600000",
      endDate: Date.now(),
      hrplaceholder: 'Enter your heart rate in bpm',
      hreditable: true,
    }
  }

  async componentDidMount() {
    await tf.setBackend(BACKEND_CONFIG);
    await tf.ready();
  }

  getData = async () => {
    try {
      var google_token_fetch = await AsyncStorage.getItem('googlefit_accesstoken')
      var fitbit_token_fetch = await AsyncStorage.getItem('fitbit_accesstoken')
      if (google_token_fetch !== null) {
        this.setState({
          google_token: google_token_fetch,
        })
      }
      if (fitbit_token_fetch !== null) {
        this.setState({
          fitbit_token: fitbit_token_fetch,
        })
      }
    } catch(e) {
    }
    await this.dataSources();
    await this.heartRateData();
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
            }
        }
        if ((heart_rate_token === '') && (step_count_token === '') && (distance_token === '') && (calories_token === '') && (activity_token === '')) {
        }
    })
  }

  heartRateData = async() => {
    await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/'+this.state.heart_rate_token+'/datasets/'+this.state.startDate+'000000-'+this.state.endDate+'000000',{
        headers: {
            'Authorization': 'Bearer ' + this.state.google_token
        }
    }).then(async (resp) => {
        var array = resp.data["point"]
        var x = array[array.length - 1]
        var res = x.value[0].fpVal
        this.setState({
          hreditable: false,
          hrplaceholder: res + '',
        })
    })
  }

  handleOxygenbox = async (inputText) => {
    if (inputText === '') {
    } else {
      this.state.oxy = inputText;
    }
  }

  handleHRbox = async (inputText) => {
    if (inputText === '') {
    } else {
      this.state.hr = inputText;
    }
  }

  handleRRbox = async (inputText) => {
    if (inputText === '') {
    } else {
      this.state.res_r = inputText;
    }
  }

  handleTempbox = async (inputText) => {
    if (inputText === '') {
    } else {
      this.state.b_tmp = inputText;
    }
  }

  handleDBPbox = async (inputText) => {
    if (inputText === '') {
    } else {
      this.state.dbp = inputText;
    }
  }

  handleSBPbox = async (inputText) => {
    if (inputText === '') {
    } else {
      this.state.sbp = inputText;
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
                    <Icon name='heart-outline' size={100} color="black" style={styles.headerIconStyle} />
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
                  <TouchableOpacity  activeOpacity = {.5} style={styles.buttonTop} onPress={this.getCovidTest}>
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
})
