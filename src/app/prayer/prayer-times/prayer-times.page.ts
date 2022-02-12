import { Component, OnInit } from '@angular/core';
import { NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Platform } from '@ionic/angular';

const adhan = require('adhan'); //https://npm.io/package/adhan
const countdown = require('countdown'); //https://www.npmjs.com/package/countdown
import * as moment from 'moment';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';

@Component({
  selector: 'app-prayer-times',
  templateUrl: './prayer-times.page.html',
  styleUrls: ['./prayer-times.page.scss'],
})
export class PrayerTimesPage implements OnInit {
  prayertimes: any;
  current: any;
  sunnahTimes: any;
  dhikr: any;
  timer: any;
  timerId: any;
  contdown: any;
  geolocation: any;
  nextPrayerTime: Date;
  online: boolean;
  calcuationMethods = [
    {
      name: 'NorthAmerica',
      selected: true,
    },
    {
      name: 'MuslimWorldLeague',
      selected: false,
    },
    {
      name: 'UmmAlQura',
      selected: false,
    },
    {
      name: 'Turkey',
      selected: false,
    },
    {
      name: 'Dubai',
      selected: false,
    },
    {
      name: 'Qatar',
      selected: false,
    },
    {
      name: 'Kuwait',
      selected: false,
    },
    {
      name: 'Egyptian',
      selected: false,
    },
    {
      name: 'Karachi',
      selected: false,
    },
    {
      name: 'MoonsightingCommittee',
      selected: false,
    },
    {
      name: 'Tehran',
      selected: false,
    },
  ];
  locationData: {
    locality: string;
    countryName: string;
    subAdministrativeArea: string;
  };
  fajrTime: string;
  dhuhrTime: string;
  sunriseTime: string;
  asrTime: string;
  maghribTime: string;
  ishaTime: string;
  middleOfTheNight: string;
  lastThirdOfTheNight: string;

  constructor(private nativePluginsService: NativePluginsService, private platform: Platform) {
    this.online = navigator.onLine;

    // this.platform.pause.subscribe(async () => {
    //   this.showStickyNotification(
    //     this.fajrTime,
    //     this.sunriseTime,
    //     this.dhuhrTime,
    //     this.asrTime,
    //     this.maghribTime,
    //     this.ishaTime
    //   );
    // });
  }

  ngOnInit() {
    if (this.nativePluginsService.geolocationData == null) {
      this.getCurrentPosition();
    } else {
      this.getLocationNameByCoordinate(
        this.nativePluginsService.geolocationData.latitude,
        this.nativePluginsService.geolocationData.longitude
      );
      this.getPrayerTimes(
        this.nativePluginsService.geolocationData.latitude,
        this.nativePluginsService.geolocationData.longitude
      );
    }
  }

  getCurrentPosition() {
    this.locationData = null;
    this.nativePluginsService.getCurrentLocation();
    setTimeout(()=> {
      this.getLocationNameByCoordinate(
        this.nativePluginsService.geolocationData.latitude,
        this.nativePluginsService.geolocationData.longitude
      );

      this.getPrayerTimes(
        this.nativePluginsService.geolocationData.latitude,
        this.nativePluginsService.geolocationData.longitude
      );
    }, 2000);
  }

