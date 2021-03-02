import React, { Component } from 'react';
import { View, FlatList,Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';

class History extends Component{
    constructor(props){
        super(props);
        this.getData();
        this.state = {
            history:[],
        }
      
    }
    getData = async()=>{
        var hist = await AsyncStorage.getItem('history')
        if(hist !== null){
            this.setState({
                history: JSON.parse(hist).reverse(), 
            })
        }
        console.log(JSON.stringify(this.state.history));
    }
    setColor(text){
        if(text.toString() === 'Healthy'){
            return '#a5d6a7';
        } else if(text.toString() === 'Unwell'){
            return '#ffcc80';
        }
        return '#ef9a9a';
        
    }
    render(){
        return(
            <View style = {styles.container}>
                <View style = {styles.contentContainer}>
                    <Text adjustsFontSizeToFit style={styles.headerTitleText}>
                        Assessment History
                    </Text>
                    <FlatList
                        data={this.state.history}
                        renderItem={
                            ({item})=>(
                            <View style={[styles.resultContent,{backgroundColor:this.setColor(item.result)}]}>
                                <Text style={styles.headerContentText}>{item.date}</Text>
                                <Text style={styles.headerContentResultText}>{item.result}</Text>
                            </View>
                        )}
                   />
                </View>
            </View>
            
        )
    }
}
export default History;
const styles = EStyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      alignSelf:'center',
      justifyContent:'flex-start',
      flex:1,
      padding: 10,
    },
    contentContainer: {
      width: "100%",
      
      aspectRatio: 0.55,
      flexDirection: "column",
      alignSelf:"center",
    },
    headerTitleText: {
        fontSize: '27rem', 
        fontWeight: 'bold', 
        color: '#000000', 
        textAlign: 'center',  
        marginLeft: '10rem', 
        marginRight: '10rem',
        marginVertical: 8,
        
    },
    headerContentText: {
        flex:1,
        fontSize: '20rem', 
        color: '#000000',
        marginLeft:30,
    },
    headerContentResultText: {
        flex:1,
        marginRight:30,
        textAlign:'right',
        fontSize: '20rem', 
        color: '#000000',
    },
    resultContent: {
        flex: 1,
        width:'100%',
        flexDirection: 'row',
        backgroundColor: 'white',
        marginVertical: 5,
        borderRadius: 15,
        padding: 20,
    }
})