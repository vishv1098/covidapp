import React from 'react';
import { View, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Dimensions, Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import { useState } from 'react';

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

export function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
}

const EditProfile= () => {

  const navigation = useNavigation();
  const [height,htSet] = useState('');
  const [weight,wtSet] = useState('');
  const [gender,genSet] = useState('x');
  const [dob,dobSet] = useState('');
  const [race,raceSet] = useState('x');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDate, setIsDate] = useState('Pick your date of birth');
  const [toggleCheckBox, setToggleCheckBox] = useState(false)


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
 
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
 
  const handleConfirm = async (date) => {
    var today = new Date(date)
    var x = today.toDateString().split(' ')
    var res = x[1]+' '+x[2]+', '+x[3]; 
    var age = getAge(date)
    dobSet(age);
    setIsDate(res)
    hideDatePicker();
  };
  
  setData = async () => {
    if(isDate!=="Pick your date of birth"){
      await AsyncStorage.setItem('userFullDob', isDate);
      await AsyncStorage.setItem('userDOB', dob + " ");
    }
    if(height!=="")
        await AsyncStorage.setItem('userHeight', height + " ");
    if(weight!=="")
        await AsyncStorage.setItem('userWeight', weight + " ");
    if(gender!=='x')
        await AsyncStorage.setItem('userGender', gender + " ");
    if(race!=='x')
        await AsyncStorage.setItem('userRace', race + " ");
    if(toggleCheckBox) {
        await AsyncStorage.setItem('userEthini', 'Hispanic or Latino')
    } else {
        await AsyncStorage.setItem('userEthini', 'Not - Hispanic / Latino')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
          <View style={styles.contentContainer}>
              <View style={styles.headerTitle}>
                  <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                      Edit Profile
                  </Text>
              </View>
              <View style={styles.headerHtField}>
                  <View style={styles.innerTopHeaderHtField}>
                    <Text adjustsFontSizeToFit style={styles.tcP}>Height</Text>
                  </View>
                  <View style={styles.innerBottomHeaderHtField}>
                    <View style={styles.innerBottFieldHeaderHtField}>
                        <TextInput
                          style={[styles.fieldStyle,{borderBottomWidth:1,borderBottomColor:'black'}]}
                          onChangeText = { (text) => htSet(text) }
                          placeholder = {'Enter your height in centimeters'}
                          placeholderTextColor="#000000" 
                          keyboardType={'numeric'}
                          numeric
                        />
                    </View>
                    <View style={styles.innerBottUnitHeaderHtField}>
                      <Text adjustsFontSizeToFit style={styles.tcL}>cm</Text>
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
                          style={[styles.fieldStyle,{borderBottomWidth:1,borderBottomColor:'black'}]}
                          onChangeText = { (text) => wtSet(text) }
                          placeholder = {'Enter your weight in kilograms'}
                          placeholderTextColor="#000000" 
                          keyboardType={'numeric'}
                          numeric
                        />
                    </View>
                    <View style={styles.innerBottUnitHeaderHtField}>
                      <Text adjustsFontSizeToFit style={styles.tcL}>kg</Text>
                    </View>
                  </View>
              </View>
              <View style={styles.headerHtField}>
                      <View style={styles.innerTopHeaderHtField}>
                        <Text adjustsFontSizeToFit style={styles.tcP}>Date of Birth</Text>
                      </View>
                      <View style={styles.innerBottomHeaderHtField}>
                        <View style={styles.innerBottFieldHeaderHtField}>
                          <TouchableOpacity style={[styles.fieldStyle,{borderBottomWidth:1,borderBottomColor:'black'}]} activeOpacity = {.5} onPress={ showDatePicker }>
                            <Text adjustsFontSizeToFit style={styles.dateFont}>{isDate}</Text>
                          </TouchableOpacity>
                          <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                          />
                        </View>
                      </View>
                </View>
                <View style={styles.headerHtField}>
                      <View style={styles.innerTopHeaderHtField}>
                        <Text adjustsFontSizeToFit style={styles.tcP}>Sex</Text>
                      </View>
                      <View style={styles.innerBottomHeaderHtField}>
                        <View style={styles.innerBottFieldHeaderHtField}>
                            <DropDownPicker
                                items={[
                                    {label: 'Select your sex', value: 'x'},
                                    {label: 'Male', value: 'male'},
                                    {label: 'Female', value: 'female'},
                                ]}
                                defaultValue={'x'}
                                containerStyle={styles.fieldStyleDrop}
                                style={{borderWidth:1, borderColor: '#000000'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={styles.dropDownTextStyle}
                                onChangeItem={item => genSet(item.value)}
                                labelStyle={styles.labelStyleData}
                            />
                        </View>
                      </View>
                </View>
                <View style={styles.headerWtField}>
                        <View style={styles.innerTopHeaderHtField}>
                            <Text adjustsFontSizeToFit style={styles.tcP}>Race</Text>
                        </View>
                        <View style={styles.innerBottomHeaderHtField}>
                            <View style={styles.innerBottFieldHeaderHtField}>
                              <DropDownPicker
                                  items={[
                                      {label: 'Select your race', value: 'x'},
                                      {label: 'White', value: 'white'},
                                      {label: 'Black/African American', value: 'black/african'},
                                      {label: 'Others', value: 'others'},
                                  ]}
                                  defaultValue={'x'}
                                  containerStyle={styles.fieldStyleDrop}
                                  style={{ borderWidth:1, borderColor: '#000000'}}
                                  itemStyle={{
                                      justifyContent: 'flex-start'
                                  }}
                                  dropDownStyle={styles.dropDownRaceTextStyle}
                                  onChangeItem={item => raceSet(item.value)}
                                  labelStyle={styles.labelStyleData}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.headerMeaasge}>
                        <View style={styles.ethiniOuterBox}>
                          <View style={styles.ethiniInner}>
                            <Text adjustsFontSizeToFit style={styles.ethiniStyle}>Are you Hispanic or Latino?</Text>
                          </View>
                          <View style={styles.checkView}>
                            <CheckBox
                              disabled={false}
                              value={toggleCheckBox}
                              onValueChange={(newValue) => setToggleCheckBox(newValue)}
                              style={{color: '#000000'}}
                              onCheckColor='#000000'
                            />
                          </View>
                        </View>
                    </View>
                <View style={styles.headerNavigate}>
                    <TouchableOpacity  activeOpacity = {.5} style={styles.buttonTop} onPress={ async() => { this.setData(),navigation.navigate('profile')}}>
                    <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Done</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.headerNavigate}>
                    <TouchableOpacity  activeOpacity = {.5} style={styles.buttonBot} onPress={ async() => { navigation.navigate('profile')}}>
                    <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Cancel</Text>
                    </TouchableOpacity>
                </View>
          </View>
      </View>
    </TouchableWithoutFeedback>
  )
};

