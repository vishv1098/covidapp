import { Platform } from 'react-native'
import PushNotification from 'react-native-push-notification'

export const LocalNotification = () => {
    PushNotification.localNotification({
        title: 'Local Notification Title',
        message: 'Expand me to see more',
        repeatType: "day"
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
        date: new Date(Date.now() + 15 * 1000), // in 60 secs
        repeatType: "day",
        repeatTime: "32400000"
    })
}
