import React from 'react';  
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import  { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const modelJson = require('../components/model.json');
const modelWeights = require('../components/group1-shard1of1.bin');
// const nextImageTensor = images.next().value
// const nextImageTensor2 = nextImageTensor.reshape([[-1.0, -1.0, 80.0, 142.0, -1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 53.0, 0.0]])
const BACKEND_CONFIG = 'cpu';

class AssessmentScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      // isModelReady: false,
      // useModel: {}
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
    const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
    // const a = tf.tensor([["o2","dbp","sbp","heartrate","Respiratory rate","BodyTemp","Sex","White","black","others","Ethnicity","Age"]]);
    console.log(model)
    const a = tf.tensor([[-1,61, 121, 52, 16, 36.8, 0, 0, 1, 0, 0, 12.2]]);
    console.log(a)
    const res = model.predict(a);
    // this.setState({
    //     useModel: model,
    //     isModelReady: true
    // });
    const da = await res.data();
    console.log(JSON.stringify(da))
    console.log("Hi")
    console.log(res)
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