export default EditProfile;

const styles = EStyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    padding: 10,
    backgroundColor:'white'
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
  headerHtField: {
    flex: 0.8,
    width: "100%",
  },
  headerWtField: {
    flex: 0.8,
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
    justifyContent:'center',
    marginLeft: '30rem',
    marginRight: '30rem'
  },
  fieldStyleDrop: {
    height: '40rem',
    width: '250rem',
    justifyContent:'center',
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
    fontSize: '18rem', 
    color: '#000000'
  },
  buttonTop: {
    backgroundColor: '#158158',
    flexDirection: 'row', 
    height: '53rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '30rem', 
    marginRight: '30rem',  
  },
  buttonBot: {
    backgroundColor: '#adadad',
    flexDirection: 'row', 
    height: '53rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '30rem', 
    marginRight: '30rem',  
  },
  dateFont: {
    fontSize:'15rem',
  },
  dropDownTextStyle: {
    backgroundColor: 'white',
    width: '250rem',
    height: '110rem',
    borderColor: '#000000',
  },
  dropDownRaceTextStyle: {
    backgroundColor: 'white',
    width: '250rem',
    height: '150rem',
    borderColor: '#000000'
  },
  labelStyleData: {
    fontSize: '14rem',
    fontWeight: '400'
  },
  ethiniStyle: {
    marginLeft: '30rem', 
    marginRight: '30rem',
    fontSize: '15rem'
  },
  ethiniOuterBox: {
    flex: 1, 
    flexDirection: 'row'
  },
  ethiniInner: {
    flex: 2.5,
    justifyContent: 'center'
  },
  headerMeaasge: {
    flex: 1,
    width: "100%",
  },
  checkView: {
    flex: 1, 
    justifyContent:'center'
  }
})

