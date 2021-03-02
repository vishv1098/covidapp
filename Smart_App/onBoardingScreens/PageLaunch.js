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
          <View style={styles.middleContainer}>
            {headerTitle !== "" ?
            <Text adjustsFontSizeToFit style={styles.headerTitleText}>
              {headerTitle}
            </Text>
            :
            null
            }
            <View style={{alignContent: 'center', justifyContent: "center"}}>
              <Text adjustsFontSizeToFit style={styles.innerTop}>
                This application uses machine learning models to predict the likelihood of having COVID-19 or an influenza infection based on self-reported symptoms and vital signs of an individual.
              </Text>
              <Text adjustsFontSizeToFit style={styles.innerMiddle}>
              The data collected or automatically extracted from wearable devices is only used for on-device predictions and is not stored or collected for other use.
              </Text>
              <Text adjustsFontSizeToFit style={styles.innerBottom}>
                The data and services provided by this application are an information resource only, and are not to be used or relied on for any diagnostic or treatment purpose.
              </Text>
            </View>
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
    padding: '10rem',
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
    justifyContent: 'flex-end',
    paddingBottom: '5rem',
  },
  middleContainer: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 3,
    width: "100%",
    paddingTop: '5rem',
  },
  headerTitleText: {
    fontSize: '24rem',
    fontWeight: 'bold', 
    color: '#000000', 
    textAlign: 'center',  
    marginLeft: '10rem', 
    marginRight: '10rem',
    marginBottom: '25rem'
  },
  innerTop: {
    fontSize: '17rem',
    fontWeight: '400',
    color: '#000000',
    textAlign: 'left',
    marginLeft: '25rem',
    marginRight: '25rem',
    paddingTop: '10rem',
    paddingBottom: '5rem'
  },
  innerMiddle: {
    fontSize: '17rem',
    fontWeight: '400',
    color: '#000000',
    textAlign: 'left',
    marginLeft: '25rem',
    marginRight: '25rem',
    paddingTop: '5rem',
    paddingBottom: '5rem'
  },
  innerBottom: {
    fontSize: '17rem',
    fontWeight: '400',
    color: '#000000',
    textAlign: 'left',
    marginLeft: '25rem',
    marginRight: '25rem',
    paddingTop: '5rem',
    paddingBottom: '10rem'
  },
  buttonTop: {
    backgroundColor: '#009624', 
    flexDirection: 'row', 
    height: '55rem', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '25rem', 
    marginRight: '25rem',
    marginTop: '30rem'
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
    fontSize: '20rem', 
    color: 'white',
  }
})

