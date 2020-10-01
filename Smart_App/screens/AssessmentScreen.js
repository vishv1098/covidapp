import React from 'react';  
import { StyleSheet, TouchableOpacity, Text, View, Button, Dimensions, TextInput, ScrollView, ImageBackground, Image, Alert } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { Checkbox } from 'react-native-paper';
import bgImage from '../assets/bgImage.jpg'
import log from '../assets/log.png'
import DropDownPicker from 'react-native-dropdown-picker';

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
      toggle: false,
      gender: 'male',
      race: 'white',
      ethnicity: 'nothispanic/latino',
      covid: false,
      influ: false,
      safe: false
    }
  }

  async componentDidMount() {

    await tf.setBackend(BACKEND_CONFIG);
    await tf.ready();
    console.log("componentDidMount: tf.ready is set");
    console.log("the MyModelLoadLocal component is mounted");
  }

  getPrediction = async () => {
    var z = [this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]
    console.log(z)
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
    var z = [this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]
    console.log(z)
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
    // Alert.alert("covid score : "+ da[0].toFixed(10)+ " \n" + msg)
    return da[0]
  }

  getInfluenzaPrediction = async () => {
    var z = [this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]
    console.log(z)
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
    // Alert.alert("Influenza score : "+ da[0].toFixed(10)+ " \n" + msg)
    return da[0]
  }

  getCovidInfluPrediction = async () => {
    var z = [this.state.oxy, this.state.dbp, this.state.sbp, this.state.hr, this.state.res_r, this.state.b_tmp, this.state.sex, this.state.white, this.state.black, this.state.others, this.state.ethini, this.state.age]
    console.log(z)
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
    // Alert.alert("score : "+ da[0].toFixed(10)+ " \n" + msg)
    return da[0]
  }

  getCovidTest = async () => {
    const covidscore = await this.getCovidPrediction();
    console.log(covidscore)
    const influscore = await this.getInfluenzaPrediction();
    console.log(influscore)
    var msg= '';
    if (covidscore < 0.5 && influscore < 0.5 ) {
      msg = "You are safe"
      this.setState({
        safe: true
      })
      Alert.alert("score : "+ covidscore.toFixed(5)+","+influscore.toFixed(5)+ " \n" + msg)
    } else {
      const covidinfluscore = await this.getCovidInfluPrediction();
      if (covidinfluscore < 0.5) {
        msg = "you are likely to have influenza"
        this.setState({
          influ: true
        })
        Alert.alert("score : "+ covidinfluscore.toFixed(5)+ " \n" + msg)
      } else {
        msg = "you are likely to have covid"
        this.setState({
          covid: true
        })
        Alert.alert("score : "+ covidinfluscore.toFixed(5)+ " \n" + msg)
      }
    }
  }

  onePressed() {
    alert('one')
  }

  handleOxybox = (inputText) => {
    console.log(inputText)
    if (inputText == '') {
      this.setState({
        oxy: -1
      })
    } else {
      var a = parseFloat(inputText)
      console.log(a)
      this.setState({
        oxy: a
      });
    }
  };

  handledbpbox = (inputText) => {
    console.log(inputText)
    if (inputText == '') {
      this.setState({
        dbp: -1
      })
    } else {
      var a = parseFloat(inputText)
      console.log(a)
      this.setState({
        dbp: a
      });
    }
  }

  handlesbpbox = (inputText) => {
    console.log(inputText)
    if (inputText == '') {
      this.setState({
        sbp: -1
      })
    } else {
      var a = parseFloat(inputText)
      console.log(a)
      this.setState({
        sbp: a
      });
    }
  }

  handlehrbox = (inputText) => {
    console.log(inputText)
    if (inputText == '') {
      this.setState({
        hr: -1
      })
    } else {
      var a = parseFloat(inputText)
      console.log(a)
      this.setState({
        hr: a
      });
    }
  }

  handleresbox = (inputText) => {
    console.log(inputText)
    if (inputText == '') {
      this.setState({
        res_r: -1
      })
    } else {
      var a = parseFloat(inputText)
      console.log(a)
      this.setState({
        res_r: a
      });
    }
  }

  handletmpbox = (inputText) => {
    console.log(inputText)
    if (inputText == '') {
      this.setState({
        b_tmp: -1
      })
    } else {
      var a = parseFloat(inputText)
      console.log(a)
      this.setState({
        b_tmp: a
      });
    }
  }

  handleagebox = (inputText) => {
    console.log(inputText)
    if (inputText == '') {
      this.setState({
        age: 1
      })
    } else {
      var a = parseFloat(inputText)
      console.log(a)
      this.setState({
        age: a/5
      });
    }
  }

  handlegenbox = (inputText) => {
    console.log(inputText.value)
    if (inputText.value === 'male') {
      this.setState({
        sex: 0
      })
    } else {
      this.setState({
        sex: 1
      });
    }
  }

  handleracebox = (inputText) => {
    console.log(inputText.value)
    if (inputText.value === 'white') {
      this.setState({
        white: 1,
        black: 0,
        others: 0
      })
    } else if (inputText.value === 'black/african') {
      this.setState({
        white: 0,
        black: 1,
        others: 0
      })
    } else {
      this.setState({
        white: 0,
        black: 0,
        others: 1
      });
    }
  }

  handleethinibox = (inputText) => {
    console.log(inputText.value)
    if (inputText.value === 'nothispanic/latino') {
      this.setState({
        ethini: 0
      })
    } else if (inputText.value === 'others') {
      this.setState({
        ethini: -1
      })
    } else {
      this.setState({
        ethini: 1
      });
    }
  }

  render() {
    const {covid} = this.state;
    const {influ} = this.state;
    const {safe} = this.state;
    const covidbg = covid? 'red':'rgba(225, 0, 0, 0.4)'
    const influbg = influ? 'yellow' : 'rgba(128, 128, 0, 0.4)'
    const safebg = safe? 'green' : 'rgba(0, 128, 0, 0.4)'
    return (
        // <ImageBackground
        // source = {bgImage}
        // blurRadius={10}
        // style={styles.ImageBg}>
          <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.logoContainer}>
              <Image  source={log} style={styles.logo}/>
              <Text style={styles.logoText}>Please fill in your details</Text>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Enter the Oxygen Saturation value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Oxygen Saturation value'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                numeric
                onChangeText={(text) => this.handleOxybox(text)}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 30, paddingBottom: 5}}>Enter the Diastolic blood pressure value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Diastolic blood pressure value'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                numeric
                onChangeText={(text) => this.handledbpbox(text)}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 30, paddingBottom: 5}}>Enter the Systolic blood pressure value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Systolic blood pressure value'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                numeric
                onChangeText={(text) => this.handlesbpbox(text)}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Enter the Heart rate value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Heart rate value per minute'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                numeric
                onChangeText={(text) => this.handlehrbox(text)}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Enter the Respiratory rate value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Respiratory rate value'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                numeric
                onChangeText={(text) => this.handleresbox(text)}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Enter the Body temperature value :</Text>
              <TextInput
                style={styles.input}
                placeholder={'Body temperature value in celsius'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                numeric
                onChangeText={(text) => this.handletmpbox(text)}
              />
            </View>
            {/* <View style={styles.card}>
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
            </View> */}
            <View style={{marginTop: 10}}>
            <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Select the gender :</Text>
              <DropDownPicker
                items={[
                    {label: 'Male', value: 'male'},
                    {label: 'Female', value: 'female'},
                ]}
                defaultValue={this.state.gender}
                containerStyle={{height: 40, width: 380, paddingLeft: 35}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 35, width: 315}}
                onChangeItem={item => this.handlegenbox(item)}
              />
            </View>
            <View style={{marginTop: 10}}>
            <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Select the race :</Text>
              <DropDownPicker
                items={[
                    {label: 'White', value: 'white'},
                    {label: 'Black/African American', value: 'black/african'},
                    {label: 'Others', value: 'others'},
                ]}
                defaultValue={this.state.race}
                containerStyle={{height: 40, width: 380, paddingLeft: 35}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 35, width: 315}}
                onChangeItem={item => this.handleracebox(item)}
              />
            </View>
            <View style={{marginTop: 10}}>
            <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Select the Ethnicity :</Text>
              <DropDownPicker
                items={[
                    {label: 'Hispanic/Latino', value: 'hispanic/latino'},
                    {label: 'Not Hispanic/Latino', value: 'nothispanic/latino'},
                    {label: 'Others', value: 'others'},
                ]}
                defaultValue={this.state.ethnicity}
                containerStyle={{height: 40, width: 380, paddingLeft: 35}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 35, width: 315}}
                onChangeItem={item => this.handleethinibox(item)}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '500', marginTop: 10, opacity: 0.9, paddingLeft: 40, paddingBottom: 5}}>Enter your age :</Text>
              <TextInput
                style={styles.input}
                placeholder={'your age'}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                numeric
                onChangeText={(text) => this.handleagebox(text)}
              />
            </View>
            <View style={{marginHorizontal: 50, marginVertical: 30, paddingTop: 10, paddingLeft: 10}}>
              <Button title="check for covid or influenza" onPress={ this.getCovidTest }></Button>
            </View>
            {/* <View style={{marginHorizontal: 50, marginVertical: 30, paddingTop: 10, paddingLeft: 10}}>
              <Button title="check for covid or no covid" onPress={ this.getCovidPrediction }></Button>
            </View>
            <View style={{marginHorizontal: 50, marginVertical: 30, paddingTop: 10, paddingLeft: 10}}>
              <Button title="check for influenza or no influenza" onPress={ this.getInfluenzaPrediction }></Button>
            </View>
            <View style={{marginHorizontal: 50, marginVertical: 30, paddingTop: 10, paddingLeft: 10}}>
              <Button title="check for covid or influenza" onPress={ this.getCovidInfluPrediction }></Button>
            </View> */}
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 3, paddingLeft: 33}}>
              <View>
                <TouchableOpacity style={{margin: 10, flex: 1, width: 100, height: 50, backgroundColor: covidbg, borderRadius: 25, justifyContent: 'center'}} onPress={this._onPress}>
                  <Text style={{textAlign:'center', fontSize: 16}}></Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={{margin: 10, flex: 1, width: 100, height: 50, backgroundColor:safebg, borderRadius: 25, justifyContent: 'center'}} onPress={this._onPress}>
                  <Text style={{textAlign:'center', fontSize: 16}}></Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={{margin: 10, flex: 1, width: 100, height: 50, backgroundColor: influbg, borderRadius: 25, justifyContent: 'center'}} onPress={this._onPress}>
                  <Text style={{textAlign:'center', fontSize: 16}}></Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        // </ImageBackground>
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
      marginBottom: 50,
      paddingTop: 25
    },
    logoText: {
      color: 'black',
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
      color: 'rgb(255,255,255)',
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
