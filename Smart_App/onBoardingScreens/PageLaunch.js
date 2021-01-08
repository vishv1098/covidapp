import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Platform, PixelRatio } from 'react-native';
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

const PageLaunch = ({ headerTitle }) => {

  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            {headerTitle !== "" ?
            <Text adjustsFontSizeToFit style={styles.headerTitleText}>
              {headerTitle}
            </Text>
            :
            null
            }
          </View>
          <View style={styles.middleContainer}>
            <View style={{flex:1, alignContent: 'center', justifyContent: "center"}}>
              <Text adjustsFontSizeToFit style={styles.innerTop}>
                This application uses machine learning models to predict the likelihood of having COVID-19 or an influenza infection based on self-reported symptoms and vital signs of an individual.
              </Text>
            </View>
            <View style={{flex:0.8, alignContent: 'center'}}>
              <Text adjustsFontSizeToFit style={styles.innerMiddle}>
              The data collected or automatically extracted from wearable devices is only used for on-device predictions and is not stored or collected for other use.
              </Text>
            </View>
            <View style={{flex:1, alignContent: 'center'}}>
              <Text adjustsFontSizeToFit style={styles.innerBottom}>
                The data and services provided by this application are an information resource only, and are not to be used or relied on for any diagnostic or treatment purpose.
              </Text>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.buttonTop} activeOpacity = {.5} onPress={ async() => { navigation.navigate('Terms')}}>
              <Text adjustsFontSizeToFit style={styles.buttonTextStyle}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
};

export default PageLaunch;

const styles = EStyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    padding: 10,
  },
  contentContainer: {
    width: "100%",
    aspectRatio: 0.7,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 3,
    width: "100%",
  },
  middleContainer: {
    flex: 20,
    width: "100%",
  },
  bottomContainer: {
    flex: 3,
    width: "100%",
  },
  headerTitleText: {
    fontSize: '35rem', 
    fontWeight: 'bold', 
    color: '#000000', 
    textAlign: 'center',  
    marginLeft: '10rem', 
    marginRight: '10rem'
  },
  innerTop: {
    fontSize: '18rem',
    fontWeight: '100',
    color: '#000000',
    textAlign: 'left',
    marginLeft: '25rem',
    marginRight: '25rem'
  },
  innerMiddle: {
    fontSize: '18rem',
    fontWeight: '100',
    color: '#000000',
    textAlign: 'left',
    marginLeft: '25rem',
    marginRight: '25rem'
  },
  innerBottom: {
    fontSize: '18rem',
    fontWeight: '100',
    color: '#000000',
    textAlign: 'left',
    marginLeft: '25rem',
    marginRight: '25rem'
  },
  buttonTop: {
    backgroundColor: '#009624', 
    flexDirection: 'row', 
    height: '55rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '25rem', 
    marginRight: '25rem'
  },
  iconStyle: {
    flex: 1.8, 
    backgroundColor: '#009624', 
    marginLeft: '15rem'
  },
  buttonTextStyle: {
    flex: 10, 
    textAlign: 'center', 
    alignContent:'flex-start', 
    marginLeft: '25rem', 
    marginRight: '25rem',
    fontSize: '25rem', 
    color: 'white',
  }
})

