import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native'
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
                        title="This application uses machine learning models to predict the likelihood of having COVID-19 or an influenza infection based on self-reported symptoms and vital signs of an individual. The data collected or automatically extracted from wearable devices is only used for on-device predictions and is not stored or collected for other use. The data and services provided by this application is provided as an information resource only, and is not to be used or relied on for any diagnostic or treatment purpose."
                        headerTitle="Covid Guardian Angel"
                        heightTitle=""
                        weightTitle=""
                        ageBox=""
                        genderBox=""
                        raceBox=""
                        countryBox=""
                        iconsize="10"
                    />
                    <Footer
                        backgroundColor="black"
                        rightButtonLabel="Next"
                        rightButtonPress={ async () => {
                            handlePageChange(1);
                          }}
                    />
                </View>
                <View key="2">
                    <Page
                        backgroundColor="#ffc93c"
                        iconName="body-outline"
                        title="BMI is a good gauge of your risk for diseases"
                        headerTitle=""
                        heightTitle="Enter your height in cm"
                        weightTitle="Enter your weight in Kgs"
                        ageBox=""
                        genderBox=""
                        raceBox=""
                        countryBox=""
                        iconsize="172"
                    />
                    <Footer
                        backgroundColor="#ffc93c"
                        rightButtonLabel="Next"
                        rightButtonPress={ async () => {
                            const value = await AsyncStorage.getItem('userWeight')
                            const value2 = await AsyncStorage.getItem('userHeight')
                            if (value !== null && value2 !== null) {
                                handlePageChange(2);
                            } else {
                                alert("Please fill all the fields")
                            }
                          }}
                    />
                </View>
                <View key="3">
                    <Page
                        backgroundColor="#556b2f"
                        iconName="medkit-outline"
                        title="With age, the disease burden increases"
                        headerTitle=""
                        heightTitle=""
                        weightTitle=""
                        ageBox="Select Age"
                        genderBox="Select Gender"
                        raceBox=""
                        countryBox=""
                        iconsize="172"
                    />
                    <Footer
                        backgroundColor="#556b2f"
                        rightButtonLabel="Next"
                        rightButtonPress={ async () => {
                            const value = await AsyncStorage.getItem('userDOB')
                            const value2 = await AsyncStorage.getItem('userGender')
                            if (value !== null && value2 !== null) {
                                handlePageChange(3);
                            } else {
                                alert("Please fill all the fields")
                            }
                          }}
                    />
                </View>
                <View key="4">
                    <Page
                        backgroundColor="#07689f"
                        iconName="analytics-outline"
                        title="Biological diversity produces different diseases and susceptibility to diseases"
                        headerTitle=""
                        heightTitle=""
                        weightTitle=""
                        ageBox=""
                        genderBox=""
                        raceBox="Select Race"
                        countryBox=""
                        iconsize="172"
                    />
                    <Footer
                        backgroundColor="#07689f"
                        rightButtonLabel="Continue"
                        rightButtonPress={ async () => {
                            const value = await AsyncStorage.getItem('userRace')
                            if (value !== null) {
                                navigation.navigate('Terms');
                            } else {
                                alert("Please fill all the fields")
                            }
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
    },
    slider: {
        flex: 0.61,
    },
    footer: {
        flex: 1,
    }
})

