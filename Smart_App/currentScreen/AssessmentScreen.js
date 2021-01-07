import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity,Dimensions } from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';

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
     

        this.state = {
            lst : false,
            //lstno : false,
            la : false,
            //lano : false,
            pc : false,
            //pcno : false,
            sf : false,
            //sfno : false,
            sb:false,
            //sbno:false,
            fever:false,
            //feverno:false,
            diarr:false,
            //diarrno:false,
            //na : false,
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

    // componentWillUnmount(){
    //   const {assess} = this.props.route.params;
    //   assess()
    // }

        
    // getData = async () => {
    //   try {
    //     const DOB = await AsyncStorage.getItem('userDOB')
    //     const Gender = await AsyncStorage.getItem('userGender')
    //     if(Gender === "male" ) {
    //       this.setState({
    //         gender: 1,
    //         age:DOB
    //       })
    //       console.log(DOB)  
    //     }
    //     else{
    //       this.setState({
    //         gender: 0,
    //         age:DOB,
    //       })
    //     }
    //   } catch(e) {
    //     console.log(e)
    //   }
    // }

    // getDate =()=> { 
    //   var today = new Date()
    //   var x = today.toDateString().split(' ')
    //   return x[1]+' '+x[2]+', '+x[3]; 
    // } 

    render() {
        return (
            <View style={styles.container}>
              <View style={styles.contentContainer}>
                <View style={styles.headerTitle}>
                  <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                      Covid-19 Assessment
                  </Text>
                </View>
                <View style={styles.headerIcon}>
                    <Icon name="thermometer-outline" size={100} color="black" style={styles.headerIconStyle} />
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
                    }else{
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
                }else{
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
                }else{
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
                }else{
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
                }else{
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
                }else{
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
                }else{
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
                      <TouchableOpacity  activeOpacity = {.5} style={styles.nextButton}>
                            <Text style={styles.buttonTextStyle}>Next</Text>
                            <Icon name='chevron-forward-outline' size={22} color="#000000" style={styles.iconStyle} />
                      </TouchableOpacity>
                </View>
                
              </View>
              {/* <Text style={styles.Dateheader}>{this.getDate()}</Text>
              <View style={styles.checkboxContainer}>
                <Text style={styles.label}> </Text>
                <Text style={styles.labelsec}>No</Text>
                <Text style={styles.labelsec}>Yes</Text>
              </View>
              <View style={styles.checkboxContainer} backgroundColor="beige">
                    <Text style={styles.label}>Loss of smell and taste</Text>
                    <CheckBox
                    value= {this.state.lstno?true:false}
                    onValueChange={() =>this.setState({lstno:!this.state.lstno,
                      na:(!this.state.lstno&&this.state.pcno&&this.state.sfno&&this.state.lano&&this.state.sbno&&this.state.feverno&&this.state.diarrno)?true:false})}
                    style={styles.checkbox}
                    disabled={this.state.lst?true:false}
                    />
                    <CheckBox
                    style={styles.checkbox}
                    value={this.state.lst}
                    onValueChange={() =>this.setState({lst:!this.state.lst})}
                    style={styles.checkbox}
                    disabled={this.state.lstno?true:false}
                    />
             </View>
             <View style={styles.checkboxContainer} backgroundColor="#e1e1e5">
                    <Text style={styles.label}>Loss of appetite</Text>
                    <CheckBox
                    value= {this.state.lano?true:false}
                    onValueChange={() =>this.setState({lano:!this.state.lano,
                      na:(this.state.lstno&&this.state.pcno&&this.state.sfno&&!this.state.lano&&this.state.sbno&&this.state.feverno&&this.state.diarrno)?true:false})}
                    style={styles.checkbox}
                    disabled={this.state.la?true:false}
                    />
                    <CheckBox
                    style={styles.checkbox}
                    value={this.state.la}
                    onValueChange={() =>this.setState({la:!this.state.la})}
                    style={styles.checkbox}
                    disabled={this.state.lano?true:false}
                    />
             </View>
             <View style={styles.checkboxContainer} backgroundColor="beige">
                    <Text style={styles.label}>Persistent Cough</Text>
                    <CheckBox
                    value= {this.state.pcno?true:false}
                    onValueChange={() =>this.setState({pcno:!this.state.pcno,
                      na:(this.state.lstno&&!this.state.pcno&&this.state.sfno&&this.state.lano&&this.state.sbno&&this.state.feverno&&this.state.diarrno)?true:false})}
                    style={styles.checkbox}
                    disabled={this.state.pc?true:false}
                    />
                    <CheckBox
                    style={styles.checkbox}
                    value={this.state.pc}
                    onValueChange={() =>this.setState({pc:!this.state.pc})}
                    style={styles.checkbox}
                    disabled={this.state.pcno?true:false}
                    />
             </View>
             <View style={styles.checkboxContainer} backgroundColor="#e1e1e5">
                    <Text style={styles.label}>Severe Fatigue</Text>
                    <CheckBox
                    value= {this.state.sfno?true:false}
                    onValueChange={() =>this.setState({sfno:!this.state.sfno,
                      na:(this.state.lstno&&this.state.pcno&&!this.state.sfno&&this.state.lano&&this.state.sbno&&this.state.feverno&&this.state.diarrno)?true:false})}
                      style={styles.checkbox}
                    disabled={this.state.sf?true:false}
                    />
                    <CheckBox
                    style={styles.checkbox}
                    value={this.state.sf}
                    onValueChange={() =>this.setState({sf:!this.state.sf})}
                    style={styles.checkbox}
                    disabled={this.state.sfno?true:false}
                    />
             </View>
             <View style={styles.checkboxContainer} backgroundColor="beige">
                        <Text style={styles.label}>Shortness of Breath</Text>
                        <CheckBox
                        value= {this.state.sbno?true:false}
                        onValueChange={() =>this.setState({sbno:!this.state.sbno,
                          na:(this.state.lstno&&this.state.pcno&&this.state.sfno&&this.state.lano&&!this.state.sbno&&this.state.feverno&&this.state.diarrno)?true:false})}
                        style={styles.checkbox}
                        disabled={this.state.sb?true:false}
                        />
                        <CheckBox
                        style={styles.checkbox}
                        value={this.state.sb}
                        onValueChange={() =>this.setState({sb:!this.state.sb})}
                        style={styles.checkbox}
                        disabled={this.state.sbno?true:false}
                        />
                 </View> 
                 <View style={styles.checkboxContainer} backgroundColor="#e1e1e5">
                        <Text style={styles.label}>Fever</Text>
                        <CheckBox
                        value= {this.state.feverno?true:false}
                        onValueChange={() =>this.setState({feverno:!this.state.feverno,
                        na:(this.state.lstno&&this.state.pcno&&this.state.sfno&&this.state.lano&&this.state.sbno&&!this.state.feverno&&this.state.diarrno)?true:false})}
                        style={styles.checkbox}
                        disabled={this.state.fever?true:false}
                        />
                        <CheckBox
                        style={styles.checkbox}
                        value={this.state.fever}
                        onValueChange={() =>this.setState({fever:!this.state.fever})}
                        style={styles.checkbox}
                        disabled={this.state.feverno?true:false}
                        />
                 </View>
                 <View style={styles.checkboxContainer} backgroundColor="beige">
                        <Text style={styles.label}>Diarrhoea</Text>
                        <CheckBox
                        value= {this.state.diarrno?true:false}
                        onValueChange={() =>this.setState({diarrno:!this.state.diarrno,
                        na:(this.state.lstno&&this.state.pcno&&this.state.sfno&&this.state.lano&&this.state.sbno&&this.state.feverno&&!this.state.diarrno)?true:false})}
                        style={styles.checkbox}
                        disabled={this.state.diarr?true:false}
                        />
                        <CheckBox
                        style={styles.checkbox}
                        value={this.state.diarr}
                        onValueChange={() =>this.setState({diarr:!this.state.diarr})}
                        style={styles.checkbox}
                        disabled={this.state.diarrno?true:false}
                        />
                 </View>   
                  <View style={styles.checkboxContainer}
                  alignSelf={'flex-end'}
                  >
                    <Text style={styles.label}> </Text>
                    <Text style={styles.labelthird}>No to all</Text>
                    <CheckBox
                      value={this.state.na?true:false}
                      onValueChange= {() =>this.setState({na:!this.state.na,
                        lstno:!this.state.na?true:false,
                        lano:!this.state.na?true:false,
                        pcno:!this.state.na?true:false,
                        sfno:!this.state.na?true:false,
                        sbno:!this.state.na?true:false,
                        feverno:!this.state.na?true:false,
                        diarrno:!this.state.na?true:false,
                        lst:false,
                        la:false,
                        pc:false,
                        sf:false,
                        sb:false,
                        fever:false,
                        diarr:false,})}
                      style={styles.checkbox}
                    
                    />
                  </View>
                  <TouchableOpacity style={styles.button} activeOpacity = {.5}
                      onPress={() => this.props.navigation.navigate('Home', {
                        prob :(Math.exp(-1.32-(0.01*this.state.age)+(0.44*this.state.gender)+(1.75*(this.state.lst?1:0))
                        +(0.31*(this.state.pc?1:0))+(0.49*(this.state.sf?1:0))+(0.39*(this.state.la?1:0))))/(1+Math.exp(-1.32-(0.01*40)+(0.44*0)+(1.75*(this.state.lst?1:0))
                        +(0.31*(this.state.pc?1:0))+(0.49*(this.state.sf?1:0))+(0.39*(this.state.la?1:0)))) } 
                        )}>
                        <Text style={styles.btntext}>Submit</Text>
                  </TouchableOpacity> */}
                </View>
              );
    }
}

