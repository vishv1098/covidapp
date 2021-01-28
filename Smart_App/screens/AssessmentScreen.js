import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

export function normalize(size) {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');
        
const scale = SCREEN_WIDTH / 380;
        
let entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

class AssessmentScreen extends Component {
  
    constructor(props) {
        super(props);
        this.getData();
        this.state = {
            lst : false,
            la : false,
            pc : false,
            sf : false,
            sb:false,
            fever:false,
            diarr:false,
            prob : 0,
            age: 0,
            gender: -1,
            bgfev:'#ffcc80',
            bgpc:'#ffcc80',
            bgsb:'#ffcc80',
            bgsf:'#ffcc80',
            bglst:'#ffcc80',
            bgla:'#ffcc80',
            bgdiarr:'#ffcc80',
            opfev:0,
            oppc:0,
            opsb:0,
            opsf:0,
            oplst:0,
            opla:0,
            opdiarr:0,
        }
    }

    getData = async () => {
      try {
        const DOB = await AsyncStorage.getItem('userDOB')
        const Gender = await AsyncStorage.getItem('userGender')
        if(Gender === "male" ) {
          this.setState({
            gender: 1,
            age:DOB
          })
        }
        else{
          this.setState({
            gender: 0,
            age:DOB,
          })
        }
      } catch(e) {
      }
    }

    setProb = async () => {
      await AsyncStorage.setItem('prob', ((Math.exp(-1.32-(0.01*this.state.age)+(0.44*this.state.gender)+(1.75*(this.state.lst?1:0))
      +(0.31*(this.state.pc?1:0))+(0.49*(this.state.sf?1:0))+(0.39*(this.state.la?1:0))))/(1+Math.exp(-1.32-(0.01*this.state.age)+(0.44*this.state.gender)
      +(1.75*(this.state.lst?1:0))+(0.31*(this.state.pc?1:0))+(0.49*(this.state.sf?1:0))+(0.39*(this.state.la?1:0)))))*100 + " ")
    }

    render() {
        return (
            <View style={styles.container}>
              <View style={styles.contentContainer}>
                <View style={styles.headerTitle}>
                  <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                      COVID-19 Assessment
                  </Text>
                </View>
                <View style={styles.headerIcon}>
                  <Image source={require('../appIcons/baseline_sick_black_48pt_3x.png')} resizeMode='contain' style={styles.headerIconStyle}></Image>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoTextHead}>Symptoms</Text>
                    <Text style={styles.infoText}>Select the symptoms you are experiencing.</Text>
                </View>
                <View style={styles.selectorBox}>
                    <TouchableOpacity style={[styles.buttonTop, {backgroundColor: this.state.bgfev}]} onPress={ async() => {if(this.state.bgfev === '#ffcc80'){
                          this.setState({
                            bgfev:'#ca9b52',
                            fever:true,
                            opfev:1,
                          })
                    } else {
                      this.setState({
                        bgfev:'#ffcc80',
                        fever:false,
                        opfev:0
                      })
                    } }}>
                        <Text style={styles.buttonTxt}>Fever</Text>
                        <Icon name='checkmark-circle' size={22} color="#000000" style={[styles.iconStyle, {opacity:this.state.opfev}]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,{backgroundColor: this.state.bgpc}]} onPress={ async() => {if(this.state.bgpc === '#ffcc80'){
                            this.setState({
                              bgpc:'#ca9b52',
                              pc:true,
                              oppc:1,
                            })
                      } else {
                        this.setState({
                          bgpc:'#ffcc80',
                          pc:false,
                          oppc:0,
                        })
                      } }}>
                        <Text style={styles.buttonTxt}>Persistent Cough</Text>
                        <Icon name='checkmark-circle' size={22} color="#000000" style={[styles.iconStyle, {opacity:this.state.oppc}]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,{backgroundColor: this.state.bgsb}] } onPress={ async() => {if(this.state.bgsb === '#ffcc80'){
                            this.setState({
                              bgsb:'#ca9b52',
                              sb:true,
                              opsb:1
                            })
                      } else {
                        this.setState({
                          bgsb:'#ffcc80',
                          sb:false,
                          opsb:0
                        })
                      } }}>
                        <Text style={styles.buttonTxt}>Shortness of Breath</Text>
                        <Icon name='checkmark-circle' size={22} color="#000000" style={[styles.iconStyle, {opacity:this.state.opsb}]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,{backgroundColor: this.state.bgsf}] } onPress={ async() => {if(this.state.bgsf === '#ffcc80'){
                              this.setState({
                                bgsf:'#ca9b52',
                                sf:true,
                                opsf:1,
                              })
                        } else {
                          this.setState({
                            bgsf:'#ffcc80',
                            sf:false,
                            opsf:0
                          })
                        } }}>
                        <Text style={styles.buttonTxt}>Severe Fatigue</Text>
                        <Icon name='checkmark-circle' size={22} color="#000000" style={[styles.iconStyle, {opacity:this.state.opsf}]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,{backgroundColor: this.state.bglst}] } onPress={ async() => {if(this.state.bglst === '#ffcc80'){
                            this.setState({
                              bglst:'#ca9b52',
                              lst:true,
                              oplst:1
                            })
                        } else {
                          this.setState({
                            bglst:'#ffcc80',
                            lst:false,
                            oplst:0
                          })
                        } }}>
                        <Text style={styles.buttonTxt}>Loss of Smell and Taste</Text>
                        <Icon name='checkmark-circle' size={22} color="#000000" style={[styles.iconStyle, {opacity:this.state.oplst}]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,{backgroundColor: this.state.bgla}] } onPress={ async() => {if(this.state.bgla === '#ffcc80'){
                            this.setState({
                              bgla:'#ca9b52',
                              la:true,
                              opla:1
                            })
                      } else {
                        this.setState({
                          bgla:'#ffcc80',
                          la:false,
                          opla:0
                        })
                      } }}>
                        <Text style={styles.buttonTxt}>Loss of Appetite </Text>
                        <Icon name='checkmark-circle' size={22} color="#000000" style={[styles.iconStyle, {opacity:this.state.opla}]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonBottom,{backgroundColor: this.state.bgdiarr}]} onPress={ async() => {if(this.state.bgdiarr === '#ffcc80'){
                            this.setState({
                              bgdiarr:'#ca9b52',
                              diarr:true,
                              opdiarr:1
                            })
                      } else {
                        this.setState({
                          bgdiarr:'#ffcc80',
                          diarr:false,
                          opdiarr:0
                        })
                      } }}>
                        <Text style={styles.buttonTxt}>Diarrhoea</Text>
                        <Icon name='checkmark-circle' size={22} color="#000000" style={[styles.iconStyle, {opacity:this.state.opdiarr}]} />
                    </TouchableOpacity>
                </View>
                <View style={styles.nextButtonBox}>
                      <TouchableOpacity  activeOpacity = {.5} style={styles.nextButton} onPress={ async() => { this.setProb(), this.props.navigation.navigate('vitals')}}>
                            <Text style={styles.buttonTextStyle}>Next</Text>
                            <Icon name='chevron-forward-outline' size={22} color="#000000" style={styles.iconStyle} />
                      </TouchableOpacity>
                </View>
              </View>
      </View>
    );
  }
}

