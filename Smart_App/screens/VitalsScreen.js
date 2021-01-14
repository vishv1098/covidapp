import React from 'react';
import { View, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Dimensions, Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

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

const VitalsScreen = () => {

  const navigation = useNavigation();

  const handleOxygenbox = async (inputText) => {
    if (inputText === '') {
    } else {
      await AsyncStorage.setItem('oxygen_saturation', inputText);
    }
  }

  const handleHRbox = async (inputText) => {
    if (inputText === '') {
    } else {
      await AsyncStorage.setItem('heart_rate', inputText);
    }
  }

  const handleRRbox = async (inputText) => {
    if (inputText === '') {
    } else {
      await AsyncStorage.setItem('respiratory_rate', inputText);
    }
  }

  const handleTempbox = async (inputText) => {
    if (inputText === '') {
    } else {
      await AsyncStorage.setItem('temperature', inputText);
    }
  }

  const handleDBPbox = async (inputText) => {
    if (inputText === '') {
    } else {
      await AsyncStorage.setItem('diastolic_bloodpressure', inputText);
    }
  }
  const handleSBPbox = async (inputText) => {
    if (inputText === '') {
    } else {
      await AsyncStorage.setItem('systolic_bloodpressure', inputText);
    }
  }

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
                          onChangeText = { (text) => handleOxygenbox(text) }
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
                          onChangeText = { (text) => handleHRbox(text) }
                          placeholder = {'Enter your heart rate in bpm'}
                          placeholderTextColor="#000000" 
                          keyboardType={'numeric'}
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
                          onChangeText = { (text) => handleRRbox(text) }
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
                          onChangeText = { (text) => handleTempbox(text) }
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
                          onChangeText = { (text) => handleSBPbox(text) }
                          placeholder = {'Systolic BP'}
                          placeholderTextColor="#000000" 
                          keyboardType={'numeric'}
                          numeric
                        />
                    </View>
                    <View style={styles.innerBottFieldHeaderBpField}>
                      <Text style={styles.tcLbp}> / </Text>
                    </View>
                    <View style={styles.innerBottFieldHeaderBpField}>
                        <TextInput
                          style={styles.fieldStyleBp}
                          onChangeText = { (text) => handleDBPbox(text) }
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
                <TouchableOpacity  activeOpacity = {.5} style={styles.buttonTop} onPress={ async() => { navigation.navigate('result')}}>
                  <Text style={styles.buttonTextStyle}>View Result</Text>
                </TouchableOpacity>
              </View>
          </View>
      </View>
    </TouchableWithoutFeedback>
  )
};

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
    // backgroundColor: 'red'
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
    // justifyContent: 'flex-start'
    // backgroundColor: 'yellow'
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
