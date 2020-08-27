/**
 * @author Prem Kumar Bammidi
 */
import 'react-native-gesture-handler';
import React from 'react';  
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';  
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen'
import NotificationScreen from './screens/NotificationScreen';
import ProfileScreen from './screens/ProfileScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import MainTabScreen from './screens/MainTabScreen';

const Drawer = createDrawerNavigator();

// const TabNavigator = createMaterialBottomTabNavigator(  
//   {  
//     Home: { screen: HomeScreen,  
//       navigationOptions:{  
//         tabBarLabel:'Home',  
//         tabBarIcon: ({ tintColor }) => (  
//           <View>  
//             <Icon style={[{color: tintColor}]} size={25} name={'ios-home'}/>  
//           </View>),  
//       }  
//     },  
//     Profile: { screen: ProfileScreen,  
//       navigationOptions:{  
//         tabBarLabel:'Profile',  
//         tabBarIcon: ({ tintColor }) => (  
//           <View>  
//             <Icon style={[{color: tintColor}]} size={25} name={'ios-person'}/>  
//           </View>),
//       }  
//     },  
//     Device: { screen: NotificationScreen,  
//       navigationOptions:{  
//         tabBarLabel:'Notification',  
//         tabBarIcon: ({ tintColor }) => (  
//           <View>  
//             <Icon style={[{color: tintColor}]} size={25} name={'watch-outline'}/>  
//           </View>
//         ),  
//       }  
//     },  
//     Assessment: {  
//       screen: AssessmentScreen,
//       navigationOptions:{  
//         tabBarLabel:'Assessment',  
//         tabBarIcon: ({ tintColor }) => (  
//           <View>  
//             <Icon style={[{color: tintColor}]} size={25} name={'newspaper-outline'}/>  
//           </View>
//         ),  
//       }  
//     },  
//   },  
//   {  
//     initialRouteName: "Home",  
//     activeColor: '#f0edf6',  
//     inactiveColor: '#226557',  
//     barStyle: { backgroundColor: '#00a8b5' },  
//   },  
// );

// const AppContainer = createAppContainer(TabNavigator);

class App extends React.Component {
  render() {  
    return (  
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={MainTabScreen} />
          {/* <Drawer.Screen name="Notifications" component={NotificationStackScreen} /> */}
        </Drawer.Navigator>
      </NavigationContainer>
    );  
  }
}

export default App