export default AssessmentScreen
  

const styles = EStyleSheet.create({
  // header:{
  //   fontSize:40,
  //   color:'#00B0B9',
  //   paddingBottom:30,
  //   alignSelf:"center",
  // },
  // Dateheader:{
  //   fontSize:30,
  //   color:'black',
  //   paddingBottom:30,
  //   alignSelf:"center",
  // },
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
    flex: 0.3,
    width: "100%",
    backgroundColor: '#ffcc80',
  },
  headerTitleText: {
    fontSize: '28rem', 
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
    fontSize: '16rem',
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
    //backgroundColor:'#ffcc80',
    borderColor:'black',
    borderBottomWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1
    
  },
  buttonTop:{
    flexDirection:'row',
    alignSelf:'stretch',
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    //backgroundColor:'#ffcc80',
    borderColor:'black',
    borderWidth:1,
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
    borderBottomWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50,
  },
  buttonTxt:{
    flex: 10, 
    marginLeft: '40rem',
    textAlign: 'center', 
    alignContent:'center', 
    alignSelf:'center',
    fontSize:'20rem',
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
    fontSize: '22rem', 
    color: '#000000'
  },
  iconStyle: {
    flex: 1.7, 
  }
  // checkboxContainer: {
  //   flexDirection: "row",
  //   alignItems:"flex-start",
  //   alignSelf:"stretch",
  //   justifyContent:"space-between",
    
  // },
  // checkbox: {
  //   alignSelf: "center",
  // },
  // label: {
  //   color:'#000000',
  //   width:200,
  //   borderBottomColor: "#000000",
  //   fontSize:20,
  //   margin: 8,
  // },
  // labelsec: {
  //   color:'#000000',
  //   fontSize:18,
  //   margin: 8,
  // },
  // labelthird: {
  //   color:'#000000',
  //   fontSize:20,
  //   margin: 8,
  // },
  // btntext:{
  //   color:'white',
  //   fontSize:18,
  // },
  // button: {
  //   alignSelf:'center',
  //   alignItems:'center',
  //   padding:20,
  //   backgroundColor:'#00B0B9',
  //   borderRadius:20,
  //   marginTop: 30,
  //   width:200,
  // },
});

