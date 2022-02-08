import { Component, OnInit } from '@angular/core';

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

  constructor(private nativePluginsService: NativePluginsService) {}

  ngOnInit() {
    if (this.nativePluginsService.geolocationData == null) {
      this.getCurrentPosition();
    } else {
      this.getPrayerTimes(
        this.nativePluginsService.geolocationData.latitude,
        this.nativePluginsService.geolocationData.longitude
      );
    }
  }

  getCurrentPosition() {
    this.nativePluginsService.getCurrentLocation();
    this.getPrayerTimes(
      this.nativePluginsService.geolocationData.latitude,
      this.nativePluginsService.geolocationData.longitude
    );
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

    const fajrTime = moment(prayerTimes.fajr).format('HH:mm');
    const sunriseTime = moment(prayerTimes.sunrise).format('HH:mm');
    const dhuhrTime = moment(prayerTimes.dhuhr).format('HH:mm');
    const asrTime = moment(prayerTimes.asr).format('HH:mm');
    const maghribTime = moment(prayerTimes.maghrib).format('HH:mm');
    const ishaTime = moment(prayerTimes.isha).format('HH:mm');

    const sunnahTimes = new adhan.SunnahTimes(prayerTimes);
    const middleOfTheNight = moment(sunnahTimes.middleOfTheNight).format(
      'HH:mm'
    );
    const lastThirdOfTheNight = moment(sunnahTimes.lastThirdOfTheNight).format(
      'HH:mm'
    );

    const current = prayerTimes.currentPrayer();
    const next = prayerTimes.nextPrayer();
    const nextPrayerTime = prayerTimes.timeForPrayer(next);

    this.prayertimes = {
      fajr: fajrTime,
      sunrise: sunriseTime,
      dhuhr: dhuhrTime,
      asr: asrTime,
      maghrib: maghribTime,
      isha: ishaTime,
      middleOfTheNight,
      lastThirdOfTheNight,
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
}
