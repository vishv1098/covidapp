import React from 'react';  
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native'; 

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {  
    return (  
      <View style={styles.container}>  
        <Text>Home Screen</Text>
        <Text>This screen is under development</Text>
      </View>  
    );  
  }
}

const styles = StyleSheet.create({  
    container: {  
      flex: 1,  
      justifyContent: 'center',  
      alignItems: 'center'  
    },  
});

export default HomeScreen
