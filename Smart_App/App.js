import React, { Component } from 'react';
import { View, Text, Button, Dimensions, Settings, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import SettingsScreen from './SettingsScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import OnboardingScreen from './OnboardingScreen'
import { StatusBar } from 'expo-status-bar';
import PushNotification from "react-native-push-notification";
import Home from './Home'
import Assessment from './AssessmentScreen'

const DEVICE_WIDTH = Dimensions.get('screen').width;
const LOGOTYPE_WIDTH = 80;
const TITLE_OFFSET_CENTER_ALIGN = DEVICE_WIDTH / 2 - LOGOTYPE_WIDTH / 2;


const Stack = createStackNavigator();

class App extends Component {

        constructor(props) {
                super(props);
                PushNotification.configure({
                        // (optional) Called when Token is generated (iOS and Android)
                        onRegister: function (token) {
                          console.log("TOKEN:", token);
                        },
                      
                        // (required) Called when a remote is received or opened, or local notification is opened
                        onNotification: function (notification) {
                          console.log("NOTIFICATION:", notification);
                      
                          // process the notification
                      
                          // (required) Called when a remote is received or opened, or local notification is opened
                        //   notification.finish(PushNotificationIOS.FetchResult.NoData);
                        },
                      
                        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
                        // onAction: function (notification) {
                        //   console.log("ACTION:", notification.action);
                        //   console.log("NOTIFICATION:", notification);
                      
                        //   // process the action
                        // },
                      
                        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
                        // onRegistrationError: function(err) {
                        //   console.error(err.message, err);
                        // },
                      
                        // IOS ONLY (optional): default: all - Permissions to register.
                        permissions: {
                          alert: true,
                          badge: true,
                          sound: true,
                        },
                      
                        // Should the initial notification be popped automatically
                        // default: true
                        popInitialNotification: true,
                      
                        /**
                         * (optional) default: true
                         * - Specified if permissions (ios) and token (android and ios) will requested or not,
                         * - if not, you must call PushNotificationsHandler.requestPermissions() later
                         * - if you are not using remote notification or do not have Firebase installed, use this:
                         *     requestPermissions: Platform.OS === 'ios'
                         */
                        requestPermissions: Platform.OS === 'ios',
                });
                this.state = {
                        isFirstLaunch: null
                }
                
        }

        async componentDidMount() {
                const value = await AsyncStorage.getItem('alreadyLaunched')
                if (value === null) {
                        await AsyncStorage.setItem('alreadyLaunched', 'true');
                        this.setState({
                                isFirstLaunch: true
                        })
                } else {
                        this.setState({
                                isFirstLaunch: false
                        })
                }
        }

        render() {
                return (
                        <>
                                <StatusBar style="dark" />
                                <NavigationContainer>
                                        <Stack.Navigator>
                                                <Stack.Screen name="Onboarding" component={OnboardingScreen}
                                                options={({ navigation }) => ({
                                                headerShown: false  
                                                })}/>
                                                <Stack.Screen name="Home" component={Home} 
                                                options={({ navigation }) => ({
                                                        title: 'Home',
                                                        headerStyle: {
                                                        backgroundColor: '#00B0B9',
                                                        },
                                                        headerLeft: null,
                                                        headerTintColor: '#fff',
                                                        headerTitleStyle: {
                                                        fontWeight: 'bold',
                                                        },
                                                        headerTitleContainerStyle: {
                                                        left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
                                                        },
                                                        headerRight: () => (
                                                        <TouchableOpacity style={{paddingRight: 16}} onPress={ () => navigation.navigate('Profile') }>
                                                                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Settings</Text>
                                                        </TouchableOpacity>
                                                        ),
                                                })}/>
                                                <Stack.Screen name="Profile" component={SettingsScreen}
                                                options={({ navigation }) => ({
                                                        title: 'Profile',
                                                        headerStyle: {
                                                        backgroundColor: '#00B0B9',
                                                        },
                                                        headerTintColor: '#fff',
                                                        headerTitleStyle: {
                                                        fontWeight: 'bold',
                                                        },
                                                        headerTitleContainerStyle: {
                                                        left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
                                                        },
                                                })}/>
                                                <Stack.Screen name="Self Assessment" component={Assessment}
                                                options={({ navigation }) => ({
                                                        title: 'Self Assessment',
                                                        headerStyle: {
                                                        backgroundColor: '#00B0B9',
                                                        },
                                                        headerTintColor: '#fff',
                                                        headerTitleStyle: {
                                                        fontWeight: 'bold',
                                                        },
                                                        headerTitleContainerStyle: {
                                                        left: TITLE_OFFSET_CENTER_ALIGN - 30, // THIS RIGHT HERE
                                                        },
                                                })}/>
                                        </Stack.Navigator>
                                </NavigationContainer>
                        </>
                )
                // if (this.state.isFirstLaunch === null) {
                //         return null;
                // } else if (this.state.isFirstLaunch === true) {
                //         return (
                //                 <>
                //                         <StatusBar style="dark" />
                //                         <NavigationContainer>
                //                                 <Stack.Navigator>
                //                                         <Stack.Screen name="Onboarding" component={OnboardingScreen}
                //                                         options={({ navigation }) => ({
                //                                         headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="Home" component={Home} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'Home',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#00B0B9',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#fff',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 },
                //                                                 headerTitleContainerStyle: {
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
                //                                                 },
                //                                                 headerRight: () => (
                //                                                 <TouchableOpacity style={{paddingRight: 16}} onPress={ () => navigation.navigate('Profile') }>
                //                                                         <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Settings</Text>
                //                                                 </TouchableOpacity>
                //                                                 ),
                //                                         })}/>
                //                                         <Stack.Screen name="Profile" component={SettingsScreen}
                //                                         options={({ navigation }) => ({
                //                                                 title: 'Profile',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#00B0B9',
                //                                                 },
                //                                                 headerTintColor: '#fff',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 },
                //                                                 headerTitleContainerStyle: {
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="Self Assessment" component={Assessment}
                //                                         options={({ navigation }) => ({
                //                                                 title: 'Self Assessment',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#00B0B9',
                //                                                 },
                //                                                 headerTintColor: '#fff',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 },
                //                                                 headerTitleContainerStyle: {
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN - 25, // THIS RIGHT HERE
                //                                                 },
                //                                         })}/>
                //                                 </Stack.Navigator>
                //                         </NavigationContainer>
                //                 </>
                //         )
                // } else {
                //         return (
                //                 <>
                //                         <StatusBar style="dark" />
                //                         <NavigationContainer>
                //                                 <Stack.Navigator>
                //                                         <Stack.Screen name="Home" component={Home} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'Home',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#00B0B9',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#fff',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 },
                //                                                 headerTitleContainerStyle: {
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
                //                                                 },
                //                                                 headerRight: () => (
                //                                                 <TouchableOpacity style={{paddingRight: 16}} onPress={ () => navigation.navigate('Profile') }>
                //                                                         <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Settings</Text>
                //                                                 </TouchableOpacity>
                //                                                 ),
                //                                         })}/>
                //                                         <Stack.Screen name="Profile" component={SettingsScreen}
                //                                         options={({ navigation }) => ({
                //                                                 title: 'Profile',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#00B0B9',
                //                                                 },
                //                                                 headerTintColor: '#fff',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 },
                //                                                 headerTitleContainerStyle: {
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="Self Assessment" component={Assessment}
                //                                         options={({ navigation }) => ({
                //                                                 title: 'Self Assessment',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#00B0B9',
                //                                                 },
                //                                                 headerTintColor: '#fff',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 },
                //                                                 headerTitleContainerStyle: {
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN - 25, // THIS RIGHT HERE
                //                                                 },
                //                                         })}/>
                //                                 </Stack.Navigator>
                //                         </NavigationContainer>
                //                 </>
                //         )
                // }
                
        }
}

export default App

const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }
})

    