import React, { Component } from 'react';
import { Dimensions, StyleSheet, Platform, PixelRatio } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from "react-native-push-notification";
import Home from './screens/Home'
import Assessment from './screens/AssessmentScreen'
import ProfileScreen from './screens/ProfileScreen';
import TermsAndConditions from './onBoardingScreens/TermsAndConditions';
import LaunchScreen from './onBoardingScreens/LaunchScreen'
import BmiScreen from './onBoardingScreens/BmiScreen'
import AgeScreen from './onBoardingScreens/AgeScreen';
import RaceScreen from './onBoardingScreens/RaceScreen'
import VitalsScreen from './screens/VitalsScreen'
import CovidScreen from './screens/CovidScreen'
import InfluScreen from './screens/InfluScreen'
import SafeScreen from './screens/SafeScreen';
import EditProfile from './screens/EditProfile';

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
                                                })}/>
                                                <Stack.Screen name="profile" component={ProfileScreen} 
                                                options={({ navigation }) => ({
                                                        title: 'COVID-19 Guardian Angel',
                                                        headerStyle: {
                                                        backgroundColor: '#158158',
                                                        },
                                                        headerTintColor: '#000000',
                                                        headerTitleStyle: {
                                                        fontWeight: 'bold',
                                                        alignContent: 'center',
                                                        alignItems: 'center',
                                                        alignSelf: 'center',
                                                        fontSize: normalize(25)
                                                        },
                                                        headerTitleContainerStyle:{
                                                        left: TITLE_OFFSET_CENTER_ALIGN - 150,
                                                        },
                                                })}/>
                                                <Stack.Screen name="edit" component={EditProfile} 
                                                options={({ navigation }) => ({
                                                        title: 'COVID-19 Guardian Angel',
                                                        headerStyle: {
                                                        backgroundColor: '#158158',
                                                        },
                                                        headerTintColor: '#000000',
                                                        headerTitleStyle: {
                                                        fontWeight: 'bold',
                                                        alignContent: 'center',
                                                        alignItems: 'center',
                                                        alignSelf: 'center',
                                                        fontSize: normalize(25)
                                                        },
                                                        headerTitleContainerStyle:{
                                                        left: TITLE_OFFSET_CENTER_ALIGN - 150,
                                                        },
                                                })}/>
                                                <Stack.Screen name="Self Assessment" component={Assessment}
                                                options={({ navigation }) => ({
                                                        headerShown: false
                                                })}/>
                                                <Stack.Screen name="vitals" component={VitalsScreen}
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
                //                                                 headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="Terms" component={TermsAndConditions}
                //                                         options={({ navigation }) => ({
                //                                                 headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="bmi" component={BmiScreen}
                //                                         options={({ navigation }) => ({
                //                                                 headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="age" component={AgeScreen}
                //                                         options={({ navigation }) => ({
                //                                                 headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="race" component={RaceScreen}
                //                                         options={({ navigation }) => ({
                //                                                 headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="Home" component={Home} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="profile" component={ProfileScreen} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                                 headerTitleContainerStyle:{
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN - 150,
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="edit" component={EditProfile} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                                 headerTitleContainerStyle:{
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN - 150,
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="Self Assessment" component={Assessment}
                //                                         options={({ navigation }) => ({
                //                                                 headerShown: false
                //                                         })}/>
                //                                         <Stack.Screen name="vitals" component={VitalsScreen}
                //                                         options={({ navigation }) => ({
                //                                                 headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="covid" component={CovidScreen} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="influ" component={InfluScreen} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="safe" component={SafeScreen} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
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
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="profile" component={ProfileScreen} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                                 headerTitleContainerStyle:{
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN - 150,
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="edit" component={EditProfile} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                                 headerTitleContainerStyle:{
                //                                                 left: TITLE_OFFSET_CENTER_ALIGN - 150,
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="Self Assessment" component={Assessment}
                //                                         options={({ navigation }) => ({
                //                                                 headerShown: false
                //                                         })}/>
                //                                         <Stack.Screen name="vitals" component={VitalsScreen}
                //                                         options={({ navigation }) => ({
                //                                                 headerShown: false  
                //                                         })}/>
                //                                         <Stack.Screen name="covid" component={CovidScreen} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="influ" component={InfluScreen} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
                //                                                 },
                //                                         })}/>
                //                                         <Stack.Screen name="safe" component={SafeScreen} 
                //                                         options={({ navigation }) => ({
                //                                                 title: 'COVID-19 Guardian Angel',
                //                                                 headerStyle: {
                //                                                 backgroundColor: '#158158',
                //                                                 },
                //                                                 headerLeft: null,
                //                                                 headerTintColor: '#000000',
                //                                                 headerTitleStyle: {
                //                                                 fontWeight: 'bold',
                //                                                 alignContent: 'center',
                //                                                 alignItems: 'center',
                //                                                 alignSelf: 'center',
                //                                                 fontSize: normalize(25)
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

    