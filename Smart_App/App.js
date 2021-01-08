import React, { Component } from 'react';
import { Text, Dimensions, StyleSheet, Platform, PixelRatio } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from "react-native-push-notification";
import Home from './screens/Home'
import Assessment from './screens/AssessmentScreen'
import SettingsScreen from './currentScreen/SettingsScreen';
import ProfileScreen from './currentScreen/ProfileScreen';
import TermsAndConditions from './onBoardingScreens/TermsAndConditions';
import LaunchScreen from './onBoardingScreens/LaunchScreen'
import BmiScreen from './onBoardingScreens/BmiScreen'
import AgeScreen from './onBoardingScreens/AgeScreen';
import RaceScreen from './onBoardingScreens/RaceScreen'
import VitalsScreen from './screens/VitalsScreen'
import CovidScreen from './screens/CovidScreen'
import InfluScreen from './screens/InfluScreen'
import SafeScreen from './screens/SafeScreen';

const DEVICE_WIDTH = Dimensions.get('screen').width;
const LOGOTYPE_WIDTH = 80;
const TITLE_OFFSET_CENTER_ALIGN = DEVICE_WIDTH / 2 - LOGOTYPE_WIDTH / 2;

const {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 380;

export function normalize(size) {
        const newSize = size * scale 
        if (Platform.OS === 'ios') {
          return Math.round(PixelRatio.roundToNearestPixel(newSize))
        } else {
          return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
        }
}

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
                return (
                        <>
                                <StatusBar style="dark" />
                                <NavigationContainer>
                                        <Stack.Navigator>
                                                <Stack.Screen name="Launch" component={LaunchScreen}
                                                options={({ navigation }) => ({
                                                headerShown: false  
                                                })}/>
                                                <Stack.Screen name="Terms" component={TermsAndConditions}
                                                options={({ navigation }) => ({
                                                headerShown: false  
                                                })}/>
                                                <Stack.Screen name="bmi" component={BmiScreen}
                                                options={({ navigation }) => ({
                                                headerShown: false  
                                                })}/>
                                                <Stack.Screen name="age" component={AgeScreen}
                                                options={({ navigation }) => ({
                                                headerShown: false  
                                                })}/>
                                                <Stack.Screen name="race" component={RaceScreen}
                                                options={({ navigation }) => ({
                                                headerShown: false  
                                                })}/>
                                                <Stack.Screen name="covid" component={CovidScreen} 
                                                options={({ navigation }) => ({
                                                        title: 'COVID-19 Guardian Angel',
                                                        headerStyle: {
                                                        backgroundColor: '#158158',
                                                        },
                                                        headerLeft: null,
                                                        headerTintColor: '#000000',
                                                        headerTitleStyle: {
                                                        fontWeight: 'bold',
                                                        alignContent: 'center',
                                                        alignItems: 'center',
                                                        alignSelf: 'center',
                                                        fontSize: normalize(25)
                                                        },
                                                })}/>
                                                <Stack.Screen name="influ" component={InfluScreen} 
                                                options={({ navigation }) => ({
                                                        title: 'COVID-19 Guardian Angel',
                                                        headerStyle: {
                                                        backgroundColor: '#158158',
                                                        },
                                                        headerLeft: null,
                                                        headerTintColor: '#000000',
                                                        headerTitleStyle: {
                                                        fontWeight: 'bold',
                                                        alignContent: 'center',
                                                        alignItems: 'center',
                                                        alignSelf: 'center',
                                                        fontSize: normalize(25)
                                                        },
                                                })}/>
                                                <Stack.Screen name="safe" component={SafeScreen} 
                                                options={({ navigation }) => ({
                                                        title: 'COVID-19 Guardian Angel',
                                                        headerStyle: {
                                                        backgroundColor: '#158158',
                                                        },
                                                        headerLeft: null,
                                                        headerTintColor: '#000000',
                                                        headerTitleStyle: {
                                                        fontWeight: 'bold',
                                                        alignContent: 'center',
                                                        alignItems: 'center',
                                                        alignSelf: 'center',
                                                        fontSize: normalize(25)
                                                        },
                                                })}/>
                                                <Stack.Screen name="Home" component={Home} 
                                                options={({ navigation }) => ({
                                                        title: 'COVID-19 Guardian Angel',
                                                        headerStyle: {
                                                        backgroundColor: '#158158',
                                                        },
                                                        headerLeft: null,
                                                        headerTintColor: '#000000',
                                                        headerTitleStyle: {
                                                        fontWeight: 'bold',
                                                        alignContent: 'center',
                                                        alignItems: 'center',
                                                        alignSelf: 'center',
                                                        fontSize: normalize(25)
                                                        },
                                                        // headerTitleContainerStyle: {
                                                        // left: TITLE_OFFSET_CENTER_ALIGN- 60, // THIS RIGHT HERE
                                                        // alignContent:'center'
                                                        // },
                                                        // headerRight: () => (
                                                        // <TouchableOpacity style={{paddingRight: 16}} onPress={ () => navigation.navigate('Profile') }>
                                                        //         <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Settings</Text>
                                                        // </TouchableOpacity>
                                                        // ),
                                                        // headerLeft: () => (
                                                        // <TouchableOpacity style={{paddingLeft: 16}} onPress={ () => navigation.navigate('ProfileEdit') }>
                                                        //         <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Profile</Text>
                                                        // </TouchableOpacity>
                                                        // ),
                                                })}/>
                                                <Stack.Screen name="vitals" component={VitalsScreen}
                                                options={({ navigation }) => ({
                                                headerShown: false  
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
                                                        headerShown: false  
                                                        // title: 'Self Assessment',
                                                        // headerStyle: {
                                                        // backgroundColor: '#00B0B9',
                                                        // },
                                                        // headerTintColor: '#fff',
                                                        // headerTitleStyle: {
                                                        // fontWeight: 'bold',
                                                        // },
                                                        // headerTitleContainerStyle: {
                                                        // left: TITLE_OFFSET_CENTER_ALIGN - 30, // THIS RIGHT HERE
                                                        // },
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

                // if (this.state.isFirstLaunch === null) {
                //         return null;
                // } else if (this.state.isFirstLaunch === true) {
                //         return (
                //                 <>
                //                         <StatusBar style="dark" />
                //                         <NavigationContainer>
                //                                 <Stack.Navigator>
                //                                         <Stack.Screen name="Launch" component={LaunchScreen}
                //                                         options={({ navigation }) => ({
                //                                         headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="Terms" component={TermsAndConditions}
                //                                         options={({ navigation }) => ({
                //                                         headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="bmi" component={BmiScreen}
                //                                         options={({ navigation }) => ({
                //                                         headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="age" component={AgeScreen}
                //                                         options={({ navigation }) => ({
                //                                         headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="race" component={RaceScreen}
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
                //                                                 headerLeft: () => (
                //                                                 <TouchableOpacity style={{paddingLeft: 16}} onPress={ () => navigation.navigate('ProfileEdit') }>
                //                                                         <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Profile</Text>
                //                                                 </TouchableOpacity>
                //                                                 ),
                //                                         })}/>
                //                                         <Stack.Screen name="Profile" component={SettingsScreen}
                //                                         options={({ navigation }) => ({
                //                                                 title: 'Settings',
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
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN - 30, // THIS RIGHT HERE
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="ProfileEdit" component={ProfileScreen}
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
                //                                 <Stack.Screen name="Home" component={Home} 
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
                //                                                 headerLeft: () => (
                //                                                 <TouchableOpacity style={{paddingLeft: 16}} onPress={ () => navigation.navigate('ProfileEdit') }>
                //                                                         <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Profile</Text>
                //                                                 </TouchableOpacity>
                //                                                 ),
                //                                         })}/>
                //                                         <Stack.Screen name="Profile" component={SettingsScreen}
                //                                         options={({ navigation }) => ({
                //                                                 title: 'Settings',
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
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN - 30, // THIS RIGHT HERE
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="ProfileEdit" component={ProfileScreen}
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

    