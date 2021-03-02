import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, Keyboard, Dimensions, Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
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

const AgeScreen = () => {

  const [isDobData, setIsDobData] = useState('Your age as of today will be displayed here.')
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDate, setIsDate] = useState('Pick your date of birth');
  const [isMissingInfoWarn, setIsMissingInfoWarn] = useState(false)
  const navigation = useNavigation();

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
    await AsyncStorage.setItem('userFullDob', res);
    await AsyncStorage.setItem('userDOB', age + " ");
    setIsDate(res)
    setIsDobData('As of today, you are ' + age + ' years old.')
    hideDatePicker();
  };

  const validate = async() => {
    const z = await AsyncStorage.getItem('firstSkip');
    if (z === null) {
      await AsyncStorage.setItem('firstSkip', 'notnull');
      setIsMissingInfoWarn(true)
    } else {
      navigation.navigate('race')
    }
  }

  const nextNavigate = async() => {
    const x = await AsyncStorage.getItem('userFullDob');
    const z = await AsyncStorage.getItem('firstMissingWarn');
    if (x == null && z == null) {
      await AsyncStorage.setItem('firstMissingWarn', 'notnull');
      setIsMissingInfoWarn(true)
    } else {
      navigation.navigate('race')
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
              title: "Cancel",
              titleStyle: styles.disclaimerButtonStyleBold,
              style: styles.disclaimerButton,
              onPress: () => {setIsMissingInfoWarn(false), navigation.navigate('age')}
          }}
          negativeButton={{
              title: "Continue",
              titleStyle: styles.disclaimerButtonStyle,
              style: styles.disclaimerButton,
              onPress: () => {setIsMissingInfoWarn(false), navigation.navigate('race')} 
          }}
          >
          <ScrollView>
            <Text style={styles.disclaimerContent}>Missing data may cause the model to predict inaccurate results. </Text>
          </ScrollView>
        </ConfirmDialog>
          <View style={styles.contentContainer}>
            <View style={styles.headerTitle}>
                <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                    Profile
                </Text>
            </View>
            <View style={styles.headerIcon}>
              <Image source={require('../appIcons/baseline_today_black_48pt_3x.png')} resizeMode='contain' style={styles.headerIconStyle}></Image>
            </View>
            <View style={styles.headerHtField}>
              <View style={styles.innerTopHeaderHtField}>
                <Text adjustsFontSizeToFit style={styles.tcP}>Date of Birth</Text>
              </View>
              <View style={styles.innerBottomHeaderHtField}>
                <View style={styles.innerBottFieldHeaderHtField}>
                  <TouchableOpacity style={styles.fieldStyle} activeOpacity = {.5} onPress={ showDatePicker }>
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
            <View style={styles.headerWtField}>
                <View style={styles.innerTopHeaderHtField}>
                    <Text adjustsFontSizeToFit style={styles.tcP}>Age</Text>
                </View>
                <View style={styles.innerBottomHeaderHtField}>
                    <View style={styles.innerBottFieldHeaderHtField}>
                        <Text adjustsFontSizeToFit style={styles.tcL}>{isDobData}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.headerMeaasge}>
                <Text adjustsFontSizeToFit style={styles.content}>Your age is provided as an input to our Machine Learning models. Age is indicative of vitality and diseases affect people of different age groups in dissimilar ways.</Text>
            </View>
            <View style={styles.headerNavigate}>
                <TouchableOpacity  activeOpacity = {.5} style={styles.buttonTop} onPress={ async() => nextNavigate()}>
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

export default AgeScreen;

const styles = EStyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    padding: normalize(25),
    backgroundColor: '#a5d6a7'
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
    fontSize: '26rem', 
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
    height: '26rem',
    fontSize: '15rem',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginLeft: '30rem',
    marginRight: '30rem',
  },
  content:{
    marginTop: '5rem',
    marginBottom: '10rem',
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
    backgroundColor: '#75a478',
    flexDirection: 'row', 
    height: '53rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '25rem', 
    marginRight: '30rem',  
  },
  buttonBottom: {
    backgroundColor: '#a5d6a7',
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
    backgroundColor: '#75a478',
  },
  dateFont: {
    fontSize:'15rem',
  },
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
      fontWeight:'400',
      color:'#007aff'
  },
  disclaimerButtonStyleBold: {
    fontSize:'16rem',
    fontWeight:'bold',
    color:'#007aff'
  },
})

