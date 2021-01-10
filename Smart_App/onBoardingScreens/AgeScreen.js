import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Dimensions, Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
    const [isDate, setIsDate] = useState('Select your date of birth');
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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.headerTitle}>
                        <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                            Profile
                        </Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <Icon name='today-outline' size={100} color="black" style={styles.headerIconStyle} />
                    </View>
                    <View style={styles.headerHtField}>
                      <View style={styles.innerTopHeaderHtField}>
                        <Text adjustsFontSizeToFit style={styles.tcP}>Date of Birth</Text>
                      </View>
                      <View style={styles.innerBottomHeaderHtField}>
                        <View style={styles.innerBottFieldHeaderHtField}>
                          <TouchableOpacity style={styles.fieldStyle} activeOpacity = {.5} onPress={ showDatePicker }>
                            <Text adjustsFontSizeToFit>{isDate}</Text>
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
                        <TouchableOpacity  activeOpacity = {.5} style={styles.buttonTop} onPress={ async() => { navigation.navigate('race')}}>
                            <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Next</Text>
                            <Icon name='chevron-forward-outline' size={22} color="#000000" style={styles.iconStyle} />
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
    padding: 10,
    backgroundColor: '#a5d6a7'
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
  },
  headerTitleText: {
    fontSize: '28rem', 
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
    flex: 3,
    flexDirection: 'row',
  },
  tcP: {
    marginTop: '5rem',
    marginBottom: '3rem',
    fontSize: '14rem',
    fontWeight: 'bold',
    marginLeft: '30rem',
    marginRight: '30rem'
  },
  tcL: {
    marginTop: '4rem',
    marginBottom: '10rem',
    fontSize: '16rem',
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
    height: '25rem',
    width: '290rem',
    fontSize: '14rem',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginLeft: '30rem',
    marginRight: '30rem',
  },
  content:{
    marginTop: '12rem',
    marginBottom: '5rem',
    fontSize: '16rem',
    marginLeft: '30rem',
    marginRight: '30rem'
  },
  buttonTextStyle: {
    flex: 10, 
    textAlign: 'center', 
    alignContent:'center', 
    marginLeft: '40rem', 
    fontSize: '22rem', 
    color: '#000000'
  },
  buttonTop: {
    backgroundColor: '#75a478',
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
    backgroundColor: '#75a478',
  },
})

