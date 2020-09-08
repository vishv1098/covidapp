import React from 'react';  
import { StyleSheet, Text, Image, View, StatusBar, TouchableOpacity, Button, Dimensions } from 'react-native'; 
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class SplashScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {  
    return (  
      <View style={styles.container}>
        <StatusBar backgroundColor='#00a8b5' barStyle="light-content"/>
        <View style={styles.header}>
          <Animatable.Image 
              animation="bounceIn"
              duraton="1500"
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="stretch"
          />
        </View>
        <Animatable.View 
          style={styles.footer}
          animation="fadeInUpBig"
        >
          <Text style={styles.title}>Stay Home Stay Healthy!</Text>
          <View style={styles.button}>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('ProfileScreen')}>
              <LinearGradient
                  colors={['#08d4c4', '#01ab9d']}
                  style={styles.signIn}
              >
                  <Text style={styles.textSign}>Get Started</Text>
                  <MaterialIcons 
                      name="navigate-next"
                      color="#fff"
                      size={20}
                  />
              </LinearGradient>
          </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>  
    );  
  }
}

const {height} = Dimensions.get("screen");
const height_logo = height * 0.24;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#00a8b5'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo + 60,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});

export default SplashScreen
