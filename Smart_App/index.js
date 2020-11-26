/**
 * @format
 */
import 'react-native-gesture-handler'
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// console.disableYellowBox = true;
LogBox.ignoreAllLogs()

AppRegistry.registerComponent(appName, () => App);
