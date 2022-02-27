import { Injectable } from '@angular/core';
import {
  ELocalNotificationTriggerUnit,
  ILocalNotification,
  LocalNotifications,
} from '@awesome-cordova-plugins/local-notifications/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult,
} from '@awesome-cordova-plugins/native-geocoder/ngx';
@Injectable({
  providedIn: 'root',
})
export class NativePluginsService {
  every: ELocalNotificationTriggerUnit = ELocalNotificationTriggerUnit.SECOND;
  geolocationData: any;
  constructor(
    private localNotifications: LocalNotifications,
    private geolocation: Geolocation,
    private vibration: Vibration,
    private nativeGeocoder: NativeGeocoder
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
        this.geolocationData = resp.coords;
        localStorage.setItem(
          'geolocation',
          JSON.stringify({
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude,
          })
        );
      })
      .catch((error) => {
        alert('Error getting location: ' + JSON.stringify(error));
      });
  }

  showNotification(notification: ILocalNotification) {
    this.localNotifications.schedule(notification);
  }

  scheduleNotificationForMorningDhikr() {
    this.showNotification({
      title: `Vrijeme je za jutarnji zikr`,
      text: 'Zapocni dan spominjanjem Allaha Uzvisenog i tako se zastiti i u svoj zivot unesi bereket',
      id: 10,
      sound: null,
      trigger: {
        // every: this.every,
        // in: 10,
        every: {
          hour: 6,
          minute: 30,
        },
        count: 365
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

  scheduleNotificationForEveningDhikr() {
    this.showNotification({
      title: `Vrijeme je za vecernji zikr`,
      text: 'Zavrsi dan spominjanjem Allaha Uzvisenog i tako se zastiti i u svoj zivot unesi bereket',
      id: 11,
      sound: null,
      trigger: {
        // every: this.every,
        // in: 10,
        every: {
           hour: 15,
          minute: 30,
        },
        count: 365,
      },
      led: { color: '#FF00FF', on: 500, off: 500 },
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

  getLocationNameByCoordinate(latitude, longitude) {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    return this.nativeGeocoder
      .reverseGeocode(latitude, longitude, options);
  }

  getLocationCoordinatesByCityName(city) {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };

    this.nativeGeocoder
      .forwardGeocode(city, options)
      .then((result: NativeGeocoderResult[]) =>
        alert(
          'The coordinates of ' +
            city +
            ' are latitude=' +
            result[0].latitude +
            ' and longitude=' +
            result[0].longitude
        )
      )
      .catch((error: any) => console.log(error));
  }
}
