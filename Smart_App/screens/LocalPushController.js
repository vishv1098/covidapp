import PushNotification from 'react-native-push-notification'

export const LocalNotification = () => {
    PushNotification.localNotification({
        title: 'Local Notification Title',
        message: 'Expand to see more',
        repeatType: "day"
    })
}

export const ScheduledLocalNotification = () => {
    var now = new Date();
    now.setDate(now.getDate())
    now.setHours(9);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
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
        date: now, // in 60 secs
        repeatType: "day",
    })
}
