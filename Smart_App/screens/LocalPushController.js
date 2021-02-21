import PushNotification from 'react-native-push-notification'

export const LocalNotification = () => {
    PushNotification.localNotification({
        title: 'Local Notification Title',
        message: 'Expand me to see more',
        repeatType: "day"
    })
}

export const ScheduledLocalNotification = () => {
    var now  = new Date();
    now.setDate(now.getDate())
    now.setHours(9);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
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
        date: now,
        soundName: 'default',
        repeatType: "day",
        
    })
}
