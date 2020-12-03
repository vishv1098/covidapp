import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import CheckBox from '@react-native-community/checkbox';

class AssessmentScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            lst : false,
            lstno : false,
            la : false,
            lano : false,
            pc : false,
            pcno : false,
            sf : false,
            sfno : false,
            sb:false,
            sbno:false,
            fever:false,
            feverno:false,
            diarr:false,
            diarrno:false,
            na : false,
            prob : 0,
        }
    }

    render() {
        return (
            <View style={styles.container}>
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
                      na:(!this.state.lstno&&this.state.pcno&&this.state.sfno&&this.state.lano)?true:false})}
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
                      na:(this.state.lstno&&this.state.pcno&&this.state.sfno&&!this.state.lano)?true:false})}
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
                      na:(this.state.lstno&&!this.state.pcno&&this.state.sfno&&this.state.lano)?true:false})}
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
                    na:(this.state.lstno&&this.state.pcno&&!this.state.sfno&&this.state.lano)?true:false})}
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
                        prob :(Math.exp(-1.32-(0.01*40)+(0.44*0)+(1.75*(this.state.lst?1:0))
                        +(0.31*(this.state.pc?1:0))+(0.49*(this.state.sf?1:0))+(0.39*(this.state.la?1:0))))/(1+Math.exp(-1.32-(0.01*40)+(0.44*0)+(1.75*(this.state.lst?1:0))
                        +(0.31*(this.state.pc?1:0))+(0.49*(this.state.sf?1:0))+(0.39*(this.state.la?1:0)))) } 
                        )}>
                        <Text style={styles.btntext}>Submit</Text>
                  </TouchableOpacity>
                </View>
              );
    }
}

export default AssessmentScreen

const styles = StyleSheet.create({
  header:{
    fontSize:40,
    color:'#000000',
    paddingTop:50,
    paddingBottom:50,
    alignSelf:"center",
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    alignSelf:"stretch"
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems:"flex-start",
    alignSelf:"stretch",
    justifyContent:"space-between",
    
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    color:'#000000',
    width:200,
    borderBottomColor: "#000000",
    fontSize:20,
    margin: 8,
  },
  labelsec: {
    color:'#000000',
    fontSize:18,
    margin: 8,
  },
  labelthird: {
    color:'#000000',
    fontSize:20,
    margin: 8,
  },
  btntext:{
    color:'white',
    fontSize:18,
  },
  button: {
    alignSelf:'center',
    alignItems:'center',
    padding:20,
    backgroundColor:'#00B0B9',
    borderRadius:20,
    marginTop: 30,
    width:200,
  },
});

