import React from 'react';  
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const modelJson = require('../components/model.json');
const modelWeights = require('../components/group1-shard1of1.bin');

const BACKEND_CONFIG = 'cpu';

class AssessmentScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      isModelReady: false,
      useModel: {}
    }
  }

  async componentDidMount() {

    await tf.setBackend(BACKEND_CONFIG);
    await tf.ready();
    console.log("componentDidMount: tf.ready is set");
    console.log("the MyModelLoadLocal component is mounted");
  }

  getPrediction = async () => {
    console.log("model loading button is pressed...");   
    const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
    this.setState({
        useModel: model,
        isModelReady: true
    });
  }

  render() {  
    return (  
      <View style={styles.container}>  
        <Text>Assessment Screen</Text>
        <Text>This screen is under development</Text>
        <Button title="classify" onPress={ this.getPrediction }></Button>
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

export default AssessmentScreen
