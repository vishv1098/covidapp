import React from 'react';  
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native'; 

class ProfileScreen extends React.Component {
    render() {  
      return (  
        <View style={styles.container}>  
          <Text>Profile Screen</Text>  
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

export default ProfileScreen
