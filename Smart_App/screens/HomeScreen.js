import React, {useRef, useState, useEffect } from 'react';  
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Button, Dimensions, StatusBar, ImageBackground, TextInput, FlatList } from 'react-native';
import Carousel from 'react-native-anchor-carousel'
import { FontAwesome5, MaterialIcons } from 'react-native-vector-icons'
import Icon from 'react-native-vector-icons/Feather';

const HomeScreen = () => {

  const [backgroundData, setbackgroundData] = useState('')

  const [dataSet, setDataSet] = useState([
    {
      "dateTime": "2020-07-12",
      "value": "0"
    },
    {
      "dateTime": "2020-07-13",
      "value": "912"
    },
    {
      "dateTime": "2020-07-14",
      "value": "1033"
    },
    {
      "dateTime": "2020-07-15",
      "value": "1570"
    },
    {
      "dateTime": "2020-07-16",
      "value": "17"
    }
  ])

  const carouselRef = useRef(null);

  const {width,height} = Dimensions.get('window');

  const renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
        onPress={() => {
          carouselRef.current.scrollToIndex(index);
          console.log(backgroundData)
          setbackgroundData(item.value)
        }}>
          <Text style={styles.carouselImage}>{item.dateTime}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (  
    // <View style={styles.container}>  
    //   <Text>Home Screen</Text>
    //   <Text>This screen is under development</Text>
    // </View>
    <ScrollView>
      <View style = {styles.carouselContentContainer}>
        <View style={{...StyleSheet.absoluteFill, backgroundColor: '#000'}}>
          {/* <ImageBackground
          source = {{uri: background.uri }}
          style = {styles.ImageBg}
          blurRadius={10}
          >

          </ImageBackground> */}
          <View style={styles.searchBoxContainer}>
            <TextInput
            placeholder='Select Date'
            placeholderTextColor='#666'
            style={styles.SearchBox}
            />
            <Icon name='search' size={22} color='#666' style={styles.searchBoxIcon} />
          </View>
          <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold',
          marginLeft: 10, marginVertical: 10}}>Recent data from this week</Text>
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
          <View style={styles.dataInfoContainer}>
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.dataName}>{backgroundData}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({  
    container: {  
      flex: 1,  
      justifyContent: 'center',  
      alignItems: 'center'  
    },
    carouselContentContainer: {
      flex: 1,
      backgroundColor: '#000',
      height: 720,
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
      marginVertical: 10,
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
      height: 350,
      justifyContent: 'center',
      alignItems: 'center'
    },
    Carousel: {
      flex: 1,
      overflow: 'visible'
    },
    carouselImage: {
      width: 200,
      height: 320,
      borderRadius: 10,
      alignSelf: 'center',
      backgroundColor: 'white'
    },
    carouselText: {
      padding: 14,
      color: 'white',
      position: 'absolute',
      bottom: 10,
      left: 2,
      fontWeight: 'bold'
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
      paddingLeft: 14,
      color: 'white',
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
    }
});

export default HomeScreen;
