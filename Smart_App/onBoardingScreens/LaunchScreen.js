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
                        headerTitle="COVID-19 Guardian Angel"
                    />
                </View>
            </ViewPager>
        </View>
    )
}

export default LaunchScreen
