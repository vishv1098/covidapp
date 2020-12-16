import React, { useRef } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import ViewPager from '@react-native-community/viewpager';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Page from './Page'
import Footer from './Footer'

const OnboardingScreen = () => {

    const pagerRef = useRef(null);

    const navigation = useNavigation();

    const handlePageChange = pageNumber => {
        pagerRef.current.setPage(pageNumber);
    };

    return (
        <View style={{ flex: 1 }}>
            <ViewPager style={{ flex: 1 }} scrollEnabled={false} initialPage={0} ref={pagerRef}>
            <View key="1">
                    <Page
                        backgroundColor="black"
                        // iconName=""
                        title="Welcome"
                        heightTitle=""
                        weightTitle=""
                        ageBox=""
                        genderBox=""
                        raceBox=""
                        countryBox=""
                    />
                    <Footer
                        backgroundColor="black"
                        rightButtonLabel="Next"
                        rightButtonPress={ async () => {
                            // const value = await AsyncStorage.getItem('userWeight')
                            // const value2 = await AsyncStorage.getItem('userHeight')
                            // console.log(value)
                            // if (value !== null && value2 !== null) {
                            //     handlePageChange(1);
                            // }
                            handlePageChange(1);
                          }}
                    />
                </View>
                <View key="2">
                    <Page
                        backgroundColor="#ffc93c"
                        iconName="body-outline"
                        title="BMI is a good gauge of your risk for diseases"
                        heightTitle="Enter your height in cm"
                        weightTitle="Enter your weight in Kgs"
                        ageBox=""
                        genderBox=""
                        raceBox=""
                        countryBox=""
                    />
                    <Footer
                        backgroundColor="#ffc93c"
                        rightButtonLabel="Next"
                        rightButtonPress={ async () => {
                            const value = await AsyncStorage.getItem('userWeight')
                            const value2 = await AsyncStorage.getItem('userHeight')
                            console.log(value)
                            if (value !== null && value2 !== null) {
                                handlePageChange(2);
                            }
                          }}
                    />
                </View>
                <View key="3">
                    <Page
                        backgroundColor="#556b2f"
                        iconName="medkit-outline"
                        title="With age, the disease burden increases"
                        heightTitle=""
                        weightTitle=""
                        ageBox="Select Age"
                        genderBox="Select Gender"
                        raceBox=""
                        countryBox=""
                    />
                    <Footer
                        backgroundColor="#556b2f"
                        rightButtonLabel="Next"
                        rightButtonPress={ async () => {
                            const value = await AsyncStorage.getItem('userDOB')
                            const value2 = await AsyncStorage.getItem('userGender')
                            console.log(value)
                            if (value !== null && value2 !== null) {
                                handlePageChange(3);
                            }
                          }}
                    />
                </View>
                <View key="4">
                    <Page
                        backgroundColor="#07689f"
                        iconName="analytics-outline"
                        title="Biological diversity produces different diseases and susceptibility to diseases"
                        heightTitle=""
                        weightTitle=""
                        ageBox=""
                        genderBox=""
                        raceBox="Select Race"
                        countryBox=""
                    />
                    <Footer
                        backgroundColor="#07689f"
                        rightButtonLabel="Continue"
                        rightButtonPress={ async () => {
                            const value = await AsyncStorage.getItem('userRace')
                            if (value !== null) {
                                navigation.navigate('Home');
                            }
                            // navigation.navigate('Home');
                          }}
                    />
                </View>
            </ViewPager>
        </View>
    )
}

export default OnboardingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    slider: {
        flex: 0.61,
    },
    footer: {
        flex: 1,
    }
})

