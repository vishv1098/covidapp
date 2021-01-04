import React, { Component } from 'react';
import {View, Text, SafeAreaView} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import SwipeButton from 'rn-swipe-button'

const slideIcon = () => <Icon name="arrow-forward-outline" color="black" size={30} />;

class SwiperButton extends Component {

    constructor(props){
        super(props)
        this.state = {
            startTest: false,
        }
    }

    componentWillUnmount() {
        const {swipeData} = this.state.startTest;
        swipeData()
    }

    render() {
        return (
            <SafeAreaView>
                <View style={{ padding:15, paddingTop: 150 }}>
                    <SwipeButton
                        disabled = {false}
                        swipeSuccessThreshold = {70}
                        height = {60}
                        width = {350}
                        title = '           Swipe to start the COVID test'
                        titleColor = 'black'
                        onSwipeSuccess = { () => {
                            this.setState({ startTest: true })
                        }}
                        swipeSuccessThreshold = {80}
                        railFillBackgroundColor = '#FFFF99'
                        railFillBorderColor = '#FFFF99'
                        thumbIconBackgroundColor = 'white'
                        thumbIconBorderColor = 'white'
                        thumbIconComponent = {slideIcon}
                        railBackgroundColor = '#CCCCCC'
                        railBorderColor = '#CCCCCC'
                        titleFontSize = {20}
                    >
                    </SwipeButton>
                </View>
            </SafeAreaView>
        );
    }
}

export default SwiperButton