export default AssessmentScreen

const styles = EStyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    padding:10,
    backgroundColor: '#ffcc80'
  },
  contentContainer: {
    width: "100%",
    aspectRatio: 0.5,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffcc80',
    padding:10
  },
  headerTitle: {
    flex: 1,
    width: "100%",
    backgroundColor: '#ffcc80',
  },
  headerTitleText: {
    fontSize: '27rem', 
    fontWeight: 'bold', 
    color: '#000000', 
    textAlign: 'center',  
    marginLeft: '10rem', 
    marginRight: '10rem'
  },
  headerIcon: {
    flex: 1.4,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10rem', 
    marginRight: '10rem',
    backgroundColor: '#ffcc80'
  },
  headerIconStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10rem', 
    marginRight: '10rem'
  },
  infoBox: {
    flex: 0.7,
    width: "100%",
    backgroundColor: '#ffcc80',
  },
  infoTextHead:{
    marginTop: '12rem',
    marginBottom: '5rem',
    marginLeft: '5rem',
    fontSize: '15rem',
    fontWeight: 'bold',
  },
  infoText:{
    marginLeft:'5rem',
    fontSize: '16rem',
  },
  selectorBox: {
    flex:3,
    width:"100%",
    flexDirection:'column',
    justifyContent:'flex-start',
    borderRadius:0,
    backgroundColor:'#ffcc80',
    borderColor:'black',
  },
  nextButtonBox: {
    flex:1,
    width:"100%",
    justifyContent:'center',
    backgroundColor:'#ffcc80'
  },
  button:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    flex:1,
    borderColor:'black',
    borderBottomWidth:2,
    borderLeftWidth:2,
    borderRightWidth:2
    
  },
  buttonTop:{
    flexDirection:'row',
    alignSelf:'stretch',
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    borderColor:'black',
    borderWidth:2,
    borderTopLeftRadius: 50, 
    borderTopRightRadius: 50,
  },
  buttonBottom:{
    flexDirection:'row',
    alignSelf:'stretch',
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    backgroundColor:'#ffcc80',
    borderColor:'black',
    borderBottomWidth:2,
    borderLeftWidth:2,
    borderRightWidth:2,
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50,
  },
  buttonTxt:{
    flex: 10, 
    marginLeft: '40rem',
    textAlign: 'center', 
    alignContent:'center', 
    alignSelf:'center',
    fontSize:'18rem',
  },
  nextButton: {
    backgroundColor: '#ca9b52',
    flexDirection: 'row', 
    height: '53rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '30rem', 
    marginRight: '30rem',  
  },
  buttonTextStyle: {
    flex: 10, 
    textAlign: 'center', 
    alignContent:'center', 
    marginLeft: '40rem', 
    fontSize: '18rem', 
    color: '#000000'
  },
  iconStyle: {
    flex: 1.7, 
  }
});
