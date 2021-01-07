import React from 'react';  
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'; 
import AsyncStorage from '@react-native-community/async-storage';
import AddProfile from './AddProfile';

class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.datafetch()
    this.state={
      user_age: '',
      user_avatar: 'https://i.kinja-img.com/gawker-media/image/upload/t_original/ijsi5fzb1nbkbhxa2gc1.png',
      female_avatar: 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png',
      male_avatar: 'https://i.kinja-img.com/gawker-media/image/upload/t_original/ijsi5fzb1nbkbhxa2gc1.png',
      user_race: '',
      user_gender: '',
      user_ht: '',
      user_wt: '',
      user_ethini: '',
    }
    this._onFormData = this._onFormData.bind(this);
  }

  async componentDidMount() {
  }

  datafetch = async() => {
    try {
      const user_age_value = await AsyncStorage.getItem('userDOB')
      const user_gender_value = await AsyncStorage.getItem('userGender')
      const user_ht_value = await AsyncStorage.getItem('userHeight')
      const user_wt_value = await AsyncStorage.getItem('userWeight')
      const user_race_value = await AsyncStorage.getItem('userRace')
      const user_ethini_value = await AsyncStorage.getItem('userEthini')
      var realFeet = ((user_ht_value*0.393700) / 12);
      var feet = Math.floor(realFeet);
      var inches = Math.round((realFeet - feet) * 12);
      if (user_gender_value === "female") {
        this.setState({
          user_avatar: this.state.female_avatar,
        })
      }
      this.setState({
        user_age: user_age_value,
        user_race: user_race_value,
        user_gender: user_gender_value,
        user_ht: feet + " ft, " + inches + ' in',
        user_wt: user_wt_value,
        user_ethini: user_ethini_value
      })
    } catch (error) {
      console.log(error)
    }
  }

  _onFormData = async() => {
      this.refs.addModal.showAddModal();
  }

  setData = async (data) => {
    var htdata = data[1]
    var realFeet = ((htdata*0.393700) / 12);
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    if (data[2] === "female") {
      this.setState({
        user_avatar: this.state.female_avatar,
        user_gender: data[2]
      })
    } else {
      this.setState({
        user_avatar: this.state.male_avatar,
        user_gender: data[2]
      })
    }
    this.setState({ 
      user_wt: data[0],
      user_ht: feet + " ft, " + inches + ' in',
      user_race: data[3]
    })
  }

  render() {
      return ( 
        <View style={styles.container}>   
          <ScrollView>
            <View style={{alignItems: 'center', marginTop: 160}}>
              <Image source={{ uri: this.state.user_avatar }} style={{width: 140, height: 140, borderRadius: 100, marginTop:-70}}></Image>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'grey', marginTop: 20}}>{this.state.user_age}, {this.state.user_gender}</Text>
            </View>
            <View style={{alignSelf: 'center', flexDirection: "row", justifyContent: 'center',backgroundColor:'#fff', width: '90%', padding:20, paddingBottom: 22, borderRadius:10, shadowOpacity:80, elevation: 15, marginTop: 20}}>
              <Text style={{fontSize: 20}}>Height : {this.state.user_ht}</Text>
            </View>
            <View style={{alignSelf: 'center', flexDirection: "row", justifyContent: 'center',backgroundColor:'#fff', width: '90%', padding:20, paddingBottom: 22, borderRadius:10, shadowOpacity:80, elevation: 15, marginTop: 20}}>
              <Text style={{fontSize: 20}}>Weight : {this.state.user_wt} kg</Text>
            </View>
            <View style={{alignSelf: 'center', flexDirection: "row", justifyContent: 'center',backgroundColor:'#fff', width: '90%', padding:20, paddingBottom: 22, borderRadius:10, shadowOpacity:80, elevation: 15, marginTop: 20}}>
              <Text style={{fontSize: 20}}>Race : {this.state.user_race}</Text>
            </View>
            <View style={{alignSelf: 'center', flexDirection: "row", justifyContent: 'center',backgroundColor:'#fff', width: '90%', padding:20, paddingBottom: 22, borderRadius:10, shadowOpacity:80, elevation: 15, marginTop: 20, marginBottom: 40}}>
              <Text style={{fontSize: 20}}>Ethnicity : {this.state.user_ethini}</Text>
            </View>
            <View>
                <Text style={{color: 'white', marginTop: 50, textAlign: 'center', alignContent:'space-around', alignItems: 'center'}}>These values will go in to the model to predict the results. You can even edit your details</Text>
                <TouchableOpacity style={{ padding: 8, marginTop: 20, marginBottom: 80, marginLeft: 70, marginRight: 70, height: 60, backgroundColor:'mediumseagreen', borderRadius: 25, justifyContent: 'center'}} onPress={this._onFormData}>
                    <Text style={{textAlign:'center', fontSize: 22, color: 'white', fontWeight: 'bold'}}>edit</Text>
                </TouchableOpacity>
            </View>
            <AddProfile ref={'addModal'} setData={this.setData}>
            </AddProfile>
          </ScrollView>
        </View>  
      );
    }
}

const styles = StyleSheet.create({  
    container: {
      flex: 1,
      backgroundColor: 'black'
    },
    containerData: {  
      flex: 1,
    }, 
});

export default ProfileScreen
