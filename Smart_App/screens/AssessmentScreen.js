import React from 'react';  
import { StyleSheet, Text, View, Button, Dimensions, TextInput, ScrollView, ImageBackground, Image, Alert } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { Checkbox } from 'react-native-paper';
import bgImage from '../assets/bgImage.jpg'
import log from '../assets/log.png'

const covid_modelJson = require('../components/COVIDOnly/model.json')
const covid_modelWeights = require('../components/COVIDOnly/group1-shard1of1.bin')

const influ_modelJson = require('../components/InfluenzaOnly/model.json')
const influ_modelWeights = require('../components/InfluenzaOnly/group1-shard1of1.bin')

const covid_infl_modelJson = require('../components/COVIDvsInfluenza/model.json')
const covid_infl_modelWeights = require('../components/COVIDvsInfluenza/group1-shard1of1.bin')

const { width: WIDTH } = Dimensions.get('window')

const modelJson = require('../components/model.json');
const modelWeights = require('../components/group1-shard1of1.bin');
// const nextImageTensor = images.next().value
// const nextImageTensor2 = nextImageTensor.reshape([[-1.0, -1.0, 80.0, 142.0, -1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 53.0, 0.0]])
const BACKEND_CONFIG = 'cpu';

class AssessmentScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      // isModelReady: false,
      // useModel: {}
      oxy: -1,
      dbp: 70,
      sbp: 102,
      hr: -1,
      res_r: -1,
      b_tmp: -1,
      sex: 1,
      white: 0,
      black: 1,
      others: 0,
      ethini: -1,
      age: 9.6,
      toggle: false
    }
  }

  async componentDidMount() {

    await tf.setBackend(BACKEND_CONFIG);
    await tf.ready();
    console.log("componentDidMount: tf.ready is set");
    console.log("the MyModelLoadLocal component is mounted");
  }

  getPrediction = async () => {
    console.log("model loading button is pressed...");   
    const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
    // const a = tf.tensor([["o2","dbp","sbp","heartrate","Respiratory rate","BodyTemp","Sex","White","black","others","Ethnicity","Age"]]);
    console.log(model)
    const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
    console.log(a)
    const res = model.predict(a);
    // this.setState({
    //     useModel: model,
    //     isModelReady: true
    // });
    const da = await res.data();
    console.log(JSON.stringify(da))
    console.log("Hi")
    console.log(res)
  }

  getCovidPrediction = async () => {
    console.log("Covid or no-Covid model loading..........")
    const model = await tf.loadLayersModel(bundleResourceIO(covid_modelJson, covid_modelWeights));
    const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
    const res = model.predict(a);
    const da = await res.data();
    console.log(da)
    const y = JSON.stringify(da).toString()
    console.log(da[0])
    var msg= '';
    console.log(typeof da[0]);
    if (da[0] > 0.5) {
      msg = "You are likely to be covid";
    } else {
      msg = "You are unlikely to be covid";
    }
    Alert.alert("covid score : "+ da[0]+ " \n" + msg)
  }

  getInfluenzaPrediction = async () => {
    console.log("Influenza or no-Influenza model loading..........")
    const model = await tf.loadLayersModel(bundleResourceIO(influ_modelJson, influ_modelWeights));
    const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
    const res = model.predict(a);
    const da = await res.data();
    console.log(da)
    const y = JSON.stringify(da).toString()
    console.log(da[0])
    var msg= '';
    console.log(typeof da[0]);
    if (da[0] > 0.5) {
      msg = "You are likely to have Influenza";
    } else {
      msg = "You are unlikely to have Influenza";
    }
    Alert.alert("Influenza score : "+ da[0]+ " \n" + msg)
  }

  getCovidInfluPrediction = async () => {
    console.log("Covid or Influenza model loading..........")
    const model = await tf.loadLayersModel(bundleResourceIO(covid_infl_modelJson, covid_infl_modelWeights));
    const a = tf.tensor([[this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]]);
    const res = model.predict(a);
    const da = await res.data();
    console.log(da)
    const y = JSON.stringify(da).toString()
    console.log(da[0])
    var msg= '';
    console.log(typeof da[0]);
    if (da[0] > 0.5) {
      msg = "You are likely to be Covid";
    } else {
      msg = "You are likely to have Influenza";
    }
    Alert.alert("Infection score : "+ da[0]+ " \n" + msg)
  }

  onePressed() {
    alert('one')
  }

  render() {  
    return (
        <ImageBackground
        source = {bgImage}
        blurRadius={10}
        style={styles.ImageBg}>
          {/* <Button title="classify" onPress={ this.getPrediction }></Button> */}
          <ScrollView>
            <View style={styles.logoContainer}>
              <Image  source={log} style={styles.logo}/>
              <Text style={styles.logoText}>Please fill in your details</Text>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Enter the Oxygen Saturation value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Oxygen Saturation value'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 30, paddingBottom: 5}}>Enter the Diastolic blood pressure value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Diastolic blood pressure value'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 30, paddingBottom: 5}}>Enter the Systolic blood pressure value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Systolic blood pressure value'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Enter the Heart rate value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Heart rate value per minute'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Enter the Respiratory rate value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Respiratory rate value'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Enter the Body temperature value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Body temperature value in celsius'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status = {this.state.toggle ? 'checked' : 'unchecked'}
                    color = 'green'
                    onPress={ () => { this.setState({ toggle: ! this.state.toggle })}}
                  />
                  <Text style={styles.label}>Do you like React Native?</Text>
                </View>
              </View>
            </View>
            <View style={{marginHorizontal: 50, marginVertical: 30, paddingTop: 10, paddingLeft: 10}}>
              <Button title="check for covid or no covid" onPress={ this.getCovidPrediction }></Button>
            </View>
            <View style={{marginHorizontal: 50, marginVertical: 30, paddingTop: 10, paddingLeft: 10}}>
              <Button title="check for influenza or no influenza" onPress={ this.getInfluenzaPrediction }></Button>
            </View>
            <View style={{marginHorizontal: 50, marginVertical: 30, paddingTop: 10, paddingLeft: 10}}>
              <Button title="check for covid or influenza" onPress={ this.getCovidInfluPrediction }></Button>
            </View>
          </ScrollView>
        </ImageBackground>
    );  
  }
}

const styles = StyleSheet.create({  
    container: {  
      flex: 1,  
      // justifyContent: 'center',  
      // alignItems: 'center'  
    },
    ImageBg: {
      flex: 1,
      height: null,
      width: null,
      opacity: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 40
    },
    logo: {
      width: 120,
      height: 120
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 50
    },
    logoText: {
      color: 'white',
      fontSize: 20,
      fontWeight: '500',
      marginTop: 10,
      opacity: 0.8
    },
    input: {
      width: WIDTH - 55,
      height: 45,
      borderRadius: 25,
      fontSize: 16,
      paddingLeft: 45,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      color: 'rgba(225, 225, 225, 0.7)',
      marginHorizontal: 25
    },
    card: {
      borderRadius: 10,
      elevation: 6,
      paddingTop: 5,
      marginVertical: 25,
      backgroundColor: '#fff',
      shadowOffset: {width: 1, height: 1},
      shadowColor: '#333',
      shadowOpacity: 2,
      paddingLeft: 20,
      fontSize: 16,
      padding: 12,
      marginHorizontal: 12
    },
    cardContent: {
      marginHorizontal: 10,
      marginVertical: 10
    },
    checkboxContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    label: {
      margin: 8,
      fontSize: 16
    },
});

export default AssessmentScreen
