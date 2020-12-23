import React, { Component } from 'react';
import { Text, View, Platform, Dimensions, TextInput } from 'react-native'
import Modal from 'react-native-modalbox'
import Button from 'react-native-button'
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';

var screen = Dimensions.get('window')

class AddModal extends Component {
    
    constructor(props) {
        super(props);
        this.state={
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
            tunit: 'c'
        }
    }

    showAddModal = () => {
        this.setState({
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
            tunit: 'c'
        })
        this.refs.myModal.open()
    }

    handleOxybox = (inputText) => {
        if (inputText == '') {
            this.setState({
                oxy: -1
            })
        } else {
            var a = parseFloat(inputText)
            this.setState({
                oxy: a
            });
        }
    };

    handledbpbox = (inputText) => {
        if (inputText == '') {
            this.setState({
                dbp: -1
            })
        } else {
            var a = parseFloat(inputText)
            this.setState({
                dbp: a
            });
        }
    }

    handlesbpbox = (inputText) => {
        if (inputText == '') {
            this.setState({
                sbp: -1
            })
        } else {
            var a = parseFloat(inputText)
            this.setState({
                sbp: a
            });
        }
    }

    handlehrbox = (inputText) => {
        if (inputText == '') {
            this.setState({
                hr: -1
            })
        } else {
            var a = parseFloat(inputText)
            this.setState({
                hr: a
            });
        }
    }

    handleresbox = (inputText) => {
        if (inputText == '') {
            this.setState({
                res_r: -1
            })
        } else {
            var a = parseFloat(inputText)
            this.setState({
                res_r: a
            });
        }
    }

    handletmpbox = (inputText) => {
        if (inputText == '') {
            this.setState({
                b_tmp: -1
            })
        } else {
            var a = parseFloat(inputText)
            this.setState({
                b_tmp: a
            });
        }
    }

    handleUnitbox = (inputText) => {
        if (inputText.value === 'f') {
            var temp = this.state.b_tmp
            this.setState({
                b_tmp:  (temp - 32 )*5/9
            })
        }
    }

