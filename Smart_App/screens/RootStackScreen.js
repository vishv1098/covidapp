import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from './SplashScreen'
import ProfileScreen from './ProfileScreen'

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
        <RootStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </RootStack.Navigator>
)

export default RootStackScreen;

