import React from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Keyboard, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PageLaunch = ({ backgroundColor, iconName, title, headerTitle, iconsize }) => {

  const navigation = useNavigation();

  // return (
  //   <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  //     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor}}>
  //       <ScrollView>
  //         <View
  //           style={{
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //             flexDirection: 'column'
  //           }}
  //         >
  //           <Icon name={iconName} size={parseInt(iconsize)} color="white" style={{position: 'relative', marginTop: 80}} />
  //           <View style={{ marginTop: 16 }}>
  //             {headerTitle !== "" ?
  //             <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'white', textAlign: 'center', paddingBottom: 45, alignContent:'space-around', alignItems:'center', alignSelf:'center' }}>
  //               {headerTitle}
  //             </Text>
  //             :
  //             null
  //             }
  //             <Text style={{ fontSize: 22, fontWeight: '100', color: 'white', textAlign: 'left', paddingBottom: 45, alignContent: 'space-around', alignItems: 'center', alignSelf:'center', marginLeft: 25, marginRight: 20 }}>
  //               {title}
  //             </Text>            
  //           </View>
  //           <View>
  //             <TouchableOpacity style={{ backgroundColor: 'white', margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} activeOpacity = {.5} onPress={ async() => { navigation.navigate('Terms')}}>
  //               <Text style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Get Started</Text>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </ScrollView>
  //     </View>
  //   </TouchableWithoutFeedback>
  // );

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex:1, backgroundColor }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
          <View style={{ marginTop: 16 }}>
            {headerTitle !== "" ?
            <Text adjustsFontSizeToFit style={{ fontSize: 35, fontWeight: 'bold', color: 'white', textAlign: 'center', paddingBottom: 45, alignContent:'space-around', alignItems:'center', alignSelf:'center' }}>
              {headerTitle}
            </Text>
            :
            null
            }
            <Text adjustsFontSizeToFit style={{ fontSize: 20, fontWeight: '100', color: 'white', textAlign: 'left', paddingBottom: 45, alignContent: 'space-around', alignItems: 'center', alignSelf:'center', marginLeft: 25, marginRight: 20 }}>
              {title}
            </Text>            
          </View>
          <View>
            <TouchableOpacity style={{ backgroundColor: 'white', margin: 10, paddingLeft: 25, paddingRight: 25, width: 360, height: 80, backgroundColor:'#007AFF', borderRadius: 25, justifyContent: 'center'}} activeOpacity = {.5} onPress={ async() => { navigation.navigate('Terms')}}>
              <Text adjustsFontSizeToFit style={{textAlign:'center', fontSize: 30, color: 'white', fontWeight: 'bold'}}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )

};

export default PageLaunch;

const styles = StyleSheet.create({
  Container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
