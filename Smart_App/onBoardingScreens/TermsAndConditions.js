import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, BackHandler, Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 380;

let entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

export function normalize(size) {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

const TermsAndConditions = () => {

  const navigation = useNavigation();

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const [accepted, setAccepted] = useState(false);

  useEffect(() => { 
    BackHandler.addEventListener('hardwareBackPress', function () { 
      return true; 
    }); 
  }) 

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.topContainer}>
          <Text adjustsFontSizeToFit style={styles.headerTitle}>
            Terms and Conditions
          </Text>
        </View>
        <View style={styles.middleContainer}>
          <ScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                setAccepted(true);
              }
            }}>
            <Text adjustsFontSizeToFit style={styles.tcP}>No Advice</Text>
              <Text adjustsFontSizeToFit style={styles.tcL}>This app, “COVID-19 Guardian Angel”, provides only information, not medical or treatment advice and may not be treated as such by the user. As such, this App may not be relied upon for the purposes of medical diagnosis or as a recommendation for medical care or treatment. The information on this App is not a substitute for professional medical advice, diagnosis or treatment. All content, including text, graphics, images and information, contained on or available through this App is for general information purposes only.</Text>
            <Text adjustsFontSizeToFit style={styles.tcP}>Professional Medical Assistance</Text>
              <Text adjustsFontSizeToFit style={styles.tcL}>You are strongly encouraged to confirm any information obtained from or through this App with your physician or another professional healthcare provider and to review all information regarding any medical condition or treatment with your physician or another professional healthcare provider.</Text>
            <Text adjustsFontSizeToFit style={styles.tcP}>No Reliance</Text>
              <Text adjustsFontSizeToFit style={styles.tcL}>You must not rely on any information obtained using this app for any diagnosis or recommendation for medical treatment. You must not rely on the information received from this app as an alternative to medical advice from your physician or other professional healthcare provider.</Text>
              <Text adjustsFontSizeToFit style={styles.tcL}>You must never disregard professional medical advice or delay seeking medical treatment as result of any information you have seen on or accessed through this app. if you have any specific questions about any medical matter you should consult your physician or other professional healthcare provider. if you think you may be suffering from any medical condition you should seek immediate medical attention.</Text>
            <Text adjustsFontSizeToFit style={styles.tcPend}>By accepting this you are agreeing to all the terms and conditions.</Text>
          </ScrollView>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity  disabled={ !accepted } activeOpacity = {.5} style={accepted ? styles.buttonTop : styles.buttonTopDisabled} onPress={ () => { navigation.navigate('bmi') }}>
              <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Agree and Continue</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default TermsAndConditions;

const styles = EStyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    padding: '25rem',
  },
  contentContainer: {
    width: "100%",
    aspectRatio: SCREEN_WIDTH/SCREEN_HEIGHT,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 3,
    width: "100%",
    justifyContent: 'center'
  },
  middleContainer: {
    flex: 20,
    width: "100%",
  },
  bottomContainer: {
    flex: 5,
    width: "100%",
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: '24rem',
    fontWeight: 'bold', 
    color: '#000000', 
    textAlign: 'center',  
    marginLeft: '10rem', 
    marginRight: '10rem',
    justifyContent: 'center',
  },
  tcP: {
    marginTop: '5rem',
    marginBottom: '3rem',
    fontSize: '15rem',
    fontWeight: 'bold',
    marginLeft: '10rem',
    marginRight: '10rem'
  },
  tcL:{
    marginLeft: '10rem',
    marginTop: '1rem',
    marginBottom: '10rem',
    marginRight: '10rem',
    fontSize: '15rem'
  },
  tcPend: {
    marginTop: '10rem',
    marginBottom: '10rem',
    fontSize: '15rem',
    fontWeight: 'bold',
    marginLeft: '10rem',
    marginRight: '10rem'
  },
  buttonTop: {
    backgroundColor: '#009624',
    flexDirection: 'row', 
    height: '53rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '10rem', 
    marginRight: '10rem',  
  },
  buttonTopDisabled: {
    backgroundColor: 'grey',
    flexDirection: 'row', 
    height: '53rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '10rem', 
    marginRight: '10rem',  
  },
  iconStyle: {
    flex: 1.8,
    marginLeft: '15rem',
  },
  buttonTextStyle: {
    flex: 10, 
    textAlign: 'center', 
    alignContent:'center', 
    marginLeft: '25rem', 
    marginRight: '25rem', 
    fontSize: '18rem', 
    color: 'white'
  }
})

