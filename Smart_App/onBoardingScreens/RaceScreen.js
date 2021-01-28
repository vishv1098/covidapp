import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, Keyboard, Dimensions, Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
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

const RaceScreen = () => {

    const navigation = useNavigation();
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [isMissingInfoWarn, setIsMissingInfoWarn] = useState(false)

    const handleracebox = async (inputText) => {
        if (inputText.value === 'x') {
        } else {
          await AsyncStorage.setItem('userRace', inputText.value);
        }
    }
    
    const handlegenbox = async (inputText) => {
        if (inputText.value === 'x') {
        } else {
            await AsyncStorage.setItem('userGender', inputText.value);
        }
    }

    const handleEthini = async() => {
      if(toggleCheckBox) {
        await AsyncStorage.setItem('userEthini', 'Hispanic or Latino')
      } else {
        await AsyncStorage.setItem('userEthini', 'Not - Hispanic / Latino')
      }
    }

    const validate = async() => {
      const z = await AsyncStorage.getItem('firstSkip');
      if (z === null) {
        await AsyncStorage.setItem('firstSkip', 'notnull');
        setIsMissingInfoWarn(true)
      } else {
        navigation.navigate('Home')
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
                      onPress: () => {setIsMissingInfoWarn(false), navigation.navigate('race')}
                  }}
                  negativeButton={{
                      title: "Continue",
                      titleStyle: styles.disclaimerButtonStyle,
                      style: styles.disclaimerButton,
                      onPress: () => {setIsMissingInfoWarn(false), navigation.navigate('Home')} 
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
                      <Image source={require('../appIcons/baseline_groups_black_48pt_3x.png')} resizeMode='contain' style={styles.headerIconStyle}></Image>
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
                                containerStyle={styles.fieldStyle}
                                style={{backgroundColor: '#b39ddb', borderWidth:1, borderColor: '#000000'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={styles.dropDownTextStyle}
                                onChangeItem={item => handlegenbox(item)}
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
                                  containerStyle={styles.fieldStyle}
                                  style={{backgroundColor: '#b39ddb', borderWidth:1, borderColor: '#000000'}}
                                  itemStyle={{
                                      justifyContent: 'flex-start'
                                  }}
                                  dropDownStyle={styles.dropDownRaceTextStyle}
                                  onChangeItem={item => handleracebox(item)}
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
                        <View style={styles.messgBox}>
                          <Text adjustsFontSizeToFit style={styles.content}>Your sex and ethnicity are provided to our models, as diseases affect people of different groups in dissimilar ways.</Text>
                        </View>
                    </View>
                    <View style={styles.headerNavigate}>
                        <TouchableOpacity  activeOpacity = {.5} style={styles.buttonTop} onPress={ async() => { handleEthini(); navigation.navigate('Home')}}>
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

export default RaceScreen;

const styles = EStyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    padding: 10,
    backgroundColor: '#b39ddb'
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
    flexDirection: 'row',
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
    marginTop: '4rem',
    marginBottom: '10rem',
    fontSize: '15rem',
    marginLeft: '30rem',
    marginRight: '30rem'
  },
  innerBottFieldHeaderHtField: {
    flex:16,
    justifyContent: 'center',
  },
  innerBottUnitHeaderHtField: {
    flex:4,
    justifyContent: 'center'
  },
  fieldStyle: {
    height: '40rem',
    width: '300rem',
    marginLeft: '30rem',
    marginRight: '30rem',
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
    backgroundColor: '#836fa9',
    flexDirection: 'row', 
    height: '53rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '30rem', 
    marginRight: '30rem',  
  },
  buttonBottom: {
    backgroundColor: '#b39ddb',
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
    backgroundColor: '#836fa9',
  },
  dropDownTextStyle: {
    backgroundColor: '#b39ddb',
    width: '300rem',
    height: '110rem',
    borderColor: '#000000',
  },
  dropDownRaceTextStyle: {
    backgroundColor: '#b39ddb',
    width: '300rem',
    height: '150rem',
    borderColor: '#000000'
  },
  labelStyleData: {
    fontSize: '14rem',
    fontWeight: '400'
  },
  messgBox: {
    flex: 2.8
  },
  checkView: {
    flex: 1, 
    justifyContent:'center'
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
})

