/**
 * @author Prem Kumar Bammidi
 */
import React from 'react';  
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';  
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';  
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';  
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceScreen from './DeviceScreen';

class HomeScreen extends React.Component {
  render() {  
    return (  
      <View style={styles.container}>  
        <Text>Home Screen</Text>  
      </View>  
    );  
  }
}

class ProfileScreen extends React.Component {  
  render() {  
    return (  
      <View style={styles.container}>
        <Text>Profile Screen</Text>  
      </View>  
    );  
  }
}

class CartScreen extends React.Component {  
  render() {  
    return (  
      <View style={styles.container}>  
        <Text>Assessment Screen</Text>  
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

const TabNavigator = createMaterialBottomTabNavigator(  
  {  
    Home: { screen: HomeScreen,  
      navigationOptions:{  
        tabBarLabel:'Home',  
        tabBarIcon: ({ tintColor }) => (  
          <View>  
            <Icon style={[{color: tintColor}]} size={25} name={'ios-home'}/>  
          </View>),  
      }  
    },  
    Profile: { screen: ProfileScreen,  
      navigationOptions:{  
        tabBarLabel:'Profile',  
        tabBarIcon: ({ tintColor }) => (  
          <View>  
            <Icon style={[{color: tintColor}]} size={25} name={'ios-person'}/>  
          </View>),
      }  
    },  
    Device: { screen: DeviceScreen,  
      navigationOptions:{  
        tabBarLabel:'Device',  
        tabBarIcon: ({ tintColor }) => (  
          <View>  
            <Icon style={[{color: tintColor}]} size={25} name={'watch-outline'}/>  
          </View>
        ),  
      }  
    },  
    Assessment: {  
      screen: CartScreen,
      navigationOptions:{  
        tabBarLabel:'Assessment',  
        tabBarIcon: ({ tintColor }) => (  
          <View>  
            <Icon style={[{color: tintColor}]} size={25} name={'newspaper-outline'}/>  
          </View>
        ),  
      }  
    },  
  },  
  {  
    initialRouteName: "Home",  
    activeColor: '#f0edf6',  
    inactiveColor: '#226557',  
    barStyle: { backgroundColor: '#00a8b5' },  
  },  
);

export default AppContainer = createAppContainer(TabNavigator);

