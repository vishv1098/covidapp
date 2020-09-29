import React from 'react';  
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from '@react-native-community/async-storage';

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

class NotificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.getTestData();
    this.state = {
      test1: '',
      test2: ''
    }
  }

  componentDidMount() {
    //
  }

  getTestData = async () => {
    try {
      const testcheck = await AsyncStorage.getItem('test_red1')
      const testcheck2 = await AsyncStorage.getItem('test_red2')
      if(testcheck !== null && testcheck2!== null ) {
        // value previously stored
        this.setState({
          test1: testcheck,
          test2: testcheck2
        })
      }
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }

  render() {  
    return (  
      <View style={styles.container}>
        <Text>Notification Screen</Text>
        <Text>This screen is under development</Text>
        <View style={{paddingLeft: 25, paddingRight: 25, paddingTop: 50}}>
          <Text>{ this.state.test1 }</Text>
          <Text>{ this.state.test2 }</Text>
        </View>
        {/* <View>
          <Text>Heart rate Chart</Text>
          <LineChart
            data={{
              labels: ["1", "", "3", "", "5", "", "7", "", "9", "", "11", "", "13", "", "15", "", "17", ""],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                  ]
                }
              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View> */}
      </View>  
    );  
  }
}

const styles = StyleSheet.create({  
    container: {  
      flex: 1,  
      justifyContent: 'center',  
      alignItems: 'center'  
    },  
});

export default NotificationScreen

