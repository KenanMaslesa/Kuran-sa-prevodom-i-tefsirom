import { Injectable } from '@angular/core';

enum LocalStorageKeys {
  trackTimeSpendInApp = 'trackTimeSpendInApp'
}

@Injectable({
  providedIn: 'root',
})
export class TimeTrackingService {
  interval: NodeJS.Timeout;
  saveTimeInterval: NodeJS.Timeout;
  time: number;
  localStorageKey: string;
  trackTimeSpendInApp: boolean;

  constructor() {
    this.localStorageKey = 'todaysTimeTracking ' + new Date().toDateString();
    this.clearExpiredData();
    const timeFromStorage = localStorage.getItem(this.localStorageKey);
    if (timeFromStorage) {
      this.time = JSON.parse(timeFromStorage);
    } else {
      this.time = 0;
    }

    const trackTimeSpendInApp = localStorage.getItem(LocalStorageKeys.trackTimeSpendInApp);

    if(trackTimeSpendInApp) {
      this.trackTimeSpendInApp = JSON.parse(trackTimeSpendInApp);
    }
    else {
      this.trackTimeSpendInApp = false;
    }
  }

  trackTime() {
    this.interval = setInterval(() => {
      this.time += 1000;
      console.log('trackingMinutesInterval');
    }, 1000); //every second

    this.saveTimeInterval = setInterval(() => {
      console.log('saveTimeInterval');
      this.saveTime();
    }, 1000 * 60); //every minute
  }

  clearWatchCurrentTimeInterval() {
    clearInterval(this.interval);
    this.time = 0;
  }

  getCurrentTime() {
    return new Date(this.time).toISOString().slice(11, 19);
  }

  saveTime() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.time));
  }

  clearExpiredData() {
    for (const key in localStorage) {
      if (key.indexOf('todaysTimeTracking') !== -1) {
        if (key.indexOf(this.localStorageKey) === -1) {
          //not found
          localStorage.removeItem(key);
        }
      }
    }
  }

  trackTimeSpendInAppChanged() {
    localStorage.setItem(
      LocalStorageKeys.trackTimeSpendInApp,
      JSON.stringify(this.trackTimeSpendInApp)
    );
    if(this.trackTimeSpendInApp) {
      this.clearWatchCurrentTimeInterval();
      this.trackTime();
    }
    else {
      this.clearWatchCurrentTimeInterval();
    }
  }
}
