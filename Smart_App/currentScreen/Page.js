import React, { useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableOpacity } from 'react-native-gesture-handler';

const Page = ({ backgroundColor, iconName, title, headerTitle, heightTitle, weightTitle, ageBox, genderBox, raceBox }) => {
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDate, setIsDate] = useState('Select your date of birth');

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
 
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
 
  const handleConfirm = async (date) => {
    var x = date.toLocaleString()
    var y = new Date()
    var y = y.toLocaleString()
    var data2 = y.split(' ')
    var data = x.split(' ')
    await AsyncStorage.setItem('userDOB', (data2[data2.length - 1] - data[data.length - 1]) + " ");
    setIsDate('your age is ' + (data2[data2.length - 1] - data[data.length - 1]))
    hideDatePicker();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor
        }}
      >
        <Icon name={iconName} size={172} color="white" style={{position: 'relative'}} />
        <View style={{ marginTop: 16 }}>
          {headerTitle !== "" ?
          <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'white', textAlign: 'center', paddingBottom: 100 }}>
            {headerTitle}
          </Text>
          :
          null
          }
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', paddingBottom: 100 }}>
            {title}
          </Text>
          {weightTitle !== "" ?
          <TextInput
            style={{
                height: 60,
                borderBottomColor: 'white',
                marginLeft: 30,
                marginRight: 30,
                marginTop: 50,
                marginBottom: 10,
                borderBottomWidth: 1,
                fontSize: 30
            }}
            onChangeText = { (text) => handleWtbox(text) }
            placeholder = {weightTitle}
            placeholderTextColor="#fff" 
            keyboardType={'numeric'}
            numeric
          />
          :
          null
          }
          {heightTitle !== "" ?
          <TextInput
            style={{
                height: 60,
                borderBottomColor: 'white',
                marginLeft: 30,
                marginRight: 30,
                marginTop: 30,
                marginBottom: 10,
                borderBottomWidth: 1,
                fontSize: 30
            }}
            onChangeText = { (text) => handleHtbox(text) }
            placeholder = {heightTitle}
            placeholderTextColor="#fff" 
            keyboardType={'numeric'}
            numeric
          />
          :
          null
          }
          {genderBox !== "" ?
          <DropDownPicker
            items={[
                {label: 'Select Gender', value: 'x'},
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
            ]}
            defaultValue={'x'}
            containerStyle={{height: 50, marginTop: 30, width: 330, alignSelf: 'center'}}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            dropDownStyle={{backgroundColor: '#fafafa', width: 330}}
            onChangeItem={item => handlegenbox(item)}
          />
          :
          null
          }
          {ageBox !== "" ?
          <View>
            <TouchableOpacity style={{ alignSelf: 'center', padding:20, marginBottom: 10, backgroundColor:'#fff', width:330, alignItems:'center', borderRadius:5, marginTop: 35,}} activeOpacity = {.5} onPress={ showDatePicker }>
            <Text style={{ fontSize: 16, marginRight: 135 }}>{isDate}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          :
          null
          }
          {raceBox !== "" ?
          <DropDownPicker
              items={[
                  {label: 'Select Race', value: 'x'},
                  {label: 'White', value: 'white'},
                  {label: 'Black/African American', value: 'black/african'},
                  {label: 'Others', value: 'others'},
              ]}
              defaultValue={'x'}
              containerStyle={{height: 50, marginTop: 20, width: 380, paddingLeft: 38}}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                  justifyContent: 'flex-start'
              }}
              dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 38, width: 310}}
              onChangeItem={item => handleracebox(item)}
          />
          :
          null
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Page;
