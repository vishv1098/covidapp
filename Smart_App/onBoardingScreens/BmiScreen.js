import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, ScrollView, Keyboard, Dimensions, Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import DropDownPicker from 'react-native-dropdown-picker';
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

const BmiScreen = () => {

  const navigation = useNavigation();

  const [isMissingInfoWarn, setIsMissingInfoWarn] = useState(false)
  const [isUnitWt, setisUnitWt] = useState('kg'); //new
  const [isUnitHt, setisUnitHt] = useState('cm'); //new
  const handleWtbox = async (inputText) => {
    if (inputText === '') {
    } else {
      await AsyncStorage.setItem('userWeight', inputText);
    }
  }

  const handleHtbox = async (inputText) => {
    if (inputText === '') {
    } else {
      await AsyncStorage.setItem('userHeight', inputText);
    }
  }
  
  const handleUnits= async ()=>{//new
    await AsyncStorage.setItem('weightUnit', isUnitWt);
    await AsyncStorage.setItem('heightUnit', isUnitHt);
  }
  const validate = async() => {
    const z = await AsyncStorage.getItem('firstSkip');
    if (z === null) {
      await AsyncStorage.setItem('firstSkip', 'notnull');
      setIsMissingInfoWarn(true)
    } else {
      navigation.navigate('age')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
          <ConfirmDialog
              visible={isMissingInfoWarn}
              title="Warning"
              titleStyle={styles.disclaimer}
              dialogStyle={styles.disclaimerDialog}
              onTouchOutside={() => setIsMissingInfoWarn(false)}
              positiveButton={{
                  title: "cancel",
                  titleStyle: styles.disclaimerButtonStyle,
                  style: styles.disclaimerButton,
                  onPress: () => {setIsMissingInfoWarn(false), navigation.navigate('bmi')}
              }}
              negativeButton={{
                  title: "Continue",
                  titleStyle: styles.disclaimerButtonStyle,
                  style: styles.disclaimerButton,
                  onPress: () => {setIsMissingInfoWarn(false), navigation.navigate('age')} 
              }}
              >
              <ScrollView>
                  <Text style={styles.disclaimerContent}>Missing data may cause the model to project wrong results. </Text>
              </ScrollView>
          </ConfirmDialog>
          <View style={styles.contentContainer}>
              <View style={styles.headerTitle}>
                  <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                      Profile
                  </Text>
              </View>
              <View style={styles.headerIcon}>
                  <Image source={require('../appIcons/baseline_emoji_people_black_48pt_3x.png')} resizeMode='contain' style={styles.headerIconStyle}></Image>
              </View>
              <View style={styles.headerHtField}>
                  <View style={styles.innerTopHeaderHtField}>
                    <Text adjustsFontSizeToFit style={styles.tcP}>Height</Text>
                  </View>
                  <View style={styles.innerBottomHeaderHtField}>
                    <View style={styles.innerBottFieldHeaderHtField}>
                        <TextInput
                          style={styles.fieldStyle}
                          onChangeText = { (text) => handleHtbox(text) }
                          placeholder = {'Enter your height in centimeters'}
                          placeholderTextColor="#000000" 
                          keyboardType={'numeric'}
                          numeric
                        />
                    </View>
                    {/* new */}
                    <View style={styles.innerBottUnitHeaderHtField}>
                    <DropDownPicker 
                            items={[
                                {label: 'cm', value: 'cm'},
                                {label: 'ft', value: 'ft'},
                            ]}
                            defaultValue={isUnitHt}
                            containerStyle={styles.unitStyle}
                            style={{backgroundColor: '#81d4fa'}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: '#81d4fa', width: 65}}
                            onChangeItem={item => setisUnitHt(item.value)}
                        />
                    </View>
                  </View>
              </View>
              <View style={styles.headerWtField}>
                  <View style={styles.innerTopHeaderHtField}>
                    <Text adjustsFontSizeToFit style={styles.tcP}>Weight</Text>
                  </View>
                  <View style={styles.innerBottomHeaderHtField}>
                    <View style={styles.innerBottFieldHeaderHtField}>
                        <TextInput
                          style={styles.fieldStyle}
                          onChangeText = { (text) => handleWtbox(text) }
                          placeholder = {'Enter your weight in kilograms'}
                          placeholderTextColor="#000000" 
                          keyboardType={'numeric'}
                          numeric
                        />
                        

                    </View>
                    {/*new*/}
                    <View style={styles.innerBottUnitHeaderHtField}>
                    <DropDownPicker 
                            items={[
                                {label: 'kg', value: 'kg'},
                                {label: 'lb', value: 'lb'},
                            ]}
                            defaultValue={isUnitWt}
                            containerStyle={styles.unitStyle}
                            style={{backgroundColor: '#81d4fa'}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: '#81d4fa', width: 65}}
                            onChangeItem={item => setisUnitWt(item.value)}
                        />
                    </View>
                  </View>
              </View>
              <View style={styles.headerMeaasge}>
                <Text adjustsFontSizeToFit style={styles.content}>Your height and weight are used to compute your Body Mass Index (BMI), which is provided as an input to our Machine Learning models.</Text>
              </View>
              <View style={styles.headerNavigate}>
                <TouchableOpacity  activeOpacity = {.5} style={styles.buttonTop} onPress={ async() => { navigation.navigate('age'), handleUnits()}}>
                  <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Next</Text>
                  <Icon name='chevron-forward-outline' size={22} color="#000000" style={styles.iconStyle} />
                </TouchableOpacity>
                <TouchableOpacity  activeOpacity = {.5} style={styles.buttonBottom} onPress={ async() => validate()}>
                  <Text adjustsFontSizeToFit style={styles.bottomButtonTextStyle}>Skip</Text>
                </TouchableOpacity>
              </View>
          </View>
      </View>
    </TouchableWithoutFeedback>
  )
};

