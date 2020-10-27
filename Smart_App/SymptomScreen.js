import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import CheckBox from '@react-native-community/checkbox';

class SymptomScreen extends Component {
    
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
            na : false,
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Symptoms</Text>
                <View style={styles.checkboxContainer}>
                    <Text style={styles.label}> </Text>
                    <Text style={styles.labelsec}>No</Text>
                    <Text style={styles.labelsec}>Yes</Text>
                </View>
                <View style={styles.checkboxContainer} backgroundColor="beige">
                    <Text style={styles.label}>Loss of smell and taste</Text>
                    <CheckBox
                    value= {this.state.lstno||this.state.na?true:false}
                    onValueChange={() =>this.setState({lstno:!this.state.lstno})}
                    style={styles.checkbox}
                    disabled={this.state.lst?true:false}
                    />
                    <CheckBox
                    style={styles.checkbox}
                    value={this.state.lst}
                    onValueChange={() =>this.setState({lst:!this.state.lst})}
                    style={styles.checkbox}
                    disabled={this.state.lstno||this.state.na?true:false}
                    />
                </View>
                <View style={styles.checkboxContainer} backgroundColor="#e1e1e5">
                    <Text style={styles.label}>Loss of appetite</Text>
                    <CheckBox
                    value= {this.state.lano||this.state.na?true:false}
                    onValueChange={() =>this.setState({lano:!this.state.lano})}
                    style={styles.checkbox}
                    disabled={this.state.la?true:false}
                    />
                    <CheckBox
                    style={styles.checkbox}
                    value={this.state.la}
                    onValueChange={() =>this.setState({la:!this.state.la})}
                    style={styles.checkbox}
                    disabled={this.state.lano||this.state.na?true:false}
                    />
                </View>
                <View style={styles.checkboxContainer} backgroundColor="beige">
                    <Text style={styles.label}>Persistent Cough</Text>
                    <CheckBox
                    value= {this.state.pcno||this.state.na?true:false}
                    onValueChange={() =>this.setState({pcno:!this.state.pcno})}
                    style={styles.checkbox}
                    disabled={this.state.pc?true:false}
                    />
                    <CheckBox
                    style={styles.checkbox}
                    value={this.state.pc}
                    onValueChange={() =>this.setState({pc:!this.state.pc})}
                    style={styles.checkbox}
                    disabled={this.state.pcno||this.state.na?true:false}
                    />
                </View>
                <View style={styles.checkboxContainer} backgroundColor="#e1e1e5">
                    <Text style={styles.label}>Severe Fatigue</Text>
                    <CheckBox
                    value= {this.state.sfno||this.state.na?true:false}
                    onValueChange={() =>this.setState({sfno:!this.state.sfno})}
                    style={styles.checkbox}
                    disabled={this.state.sf?true:false}
                    />
                    <CheckBox
                    style={styles.checkbox}
                    value={this.state.sf}
                    onValueChange={() =>this.setState({sf:!this.state.sf})}
                    style={styles.checkbox}
                    disabled={this.state.sfno||this.state.na?true:false}
                    />
                </View>
                <View style={styles.checkboxContainer}
                alignSelf={'flex-end'}
                >
                    <Text style={styles.label}> </Text>
                    <Text style={styles.labelthird}>No to all</Text>
                    <CheckBox
                        value={this.state.na}
                        onValueChange= {() =>this.setState({na:!this.state.na})}
                        style={styles.checkbox}
                    
                    />
                </View>
                <TouchableOpacity style={styles.button} activeOpacity = {.5}
                    onPress={() => this.props.navigation.navigate('Home', {
                    lst :   this.state.lst,
                    lstno : this.state.lstno,
                    la : this.state.la,
                    lano : this.state.lano,
                    pc : this.state.pc,
                    pcno : this.state.pcno,
                    sf : this.state.sf,
                    sfno : this.state.sfno,
                    na : this.state.na,} 
                    )}>
                    <Text style={styles.btntext}>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        fontSize:60,
        color:'#000000',
        paddingTop:50,
        paddingBottom:50,
        alignSelf:"center",
    },
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems:"center",
        justifyContent:"center",
        paddingLeft:50,
        paddingBottom:30,
    },
    checkbox: {
        alignSelf: "center",
        paddingRight: 80,
    },
    label: {
        color:'#000000',
        width:250,
        borderBottomColor: "#000000",
        fontSize:25,
        margin: 8,
    },
    labelsec: {
        paddingRight:40,
        color:'#000000',
        fontSize:25,
        margin: 8,
    },
    labelthird: {
        paddingRight:10,
        color:'#000000',
        fontSize:25,
        margin: 8,
    },
    btntext:{
        color:'white',
        fontSize:20,
    },
    button: {
        alignSelf:'center',
        alignItems:'center',
        padding:20,
        backgroundColor:'#1167b1',
        borderRadius:20,
        marginTop: 30,
        width:200,
    },
});

export default SymptomScreen