    handlegenbox = (inputText) => {
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

    handleagebox = (inputText) => {
        if (inputText == '') {
            this.setState({
                age: 1
            })
        } else {
            var a = parseFloat(inputText)
            this.setState({
                age: a/5
            });
        }
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
                    <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center', paddingBottom: 10, marginTop: 40}}>Vital and Demographics Data</Text>
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
                        onChangeText = { (text) => this.handleOxybox(text)}
                        placeholder = "Enter the Oxygen Saturation value"
                        keyboardType={'numeric'}
                        numeric
                    />
                    <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 20,
                            marginBottom: 10,
                            borderBottomWidth: 1,
                        }}
                        onChangeText = { (text) => this.handledbpbox(text)}
                        placeholder = "Enter the Diastolic blood pressure value"
                        keyboardType={'numeric'}
                        numeric
                    />
                    <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 20,
                            marginBottom: 10,
                            borderBottomWidth: 1,
                        }}
                        onChangeText = { (text) => this.handlesbpbox(text)}
                        placeholder = "Enter the Systolic blood pressure value"
                        keyboardType={'numeric'}
                        numeric
                    />
                    <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 20,
                            marginBottom: 10,
                            borderBottomWidth: 1,
                        }}
                        onChangeText = { (text) => this.handlehrbox(text)}
                        placeholder = "Enter the Heart rate value per minute"
                        keyboardType={'numeric'}
                        numeric
                    />
                    <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 20,
                            marginBottom: 10,
                            borderBottomWidth: 1,
                        }}
                        onChangeText = { (text) => this.handleresbox(text)}
                        placeholder = "Enter the Respiratory rate value"
                        keyboardType={'numeric'}
                        numeric
                    />
                    <View style={{flexDirection: 'row'}}>
                        <TextInput
                            style={{
                                height: 40,
                                borderBottomColor: 'gray',
                                marginLeft: 30,
                                marginRight: 5,
                                marginTop: 20,
                                marginBottom: 10,
                                borderBottomWidth: 1,
                                width: 200
                            }}
                            onChangeText = { (text) => this.handletmpbox(text)}
                            placeholder = "Enter the Body temperature value"
                            keyboardType={'numeric'}
                            numeric
                        />
                        <DropDownPicker
                            items={[
                                {label: 'Unit', value: 'c'},
                                {label: '°C', value: 'c'},
                                {label: '°F', value: 'f'},
                            ]}
                            defaultValue={this.state.tunit}
                            containerStyle={{height: 40, marginTop: 20, width: 100, paddingLeft: 5}}
                            style={{backgroundColor: '#fafafa'}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 5, width: 95}}
                            onChangeItem={item => this.handleUnitbox(item)}
                        />
                    </View>
                    <DropDownPicker
                        items={[
                            {label: 'Select Gender', value: 'male'},
                            {label: 'Male', value: 'male'},
                            {label: 'Female', value: 'female'},
                        ]}
                        defaultValue={this.state.gender}
                        containerStyle={{height: 40, marginTop: 20, width: 320, paddingLeft: 35}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 35, width: 285}}
                        onChangeItem={item => this.handlegenbox(item)}
                    />
                    <DropDownPicker
                        items={[
                            {label: 'Select Race', value: 'white'},
                            {label: 'White', value: 'white'},
                            {label: 'Black/African American', value: 'black/african'},
                            {label: 'Others', value: 'others'},
                        ]}
                        defaultValue={this.state.race}
                        containerStyle={{height: 40, marginTop: 20, width: 320, paddingLeft: 35}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 35, width: 285}}
                        onChangeItem={item => this.handleracebox(item)}
                    />
                    <DropDownPicker
                        items={[
                            {label: 'Select Ethnicity', value: 'nothispanic/latino'},
                            {label: 'Hispanic/Latino', value: 'hispanic/latino'},
                            {label: 'Not Hispanic/Latino', value: 'nothispanic/latino'},
                            {label: 'Others', value: 'others'},
                        ]}
                        defaultValue={this.state.ethnicity}
                        containerStyle={{height: 40, marginTop: 20, width: 320, paddingLeft: 35}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa', marginLeft: 35, width: 285}}
                        onChangeItem={item => this.handleethinibox(item)}
                    />
                    <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 20,
                            marginBottom: 10,
                            borderBottomWidth: 1,
                        }}
                        onChangeText = { (text) => this.handleagebox(text)}
                        placeholder = "Enter your age"
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
                            console.log(this.state.oxy,"------")
                            x.push(this.state.oxy)
                            x.push(this.state.dbp)
                            x.push(this.state.sbp)
                            x.push(this.state.hr)
                            x.push(this.state.res_r)
                            x.push(this.state.b_tmp)
                            x.push(this.state.sex)
                            x.push(this.state.white)
                            x.push(this.state.black)
                            x.push(this.state.others)
                            x.push(this.state.ethini)
                            x.push(this.state.age)
                            await AsyncStorage.setItem('oxygen_saturation', ""+this.state.oxy)
                            await AsyncStorage.setItem('diastolic_bloodpressure', ""+this.state.dbp)
                            await AsyncStorage.setItem('systolic_bloodpressure', ""+this.state.sbp)
                            await AsyncStorage.setItem('heart_rate', ""+this.state.hr)
                            await AsyncStorage.setItem('respiratory_rate', ""+this.state.res_r)
                            await AsyncStorage.setItem('temperature', ""+this.state.b_tmp)
                            await AsyncStorage.setItem('sex',""+this.state.sex)
                            await AsyncStorage.setItem('white-valid',""+this.state.white)
                            await AsyncStorage.setItem('black-valid',""+this.state.black)
                            await AsyncStorage.setItem('others-valid', ""+this.state.others)
                            await AsyncStorage.setItem('ethini-valid', ""+this.state.ethini)
                            await AsyncStorage.setItem('age-group', ""+this.state.age)
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

export default AddModal