export default BmiScreen;

const styles = EStyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    padding: 10,
    backgroundColor: '#81d4fa'
  },
  contentContainer: {
    width: "100%",
    aspectRatio: 0.55,
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
    marginRight: '10rem',
  },
  headerIconStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10rem', 
    marginRight: '10rem'
  },
  headerHtField: {
    flex: 0.8,
    width: "100%",
  },
  headerWtField: {
    flex: 0.8,
    width: "100%",
  },
  headerMeaasge: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerNavigate: {
    flex: 0.8,
    width: "100%",
    flexDirection: "column",
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
    justifyContent:'flex-end'
  },
  innerBottomHeaderHtField: {
    flex: 3,
    flexDirection: 'row'
  },
  tcP: {
    marginTop: '5rem',
    marginBottom: '3rem',
    fontSize: '15rem',
    fontWeight: 'bold',
    marginLeft: '30rem',
    marginRight: '30rem'
  },
  tcL: {
    fontSize: '15rem',
  },
  innerBottFieldHeaderHtField: {
    flex:16,
    justifyContent: 'center'
  },
  innerBottUnitHeaderHtField: {
    flex:4,
    justifyContent: 'center'
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
    marginLeft: '40rem', 
    fontSize: '18rem', 
    color: '#000000'
  },
  buttonTop: {
    backgroundColor: '#4ba3c7',
    flexDirection: 'row', 
    height: '53rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '30rem', 
    marginRight: '30rem',  
  },
  buttonBottom: {
    backgroundColor: '#81d4fa',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '30rem', 
    marginRight: '30rem',
    paddingTop: '30rem',
  },
  bottomButtonTextStyle: {
    textAlign: 'center', 
    alignContent:'center',
    fontSize: '18rem', 
    color: '#000000'
  },
  iconStyle: {
    flex: 1.7, 
    backgroundColor: '#4ba3c7',
  },
  disclaimer: {
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '23rem',
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
  },
  disclaimerButton: {
      paddingBottom: '10rem'
  },
  unitStyle:{ //new
    height: 35, 
    width: 65
  }
})

