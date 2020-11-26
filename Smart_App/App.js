import React, { Component } from 'react';
import { View, Text, Button, Dimensions, Settings } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import SettingsScreen from './SettingsScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DEVICE_WIDTH = Dimensions.get('screen').width;
const LOGOTYPE_WIDTH = 80;
const TITLE_OFFSET_CENTER_ALIGN = DEVICE_WIDTH / 2 - LOGOTYPE_WIDTH / 2;

const Home = () => {
        return (
                <View style={{flex:1, alignItems:'center', justifyContent: 'center' }}>
                        <Text>Home Screen</Text>
                </View>
        )
}

// const Profile = () => {
//         return (
//                 <View style={{flex:1, alignItems:'center', justifyContent: 'center' }}>
//                         <Text>Profile Screen</Text>
//                 </View>
//         )
// }

const Stack = createStackNavigator();

class App extends Component {
        constructor(props) {
                super(props);
        }

        render() {
                return (
                        <NavigationContainer>
                                <Stack.Navigator>
                                        <Stack.Screen name="Home" component={Home} 
                                        options={({ navigation }) => ({
                                                title: 'Home',
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
                                                // headerRight: () => (
                                                // <View>
                                                //         <Text style={{fontWeight: 'bold', fontSize: 16, paddingRight: 16, color: '#fff'}} onPress={ () => navigation.navigate('Profile') }>Settings</Text>
                                                // </View>
                                                // ),
                                        })}/>
                                </Stack.Navigator>
                        </NavigationContainer>
                )
        }
}

export default App