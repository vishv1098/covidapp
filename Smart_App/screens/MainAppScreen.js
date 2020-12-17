/**
 * @author Prem Kumar Bammidi
 */
import 'react-native-gesture-handler';
import React from 'react';  
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabScreen from './MainTabScreen';
import { DrawerContent } from './DrawerContent'
import RootStackScreen from './RootStackScreen'
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ProfileScreen from './ProfileScreen';
import * as tf from '@tensorflow/tfjs';

const Drawer = createDrawerNavigator();
const BACKEND_CONFIG = 'cpu';

class App extends React.Component {
  
  constructor(props) {
    super(props);
    global.isStart = null
    this.state = {
      isloading: true,
      isStarted: null
    }
    // console.log(this.state.isStarted)
  }

  async componentDidMount() {
    await tf.setBackend(BACKEND_CONFIG);
    await tf.ready();
    setTimeout(() => {
      this.setState({
        isloading: false,
      })
    }, 1000);
    this.check()
  }

  check = () => {
    this.setState({
      isStarted: isStart
    })
  }

  render() {
    if (this.state.isloading) {
      return (
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#00a8b5" animating/>
        </View>
      );
    }
    return (
      <NavigationContainer>
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
          <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
        </Drawer.Navigator>
        {/* { this.state.isStarted === "Start" ? (
          <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
          </Drawer.Navigator>
        )
      :       
        <RootStackScreen />
      } */}
      </NavigationContainer>
    );  
  }
}

export default App

