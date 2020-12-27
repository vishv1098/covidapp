import React, { Component } from 'react';
import { Text, View, Platform, Dimensions, TextInput, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modalbox'
import Button from 'react-native-button'
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

var screen = Dimensions.get('window')

class AddProfile extends Component {
    
    constructor(props) {
        super(props);
        this.dataDisplayFetch()
        this.state={
            user_age: '',
            user_race: '',
            user_gender: '',
            user_ht: '',
            user_wt: '',
            isDate: 'Click here to select your date of birth',
            isDatePickerVisible: false,
        }
    }

    dataDisplayFetch = async () => {
        try {
            const user_wt_value = await AsyncStorage.getItem('userWeight')
            const user_ht_value = await AsyncStorage.getItem('userHeight')
            this.setState({
                user_wt: user_wt_value,
                user_ht: user_ht_value,
            })
        } catch (error) {
            console.log(error)
        }
        
    }

    showAddModal = () => {
        this.setState({
            user_age: '',
            user_race: '',
            user_gender: '',
            user_ht: '',
            user_wt: '',
        })
        this.refs.myModal.open()
    }

    handleWtbox = async (inputText) => {
        if (inputText === '') {
        } else {
          await AsyncStorage.setItem('userWeight', inputText);
          this.setState({
              user_wt: inputText
          })
        }
    }

    handleHtbox = async (inputText) => {
        if (inputText === '') {
        } else {
          await AsyncStorage.setItem('userHeight', inputText);
          this.setState({
              user_ht: inputText
          })
        }
    }

    handlegenbox = async (inputText) => {
        if (inputText.value === 'x') {
        } else {
          await AsyncStorage.setItem('userGender', inputText.value);
          this.setState({
              user_gender: inputText.value
          })
        }
    }

    handleracebox = async (inputText) => {
        if (inputText.value === 'x') {
        } else {
          await AsyncStorage.setItem('userRace', inputText.value);
          this.setState({
              user_race: inputText.value
          })
        }
    }
    
    showDatePicker = () => {
        this.setState({
            isDatePickerVisible: true
        })
    }

    hideDatePicker = () => {
        this.setState({
            isDatePickerVisible: false
        })
    }

    handleConfirm = async (date) => {
        var x = date.toLocaleString()
        var y = new Date()
        var y = y.toLocaleString()
        var data2 = y.split(' ')
        var data = x.split(' ')
        await AsyncStorage.setItem('userDOB', (data2[data2.length - 1] - data[data.length - 1]) + " ");
        this.setState({
            isDate: 'your age is ' + (data2[data2.length - 1] - data[data.length - 1])
        })
        this.hideDatePicker();
    };

    showAddModal = () => {
        this.setState({
        })
        this.refs.myModal.open()
    }

    render() {
        return (
            <Modal
                ref = {"myModal"}
                style={{
                    justifyContent: 'center',
                    borderRadius: Platform.OS === 'ios' ? 30 : 25,
                    shadowRadius: 10,
                    width: screen.width - 60,
                    height: 500
                }}
                animationType="slide"
                position='center'
                backdrop={true}
                swipeArea={20}
                coverScreen={true}
                onClosed={() => {
                }}
            >
                <ScrollView>
                    <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center', paddingBottom: 10, marginTop: 40}}>You can change the parameters which you want to change and then press on save</Text>
                    <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 30,
                            marginBottom: 10,
                            borderBottomWidth: 1
                        }}
                        onChangeText = { (text) => this.handleWtbox(text) }
                        placeholder = {"Enter your weight in Kg"} 
                        keyboardType={'numeric'}
                        numeric
                    />
                    <DropDownPicker
                        items={[
                            {label: 'Select Gender', value: 'x'},
                            {label: 'Male', value: 'male'},
                            {label: 'Female', value: 'female'},
                        ]}
                        defaultValue={'x'}
                        containerStyle={{height: 40, marginTop: 20, width: 320, paddingLeft: 35}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 35 ,width: 285}}
                        onChangeItem={item => this.handlegenbox(item)}
                    />
                    <DropDownPicker
                        items={[
                            {label: 'Select Race', value: 'x'},
                            {label: 'White', value: 'white'},
                            {label: 'Black/African American', value: 'black/african'},
                            {label: 'Others', value: 'others'},
                        ]}
                        defaultValue={'x'}
                        containerStyle={{height: 40, marginTop: 20, width: 320, paddingLeft: 35}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 35, width: 285}}
                        onChangeItem={item => this.handleracebox(item)}
                    />
                    <View>
                        <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 10, backgroundColor:'#fafafa', width:290, height: 40, alignItems:'center', borderRadius:5, marginTop: 35, alignContent:'space-around'}} activeOpacity = {.5} onPress={ this.showDatePicker }>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop:5 }}>{this.state.isDate}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                        isVisible={this.state.isDatePickerVisible}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                        />
                    </View>
                    <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 20,
                            marginBottom: 10,
                            borderBottomWidth: 1
                        }}
                        onChangeText = { (text) => this.handleHtbox(text) }
                        placeholder = {"Enter your height in cm"}
                        keyboardType={'numeric'}
                        numeric
                    />
                    <Button
                        style={{fontSize: 18, color: 'white'}}
                        containerStyle={{
                            padding: 8,
                            marginTop: 50,
                            marginBottom: 80,
                            marginLeft: 70,
                            marginRight: 70,
                            height: 40,
                            borderRadius: 6,
                            backgroundColor: 'mediumseagreen'
                        }}
                        onPress={ async () => {
                            var x = []
                            // console.log(this.state.oxy,"------")
                            x.push(this.state.user_wt)
                            x.push(this.state.user_ht)
                            x.push(this.state.user_gender)
                            x.push(this.state.user_race)
                            // x.push(this.state.res_r)
                            // x.push(this.state.b_tmp)
                            // x.push(this.state.sex)
                            // x.push(this.state.white)
                            // x.push(this.state.black)
                            // x.push(this.state.others)
                            // x.push(this.state.ethini)
                            // x.push(this.state.age)
                            // await AsyncStorage.setItem('oxygen_saturation', ""+this.state.oxy)
                            // await AsyncStorage.setItem('diastolic_bloodpressure', ""+this.state.dbp)
                            // await AsyncStorage.setItem('systolic_bloodpressure', ""+this.state.sbp)
                            // await AsyncStorage.setItem('heart_rate', ""+this.state.hr)
                            // await AsyncStorage.setItem('respiratory_rate', ""+this.state.res_r)
                            // await AsyncStorage.setItem('temperature', ""+this.state.b_tmp)
                            // await AsyncStorage.setItem('sex',""+this.state.sex)
                            // await AsyncStorage.setItem('white-valid',""+this.state.white)
                            // await AsyncStorage.setItem('black-valid',""+this.state.black)
                            // await AsyncStorage.setItem('others-valid', ""+this.state.others)
                            // await AsyncStorage.setItem('ethini-valid', ""+this.state.ethini)
                            // await AsyncStorage.setItem('age-group', ""+this.state.age)
                            this.props.setData(x);
                            this.refs.myModal.close();
                        }}
                        >
                        Save
                    </Button>
                </ScrollView>
            </Modal>
        );
    }
}

export default AddProfile
