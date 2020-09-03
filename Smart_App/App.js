/**
 * @author Prem Kumar Bammidi
 */
import 'react-native-gesture-handler';
import React from 'react';  
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabScreen from './screens/MainTabScreen';
import { DrawerContent } from './screens/DrawerContent'

const Drawer = createDrawerNavigator();

class App extends React.Component {
  render() {  
    return (  
      <NavigationContainer>
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
          {/* <Drawer.Screen name="Notifications" component={NotificationStackScreen} /> */}
        </Drawer.Navigator>
      </NavigationContainer>
    );  
  }
}

export default App

