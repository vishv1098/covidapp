import React, { Component } from 'react';
import { Text, Dimensions, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from "react-native-push-notification";
import Home from './currentScreen/Home'
import Assessment from './currentScreen/AssessmentScreen'
import SettingsScreen from './currentScreen/SettingsScreen';
import OnboardingScreen from './currentScreen/OnboardingScreen'
import ProfileScreen from './currentScreen/ProfileScreen';
import TermsAndConditions from './currentScreen/TermsAndConditions';

const DEVICE_WIDTH = Dimensions.get('screen').width;
const LOGOTYPE_WIDTH = 80;
const TITLE_OFFSET_CENTER_ALIGN = DEVICE_WIDTH / 2 - LOGOTYPE_WIDTH / 2;

const Stack = createStackNavigator();

class App extends Component {

        constructor(props) {
                super(props);
                PushNotification.configure({
                        onRegister: function (token) {
                          console.log("TOKEN:", token);
                        },
                        onNotification: function (notification) {
                          console.log("NOTIFICATION:", notification);
                        },
                        permissions: {
                          alert: true,
                          badge: true,
                          sound: true,
                        },
                        popInitialNotification: true,
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
                // return (
                //         <>
                //                 <StatusBar style="dark" />
                //                 <NavigationContainer>
                //                         <Stack.Navigator>
                //                                 <Stack.Screen name="Onboarding" component={OnboardingScreen}
                //                                 options={({ navigation }) => ({
                //                                 headerShown: false  
                //                                 })}/>
                //                                 <Stack.Screen name="Terms" component={TermsAndConditions}
                //                                         options={({ navigation }) => ({
                //                                         headerShown: false  
                //                                         })}/>
                //                                 <Stack.Screen name="Home" component={Home} 
                //                                 options={({ navigation }) => ({
                //                                         title: 'Home',
                //                                         headerStyle: {
                //                                         backgroundColor: '#00B0B9',
                //                                         },
                //                                         headerLeft: null,
                //                                         headerTintColor: '#fff',
                //                                         headerTitleStyle: {
                //                                         fontWeight: 'bold',
                //                                         },
                //                                         headerTitleContainerStyle: {
                //                                         left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
                //                                         },
                //                                         headerRight: () => (
                //                                         <TouchableOpacity style={{paddingRight: 16}} onPress={ () => navigation.navigate('Profile') }>
                //                                                 <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Settings</Text>
                //                                         </TouchableOpacity>
                //                                         ),
                //                                         headerLeft: () => (
                //                                         <TouchableOpacity style={{paddingLeft: 16}} onPress={ () => navigation.navigate('ProfileEdit') }>
                //                                                 <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Profile</Text>
                //                                         </TouchableOpacity>
                //                                         ),
                //                                 })}/>
                //                                 <Stack.Screen name="Profile" component={SettingsScreen}
                //                                 options={({ navigation }) => ({
                //                                         title: 'Settings',
                //                                         headerStyle: {
                //                                         backgroundColor: '#00B0B9',
                //                                         },
                //                                         headerTintColor: '#fff',
                //                                         headerTitleStyle: {
                //                                         fontWeight: 'bold',
                //                                         },
                //                                         headerTitleContainerStyle: {
                //                                         left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
                //                                         },
                //                                 })}/>
                //                                 <Stack.Screen name="Self Assessment" component={Assessment}
                //                                 options={({ navigation }) => ({
                //                                         title: 'Self Assessment',
                //                                         headerStyle: {
                //                                         backgroundColor: '#00B0B9',
                //                                         },
                //                                         headerTintColor: '#fff',
                //                                         headerTitleStyle: {
                //                                         fontWeight: 'bold',
                //                                         },
                //                                         headerTitleContainerStyle: {
                //                                         left: TITLE_OFFSET_CENTER_ALIGN - 30, // THIS RIGHT HERE
                //                                         },
                //                                 })}/>
                //                                 <Stack.Screen name="ProfileEdit" component={ProfileScreen}
                //                                 options={({ navigation }) => ({
                //                                         title: 'Profile',
                //                                         headerStyle: {
                //                                         backgroundColor: '#00B0B9',
                //                                         },
                //                                         headerTintColor: '#fff',
                //                                         headerTitleStyle: {
                //                                         fontWeight: 'bold',
                //                                         },
                //                                         headerTitleContainerStyle: {
                //                                         left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
                //                                         },
                //                                 })}/>
                //                         </Stack.Navigator>
                //                 </NavigationContainer>
                //         </>
                // )

                if (this.state.isFirstLaunch === null) {
                        return null;
                } else if (this.state.isFirstLaunch === true) {
                        return (
                                <>
                                        <StatusBar style="dark" />
                                        <NavigationContainer>
                                                <Stack.Navigator>
                                                        <Stack.Screen name="Onboarding" component={OnboardingScreen}
                                                        options={({ navigation }) => ({
                                                        headerShown: false  
                                                        })}/>
                                                        <Stack.Screen name="Terms" component={TermsAndConditions}
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
                                                                headerLeft: () => (
                                                                <TouchableOpacity style={{paddingLeft: 16}} onPress={ () => navigation.navigate('ProfileEdit') }>
                                                                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Profile</Text>
                                                                </TouchableOpacity>
                                                                ),
                                                        })}/>
                                                        <Stack.Screen name="Profile" component={SettingsScreen}
                                                        options={({ navigation }) => ({
                                                                title: 'Settings',
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
                                                        <Stack.Screen name="ProfileEdit" component={ProfileScreen}
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
                                                </Stack.Navigator>
                                        </NavigationContainer>
                                </>
                        )
                } else {
                        return (
                                <>
                                        <StatusBar style="dark" />
                                        <NavigationContainer>
                                                <Stack.Navigator>
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
                                                                headerLeft: () => (
                                                                <TouchableOpacity style={{paddingLeft: 16}} onPress={ () => navigation.navigate('ProfileEdit') }>
                                                                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Profile</Text>
                                                                </TouchableOpacity>
                                                                ),
                                                        })}/>
                                                        <Stack.Screen name="Profile" component={SettingsScreen}
                                                        options={({ navigation }) => ({
                                                                title: 'Settings',
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
                                                        <Stack.Screen name="ProfileEdit" component={ProfileScreen}
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
                                                </Stack.Navigator>
                                        </NavigationContainer>
                                </>
                        )
                }
                
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

    