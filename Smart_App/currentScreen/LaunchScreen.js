import React, { useRef } from 'react';
import { View } from 'react-native'
import ViewPager from '@react-native-community/viewpager';
import PageLaunch from './PageLaunch'

const LaunchScreen = () => {
    const pagerRef = useRef(null);
    return (
        <View style={{ flex: 1 }}>
            <ViewPager style={{ flex: 1 }} scrollEnabled={false} initialPage={0} ref={pagerRef}>
                <View key="1">
                    <PageLaunch
                        backgroundColor="black"
                        title="This application uses machine learning models to predict the likelihood of having COVID-19 or an influenza infection based on self-reported symptoms and vital signs of an individual. The data collected or automatically extracted from wearable devices is only used for on-device predictions and is not stored or collected for other use. The data and services provided by this application is provided as an information resource only, and is not to be used or relied on for any diagnostic or treatment purpose."
                        headerTitle="COVID-19 Guardian Angel"
                        iconsize="10"
                    />
                </View>
            </ViewPager>
        </View>
    )
}

export default LaunchScreen
