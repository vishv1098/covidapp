import React from 'react';  
import { StyleSheet, Text, View, Image, ScrollView, TouchableHighlight, TouchableOpacity, Button, Dimensions } from 'react-native'; 
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.datafetch()
    this.state={
      user_age: '',
      user_avatar: 'https://i.kinja-img.com/gawker-media/image/upload/t_original/ijsi5fzb1nbkbhxa2gc1.png',
      user_Avgsteps: '',
      user_dob: '',
      user_name: '',
      user_gender: '',
      user_ht: '',
      user_wt: ''
    }
  }

  datafetch = async() => {
    try {
      const user_age_value = await AsyncStorage.getItem('user_age')
      const user_avatar_value = await AsyncStorage.getItem('user_avatar')
      const user_Avgsteps_value = await AsyncStorage.getItem('user_avgDailySteps')
      const user_dob_value = await AsyncStorage.getItem('user_dob')
      const user_name_value = await AsyncStorage.getItem('user_name')
      const user_gender_value = await AsyncStorage.getItem('user_gender')
      const user_ht_value = await AsyncStorage.getItem('user_height')
      const user_wt_value = await AsyncStorage.getItem('user_weight')
      var realFeet = ((user_ht_value*0.393700) / 12);
      var feet = Math.floor(realFeet);
      var inches = Math.round((realFeet - feet) * 12);
      this.setState({
        user_age: user_age_value,
        user_avatar: user_avatar_value,
        user_Avgsteps: user_Avgsteps_value,
        user_dob: user_dob_value,
        user_name: user_name_value,
        user_gender: user_gender_value,
        user_ht: feet + " ft, " + inches + ' in',
        user_wt: user_wt_value
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    if (this.state.user_name === null) {
      return (
        <View style={styles.containerData}>
          <ScrollView>
            <View style={{padding:10, width:'100%'}}>
              <TouchableOpacity>
                {/* <Image source={require('../assets/back.png')} style={{width: 30, height: 30}}/> */}
                <Icon.Button name="ios-home" size={25} backgroundColor="#00a8b5"
                  onPress={() => {this.props.navigation.navigate('Home')}} />
                <View></View>
                <View></View>
              </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: 350, paddingLeft: 25, paddingRight: 25}}>
              <Text>You can see this screen only after giving access to fitbit device in the device screen</Text>
            </View>
          </ScrollView>
        </View>
      )
    } else {
      return ( 
        <View style={styles.container}>   
          <ScrollView>
            <View style={{padding:10, width:'100%', backgroundColor:'white', height: 150}}>
              <TouchableOpacity>
                {/* <Image source={require('../assets/back.png')} style={{width: 30, height: 30}}/> */}
                <Icon.Button name="ios-home" size={25} backgroundColor="#00a8b5"
                  onPress={() => {this.props.navigation.navigate('Home')}} />
                <View></View>
                <View></View>
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <Image source={{ uri: this.state.user_avatar }} style={{width: 140, height: 140, borderRadius: 100, marginTop:-70}}></Image>
              <Text style={{fontSize: 25, fontWeight: 'bold', padding: 10,color: 'white'}}>{this.state.user_name}</Text>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'grey'}}>{this.state.user_age}, {this.state.user_gender}</Text>
            </View>
            <View style={{alignSelf: 'center', flexDirection: "row", justifyContent: 'center',backgroundColor:'#fff', width: '90%', padding:20, paddingBottom: 22, borderRadius:10, shadowOpacity:80, elevation: 15, marginTop: 20}}>
              <Text style={{fontSize: 20}}>Average Daily Steps : {this.state.user_Avgsteps}</Text>
            </View>
            <View style={{alignSelf: 'center', flexDirection: "row", justifyContent: 'center',backgroundColor:'#fff', width: '90%', padding:20, paddingBottom: 22, borderRadius:10, shadowOpacity:80, elevation: 15, marginTop: 20}}>
              <Text style={{fontSize: 20}}>Birthday : {this.state.user_dob}</Text>
            </View>
            <View style={{alignSelf: 'center', flexDirection: "row", justifyContent: 'center',backgroundColor:'#fff', width: '90%', padding:20, paddingBottom: 22, borderRadius:10, shadowOpacity:80, elevation: 15, marginTop: 20}}>
              <Text style={{fontSize: 20}}>Height : {this.state.user_ht}</Text>
            </View>
            <View style={{alignSelf: 'center', flexDirection: "row", justifyContent: 'center',backgroundColor:'#fff', width: '90%', padding:20, paddingBottom: 22, borderRadius:10, shadowOpacity:80, elevation: 15, marginTop: 20, marginBottom: 40}}>
              <Text style={{fontSize: 20}}>Weight : {this.state.user_wt} kg</Text>
            </View>
          </ScrollView>
        </View>  
      );
    }  
  }
}

const styles = StyleSheet.create({  
    container: {
      flex: 1,
      backgroundColor: 'black'
    },
    containerData: {  
      flex: 1,  
      // justifyContent: 'center',  
      // alignItems: 'center'  
    }, 
});

export default ProfileScreen
