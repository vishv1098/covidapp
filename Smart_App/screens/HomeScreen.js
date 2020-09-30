import React, {useRef, useState, useEffect } from 'react';  
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Button, Dimensions, StatusBar, ImageBackground, TextInput, FlatList } from 'react-native';
import Carousel from 'react-native-anchor-carousel'
import { FontAwesome5, MaterialIcons } from 'react-native-vector-icons'
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

const screenHeight = Math.round(Dimensions.get('window').height);

const HomeScreen = () => {

  const [backgroundData, setbackgroundData] = useState('')

  const [dataSet, setDataSet] = useState([
    {
      "dateTime": "Jul 12",
      "value": "0"
    },
    {
      "dateTime": "Jul 13",
      "value": "912"
    },
    {
      "dateTime": "Jul 14",
      "value": "1033"
    },
    {
      "dateTime": "Jul 15",
      "value": "1570"
    },
    {
      "dateTime": "Jul 16",
      "value": "17"
    }
  ])

  const carouselRef = useRef(null);

  const {width,height} = Dimensions.get('window');
  const [authenticate, setAuthenticate ] = React.useState(null);

  const test = async () => {
    const auth_check = await AsyncStorage.getItem('fitbit_accesstoken')
    if (auth_check !== null) {
        setAuthenticate(auth_check)
    }
  }

  React.useEffect(() => {
    test();
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
        onPress={() => {
          carouselRef.current.scrollToIndex(index);
          setbackgroundData(item.value)
        }}>
          <View style={styles.carouselImage}>
            <Text style={styles.carouselText}>{item.dateTime}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView>
      {authenticate === null ? <View style={styles.container}><Text>You can see this screen only after giving access to fitbit device in the device screen</Text></View>
       :
        <View style = {styles.carouselContentContainer}>
          <View style={{...StyleSheet.absoluteFill, backgroundColor: '#000'}}>
            <ImageBackground
            source = {{uri: 'https://blog.ipleaders.in/wp-content/uploads/2020/07/960x0.jpg'}}
            style = {styles.ImageBg}
            blurRadius={10}
            >
              <View style={styles.searchBoxContainer}>
                <TextInput
                placeholder='Select Date'
                placeholderTextColor='#666'
                style={styles.SearchBox}
                />
                <Icon name='search' size={22} color='#666' style={styles.searchBoxIcon} />
              </View>
              <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold',
              marginLeft: 10, marginVertical: 3}}>Recent data from this week</Text>
              <View style={styles.carouselContainerView}>
                <Carousel style={styles.Carousel}
                data={dataSet}
                renderItem={renderItem}
                itemWidth={200}
                containerWidth={ width-20}
                separatorWidth={0}
                ref={carouselRef}
                inActiveOpacity={0.4}            
                />
              </View>
              {/* <View style={styles.dataInfoContainer}>
                <View style={{justifyContent: 'center'}}>
                  
                </View>
              </View> */}
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.dataName}> Step count on the day: {backgroundData}</Text>
                  <Icon2 name='walk-outline' size={40} color='#666' style={styles.searchBoxIcon2} />
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({  
    container: {  
      flex: 1,  
      justifyContent: 'center',  
      alignItems: 'center',
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 50
    },
    carouselContentContainer: {
      flex: 1,
      backgroundColor: '#000',
      height: screenHeight,
      paddingHorizontal: 14
    },
    ImageBg: {
      flex: 1,
      height: null,
      width: null,
      opacity: 1,
      justifyContent: 'flex-start'
    },
    searchBoxContainer: {
      backgroundColor: '#fff',
      elevation: 10,
      borderRadius: 4,
      marginVertical: 20,
      width: '95%',
      flexDirection: 'row',
      alignSelf: 'center'
    },
    SearchBox: {
      padding: 12,
      paddingLeft: 20,
      fontSize: 16
    },
    searchBoxIcon: {
      position: 'absolute',
      right: 20,
      top: 14
    },
    carouselContainerView: {
      width: '100%',
      height: 100,
      justifyContent: 'center',
      alignItems: 'center'
    },
    Carousel: {
      flex: 1,
      overflow: 'visible'
    },
    carouselImage: {
      width: 200,
      height: 100,
      borderRadius: 10,
      alignSelf: 'center',
      backgroundColor: 'orange'
    },
    carouselText: {
      padding: 35,
      color: 'white',
      position: 'absolute',
      bottom: 6,
      left: 30,
      fontWeight: 'bold',
      fontSize: 20
    },
    carouselIcon: {
      position: 'absolute',
      top: 15,
      right: 15
    },
    dataInfoContainer: {
      flexDirection: 'row',
      marginTop: 16,
      justifyContent: 'space-between',
      width: Dimensions.get('window').width - 14
    },
    dataName: {
      paddingLeft: 2,
      color: 'black',
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 6
    },
    dataStat: {
      paddingLeft: 14,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
      opacity: 0.8
    },
    card: {
      borderRadius: 10,
      elevation: 6,
      paddingTop: 5,
      marginVertical: 25,
      backgroundColor: '#fff',
      shadowOffset: {width: 1, height: 1},
      shadowColor: '#333',
      shadowOpacity: 2,
      paddingLeft: 20,
      fontSize: 16,
      padding: 12,
      marginHorizontal: 8
    },
    cardContent: {
      marginHorizontal: 18,
      marginVertical: 10
    },
    searchBoxIcon2: {
      position: 'absolute',
      right: 2,
      top: 1
    },
});

export default HomeScreen;
