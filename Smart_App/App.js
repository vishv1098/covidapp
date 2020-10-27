import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainHomeScreen from './MainHomeScreen';
import SymptomScreen from './SymptomScreen';

const RootStack = createStackNavigator({
        Home: {
                screen: MainHomeScreen,
                navigationOptions: {
                        headerShown: false,
                }
        },
        Symptom: {
                screen: SymptomScreen,
                navigationOptions: {
                        headerShown: false
                }
        }
});

const AppContainer = createAppContainer(RootStack);

class App extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <AppContainer />
        )
    }
}

export default App
