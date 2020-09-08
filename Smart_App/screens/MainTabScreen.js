import React from 'react';
import { Dimensions } from 'react-native'
import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen'
import NotificationScreen from './NotificationScreen';
import ProfileScreen from './ProfileScreen';
import AssessmentScreen from './AssessmentScreen';
import DeviceScreen from './DeviceScreen'

const HomeStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const AssessmentStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const DEVICE_WIDTH = Dimensions.get('screen').width;
const LOGOTYPE_WIDTH = 80;
const TITLE_OFFSET_CENTER_ALIGN = DEVICE_WIDTH / 2 - LOGOTYPE_WIDTH / 2;

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      style={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#00a8b5',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationStackScreen}
        options={{
          tabBarLabel: 'Updates',
          tabBarColor: '#00a8b5',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-notifications" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Device',
          tabBarColor: '#00a8b5',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Assessment"
        component={AssessmentStackScreen}
        options={{
          tabBarLabel: 'Assessment',
          tabBarColor: '#00a8b5',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-aperture" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
)

const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 50,
      mass: 3,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
} 

const HomeStackScreen = ({navigation}) => (
    <HomeStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#00a8b5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold',
        // alignSelf: 'center',
        },
        headerTitleContainerStyle: {
        left: TITLE_OFFSET_CENTER_ALIGN + 15, // THIS RIGHT HERE
        },
        gestureEnabled: true,
        gestureDirection: "horizontal",
        // transitionSpec: {
        //   open: config,
        //   close: config
        // }
        cardStyleInterpolator:
        CardStyleInterpolators.forHorizontalIOS
    }}
    headerMode="float"
    animation="fade">
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
        headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#00a8b5"
        onPress={() => navigation.openDrawer()} />
        )
        }}/>
    </HomeStack.Navigator>
)
  
const NotificationStackScreen = ({navigation}) => (
    <NotificationStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#00a8b5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold',
        // alignSelf: 'center'
        },
        headerTitleContainerStyle: {
        left: TITLE_OFFSET_CENTER_ALIGN - 15, // THIS RIGHT HERE
        },
        gestureEnabled: true,
        gestureDirection: "horizontal",
        // transitionSpec: {
        //   open: config,
        //   close: config
        // }
        cardStyleInterpolator:
        CardStyleInterpolators.forHorizontalIOS
    }}
    headerMode="float"
    animation="fade">
        <NotificationStack.Screen name="Notifications" component={NotificationScreen} options={{
        headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#00a8b5"
        onPress={() => navigation.toggleDrawer()} />
        )
        }} 
        />
    </NotificationStack.Navigator>
)

const ProfileStackScreen = ({navigation}) => (
    <ProfileStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#00a8b5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold',
        // alignSelf: 'center'
        },
        headerTitleContainerStyle: {
        left: TITLE_OFFSET_CENTER_ALIGN + 13, // THIS RIGHT HERE
        },
        gestureEnabled: true,
        gestureDirection: "horizontal",
        // transitionSpec: {
        //   open: config,
        //   close: config
        // }
        cardStyleInterpolator:
        CardStyleInterpolators.forHorizontalIOS
    }}
    headerMode="float"
    animation="fade">
        <ProfileStack.Screen name="Device" component={DeviceScreen} options={{
        headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#00a8b5"
        onPress={() => navigation.toggleDrawer()} />
        )
        }} 
        />
    </ProfileStack.Navigator>
)

const AssessmentStackScreen = ({navigation}) => (
    <AssessmentStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#00a8b5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold',
        // alignSelf: 'center'
        },
        headerTitleContainerStyle: {
        left: TITLE_OFFSET_CENTER_ALIGN - 15, // THIS RIGHT HERE
        },
        gestureEnabled: true,
        gestureDirection: "horizontal",
        // transitionSpec: {
        //   open: config,
        //   close: config
        // }
        cardStyleInterpolator:
        CardStyleInterpolators.forHorizontalIOS
    }}
    headerMode="float"
    animation="fade">
        <AssessmentStack.Screen name="Assessment" component={AssessmentScreen} options={{
        headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#00a8b5"
        onPress={() => navigation.toggleDrawer()} />
        )
        }} 
        />
    </AssessmentStack.Navigator>
)

export default MainTabScreen
