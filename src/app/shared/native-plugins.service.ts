import { Injectable } from '@angular/core';
import {
  ELocalNotificationTriggerUnit,
  ILocalNotification,
  LocalNotifications,
} from '@awesome-cordova-plugins/local-notifications/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
@Injectable({
  providedIn: 'root',
})
export class NativePluginsService {
  every: ELocalNotificationTriggerUnit = ELocalNotificationTriggerUnit.SECOND;
  geolocationData: any;
  constructor(
    private localNotifications: LocalNotifications,
    private geolocation: Geolocation,
    private vibration: Vibration
  ) {
    const geolocationFromStorage = localStorage.getItem('geolocation');
    if (geolocationFromStorage != null) {
      this.geolocationData = JSON.parse(geolocationFromStorage);
    }
  }

  getCurrentLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        console.log(resp.coords.latitude + ' ' + resp.coords.longitude);
        this.geolocationData = resp;
        localStorage.setItem('geolocation', JSON.stringify(resp));
      })
      .catch((error) => {
        alert('Error getting location: ' + JSON.stringify(error));
      });
  }

  showNotification(notification: ILocalNotification) {
    this.localNotifications.schedule(notification);
  }

  showNotificationForMorningDhikr() {
    this.showNotification({
      title: `Vrijeme je za jutarnji zikr`,
      text: 'Zapocni dan spominjanjem Allaha Uzvisenog i tako se zastiti i u svoj zivot unesi bereket',
      id: 1,
      sound: null,
      trigger: {
        // every: this.every,
        // in: 10,
        every: {
          hour: 6,
          minute: 30,
        },
      },
      led: 'FF0000',
      badge: 1,
      vibrate: true,
      lockscreen: true,
      foreground: true,
      sticky: true,
      priority: 2,
    });
  }

  showNotificationForEveningDhikr() {
    this.showNotification({
      title: `Vrijeme je za vecernji zikr`,
      text: 'Zavrsi dan spominjanjem Allaha Uzvisenog i tako se zastiti i u svoj zivot unesi bereket',
      id: 2,
      sound: null,
      trigger: {
        every: this.every,
        in: 10,
        // every: {
        //   hour: 15,
        //   minute: 30,
        // },
        count: 2,
      },
      led: { color: '#FF00FF', on: 500, off: 500 },
      // smallIcon: 'res://ic_stat_dhikr',
      // attachments: ['res://ic_stat_dhikr'],
      // icon: 'res://ic_stat_dhikr',
      // icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzfXKe6Yfjr6rCtR6cMPJB8CqMAYWECDtDqH-eMnerHHuXv9egrw',
      badge: 1,
      vibrate: true,
      lockscreen: true,
      foreground: true,
      sticky: true,
      priority: 2,
    });
  }

  vibrate(duration: number) {
    this.vibration.vibrate(duration);
  }
}