  getPrayerTimes(latitude, longitude, calculationMethod = 'NorthAmerica') {
    const date = new Date();
    // var date = new Date(2015, 11, 1);
    const coordinates = new adhan.Coordinates(latitude, longitude);
    let params;
    if (calculationMethod === 'NorthAmerica') {
      params = adhan.CalculationMethod.NorthAmerica();
    } else if (calculationMethod === 'MuslimWorldLeague') {
      params = adhan.CalculationMethod.MuslimWorldLeague();
    } else if (calculationMethod === 'Egyptian') {
      params = adhan.CalculationMethod.Egyptian();
    } else if (calculationMethod === 'Karachi') {
      params = adhan.CalculationMethod.Karachi();
    } else if (calculationMethod === 'UmmAlQura') {
      params = adhan.CalculationMethod.UmmAlQura();
    } else if (calculationMethod === 'Dubai') {
      params = adhan.CalculationMethod.Dubai();
    } else if (calculationMethod === 'Qatar') {
      params = adhan.CalculationMethod.Qatar();
    } else if (calculationMethod === 'Kuwait') {
      params = adhan.CalculationMethod.Kuwait();
    } else if (calculationMethod === 'MoonsightingCommittee') {
      params = adhan.CalculationMethod.MoonsightingCommittee();
    } else if (calculationMethod === 'Turkey') {
      params = adhan.CalculationMethod.Turkey();
    } else if (calculationMethod === 'Tehran') {
      params = adhan.CalculationMethod.Tehran();
    }
    const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

    this.fajrTime = moment(prayerTimes.fajr).format('HH:mm');
    this.sunriseTime = moment(prayerTimes.sunrise).format('HH:mm');
    this.dhuhrTime = moment(prayerTimes.dhuhr).format('HH:mm');
    this.asrTime = moment(prayerTimes.asr).format('HH:mm');
    this.maghribTime = moment(prayerTimes.maghrib).format('HH:mm');
    this.ishaTime = moment(prayerTimes.isha).format('HH:mm');

    const sunnahTimes = new adhan.SunnahTimes(prayerTimes);
    this.middleOfTheNight = moment(sunnahTimes.middleOfTheNight).format(
      'HH:mm'
    );
    this.lastThirdOfTheNight = moment(sunnahTimes.lastThirdOfTheNight).format(
      'HH:mm'
    );

    this.scheduleNotification('Sabah namaz', 'Nastupio je sabah namaz', 1, prayerTimes.fajr);
    this.scheduleNotification('Podne namaz', 'Nastupio je podne namaz', 2, prayerTimes.dhuhr);
    this.scheduleNotification('Ikindija namaz', 'Nastupila je ikindija namaz', 3, prayerTimes.asr);
    this.scheduleNotification('Aksam namaz', 'Nastupio je aksam namaz', 4, prayerTimes.maghrib);
    this.scheduleNotification('Jacija namaz', 'Nastupila je jacija namaz', 5, prayerTimes.isha);
    this.scheduleNotification('Polovina noci', 'Nastupila je polovina noci', 6, sunnahTimes.middleOfTheNight);
    this.scheduleNotification('Zadnja trecina noci', 'Nastupila je zadnja trecina noci', 7, sunnahTimes.lastThirdOfTheNight);

    // this.showStickyNotification(this.fajrTime, this.sunriseTime, this.dhuhrTime, this.asrTime, this.maghribTime, this.ishaTime);
    const current = prayerTimes.currentPrayer();
    const next = prayerTimes.nextPrayer();
    const nextPrayerTime = prayerTimes.timeForPrayer(next);

    this.prayertimes = {
      fajr: this.fajrTime,
      sunrise: this.sunriseTime,
      dhuhr: this.dhuhrTime,
      asr: this.asrTime,
      maghrib: this.maghribTime,
      isha: this.ishaTime,
      middleOfTheNight: this.middleOfTheNight,
      lastThirdOfTheNight: this.lastThirdOfTheNight,
      nextPrayerTime: next,
    };

    // this.clearCounter();
    // if (next === 'none') {
    //   this.setCounter(this.addDays(prayerTimes.fajr, 1));
    // } else if (next === 'fajr') {
    //   this.setCounter(this.addDays(prayerTimes.fajr));
    // } else {
    //   this.setCounter(this.addDays(nextPrayerTime));
    // }

    this.current = {
      currentPrayer: current,
      nextPrayer: next,
      nextPrayerTime: moment(nextPrayerTime).format('HH:mm'),
    };
  }

  showStickyNotification(fajrTime, sunriseTime, dhuhrTime, asrTime, maghribTime, ishaTime) {
    this.nativePluginsService.showNotification({
      title: `Namaska vremena za: Sarajevo`,
      text: `
      ${fajrTime} - Zora
      ${sunriseTime} - Izlazak sunca
      ${dhuhrTime} - Podne
      ${asrTime} - Ikindija
      ${maghribTime} - Aksam
      ${ishaTime} - Jacija`,
      id: 100,
      sticky: true,
      lockscreen: true,
      foreground: true,
      sound: null,
      led: true,
      vibrate: true,
      trigger: {
        every: {
          hour: new Date(new Date().getTime()).getHours(),
          minute: new Date(new Date().getTime()).getMinutes()+1
        },
        count: 1
      }
    });
  }


  setCounter(date: Date) {
    const self = this;
    this.timerId = countdown(
      date,
      (time) => {
        // document.getElementById('pageTimer').innerHTML = ts.toHTML('strong');
        self.contdown = {
          hours: time.hours,
          minutes: time.minutes,
          seconds: time.seconds,
        };
        if (time.hours === 0 && time.minutes === 0 && time.seconds === 1) {
          self.getPrayerTimes(
            self.nativePluginsService.geolocationData.latitude,
            self.nativePluginsService.geolocationData.longitude
          );
        }
      },
      // eslint-disable-next-line no-bitwise
      countdown.HOURS | countdown.MINUTES | countdown.SECONDS
    );
  }

  scheduleNotification(title, text, id: number, date){
    this.nativePluginsService.showNotification({
      title,
      text,
      id,
      priority: 2,
      sticky: true,
      wakeup: true,
      launch: true,
      lockscreen: true,
      foreground: true,
      trigger: {
        // at: new Date(date),
        every: {
          hour: new Date(date).getHours(),
          minute: new Date(date).getMinutes()
        },
        count: 1
      }
    });
  }

  clearCounter() {
    window.clearInterval(this.timerId);
  }

  addDays(date, days = 0) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  qiblaDirections(latitude, longitude) {
    const coordinates = new adhan.Coordinates(latitude, longitude);
    const qiblaDirection = adhan.Qibla(coordinates);
  }

  onCalculationMethodChanged(method) {
    this.clearCounter();
    this.getPrayerTimes(
      this.nativePluginsService.geolocationData.latitude,
      this.nativePluginsService.geolocationData.longitude,
      method
    );
  }

  getLocationNameByCoordinate(latitude, longitude) {
    this.nativePluginsService
      .getLocationNameByCoordinate(latitude, longitude)
      .then((result: NativeGeocoderResult[]) => {
        let data;
        if (result) {
          result.forEach((item) => {
            if (item.locality) {
              this.locationData = {
                locality: item.locality,
                countryName: item.countryName,
                subAdministrativeArea: item.subAdministrativeArea,
              };
            }
          });
        }
        return data;
      })
      .catch((error: any) => console.log(error));
  }
}
