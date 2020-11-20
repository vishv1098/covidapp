import { Platform } from 'react-native'
import PushNotification from 'react-native-push-notification'

// PushNotification.configure({
//   // (required) Called when a remote or local notification is opened or received
//   onNotification: function(notification) {
//     console.log('LOCAL NOTIFICATION ==>', notification)
//   },

//   popInitialNotification: true,
//   requestPermissions: Platform.OS === 'ios'
// })

export const LocalNotification = () => {
    PushNotification.localNotification({
        // autoCancel: true,
        // bigText:
        // 'This is local notification demo in React Native app. Only shown, when expanded.',
        // subText: 'Local Notification Demo',
        title: 'Local Notification Title',
        message: 'Expand me to see more',
        // vibrate: true,
        // vibration: 300,
        // playSound: true,
        // soundName: 'default',
        // actions: '["Yes", "No"]'
        repeatType: "minute"
    })
}

export const ScheduledLocalNotification = () => {
    PushNotification.localNotificationSchedule({
        autoCancel: true,
        bigText:
        'We recommend that you self assess yourself periodically to check your health condition',
        subText: 'Daily Notification Remainder',
        title: 'Did you self assess yourself?',
        message: 'Self assess yourself periodically',
        vibrate: true,
        vibration: 500,
        playSound: true,
        soundName: 'default',
        // actions: '["Yes", "No"]',
        date: new Date(Date.now() + 15 * 1000), // in 60 secs
        repeatType: "minute"
    })
}
