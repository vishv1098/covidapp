import PushNotification from 'react-native-push-notification'

export const LocalNotification = () => {
    PushNotification.localNotification({
        title: 'Local Notification Title',
        message: 'Expand to see more',
        repeatType: "day"
    })
}

export const ScheduledLocalNotification = () => {
    PushNotification.localNotificationSchedule({
        autoCancel: true,
        bigText:
        'We recommend that you assess yourself periodically to evaluate your health condition',
        subText: 'Daily Notification Remainder',
        title: 'Did you take a self-assessment?',
        message: 'Assess yourself periodically',
        vibrate: true,
        vibration: 500,
        playSound: true,
        soundName: 'default',
        date: new Date(Date.now() + 15 * 1000), // in 60 secs
        repeatType: "day",
        repeatTime: "32400000"
    })
}
