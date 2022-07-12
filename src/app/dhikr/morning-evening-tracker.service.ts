import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export enum DhikrType {
  morningDhikr,
  eveningDhikr,
  dhikrBeforeSleeping,
}
@Injectable({ providedIn: 'root' })
export class MorningEveningTrackerService {
  localStorageKeyMorningDhikr: string;
  localStorageKeyEveningDhikr: string;
  localStorageKeyDhikrBeforeSleeping: string;
  morningDhikrsFromStorage = [];
  eveningDhikrsFromStorage = [];
  dhikrBeforeSleepingFromStorage = [];
  currentDate: Date;
  morningAndEveningDhikr = [
    {
      id: 1,
      counter: 0,
      recitate: 1
    },
    {
      id: 2,
      counter: 0,
      recitate: 3
    },
    {
      id: 3,
      counter: 0,
      recitate: 3
    },
    {
      id: 4,
      counter: 0,
      recitate: 7
    },
    {
      id: 5,
      counter: 0,
      recitate: 1
    },
    {
      id: 14,
      counter: 0,
      recitate: 1
    },
    {
      id: 15,
      counter: 0,
      recitate: 1
    },
    {
      id: 16,
      counter: 0,
      recitate: 10
    },
    {
      id: 17,
      counter: 0,
      recitate: 100
    },
    {
      id: 18,
      counter: 0,
      recitate: 100
    }
  ];
  morningDhikr = [
    {
      id: 6,
      counter: 0,
      recitate: 1
    },
    {
      id: 7,
      counter: 0,
      recitate: 1
    },
    {
      id: 8,
      counter: 0,
      recitate: 1
    },
    {
      id: 9,
      counter: 0,
      recitate: 3
    }
  ];
  eveningDhikr = [
    {
      id: 10,
      counter: 0,
      recitate: 3
    },
    {
      id: 11,
      counter: 0,
      recitate: 1
    },
    {
      id: 12,
      counter: 0,
      recitate: 1
    },
    {
      id: 13,
      counter: 0,
      recitate: 1
    }
  ];
  dhikrBeforeSleeping = [
    {
      id: 19,
      counter: 0,
      recitate: 1
    },
    {
      id: 20,
      counter: 0,
      recitate: 1
    },
    {
      id: 21,
      counter: 0,
      recitate: 1
    },
    {
      id: 22,
      counter: 0,
      recitate: 1
    },
    {
      id: 23,
      counter: 0,
      recitate: 33
    },
    {
      id: 24,
      counter: 0,
      recitate: 33
    },
    {
      id: 25,
      counter: 0,
      recitate: 34
    },
    {
      id: 26,
      counter: 0,
      recitate: 1
    },
    {
      id: 27,
      counter: 0,
      recitate: 1
    },
    {
      id: 30,
      counter: 0,
      recitate: 3
    },
    {
      id: 31,
      counter: 0,
      recitate: 1
    },
    {
      id: 32,
      counter: 0,
      recitate: 1
    },
  ];

  constructor() {
    this.morningDhikr.push(...this.morningAndEveningDhikr);
    this.eveningDhikr.push(...this.morningAndEveningDhikr);

    this.currentDate = new Date();
    const monthAndYear =
      (this.currentDate.getMonth() + 1).toString() +
      '.' +
      this.currentDate.getFullYear().toString();

    this.localStorageKeyMorningDhikr = 'morningDhikr ' + monthAndYear;
    this.localStorageKeyEveningDhikr = 'eveningDhikr ' + monthAndYear;
    this.localStorageKeyDhikrBeforeSleeping = 'beforeSleeping ' + monthAndYear;

    this.getMonthlyMorningDhikrFromLocalStorage();
    this.getMonthlyEveningDhikrFromLocalStorage();
    this.getMonthlyDhikrBeforeSleepingFromLocalStorage();

    this.clearLocalStorageExpiredData();
  }

  getMonthlyEveningDhikrFromLocalStorage() {
    const eveningDhikrFromStorage = localStorage.getItem(
      this.localStorageKeyEveningDhikr
    );
    if (eveningDhikrFromStorage) {
      this.eveningDhikrsFromStorage = JSON.parse(eveningDhikrFromStorage);
    } else {
      this.setInitailValuesForDhikrForCurrentMonth(false, true, false);
    }
  }

  getDhikrForTrackerByMonthAndDhikrID(key, month, dhikrID) {
    const localStorageKey = key +' ' +month + '.' + this.currentDate.getFullYear().toString();
    const dhikrByMonthFromStorage = localStorage.getItem(localStorageKey);
    const dhikrs = [];
    const dates = [];
    let recitate;
    let dhikrsByDate;
    if(dhikrByMonthFromStorage) {
      dhikrsByDate = JSON.parse(dhikrByMonthFromStorage);

      dhikrsByDate.forEach((item) => {
        dates.push(item.date);
        item.dhikrs.forEach((dhikr) => {
          if (dhikr.id === dhikrID) {
            dhikrs.push(dhikr);
            recitate = dhikr.recitate;
          }
        });
      });
    }

    const obj = {
      labels: dates,
      data: dhikrs.map((item) => item.counter),
      recitate
    };
    return obj;
  }

  getMonthlyMorningDhikrFromLocalStorage() {
    const morningDhikrFromStorage = localStorage.getItem(
      this.localStorageKeyMorningDhikr
    );
    if (morningDhikrFromStorage) {
      this.morningDhikrsFromStorage = JSON.parse(morningDhikrFromStorage);
    } else {
      this.setInitailValuesForDhikrForCurrentMonth(true, false, false);
    }
  }

  getMonthlyDhikrBeforeSleepingFromLocalStorage() {
    const dhikrBeforeSleepingFromStorage = localStorage.getItem(
      this.localStorageKeyDhikrBeforeSleeping
    );
    if (dhikrBeforeSleepingFromStorage) {
      this.dhikrBeforeSleepingFromStorage = JSON.parse(dhikrBeforeSleepingFromStorage);
    } else {
      this.setInitailValuesForDhikrForCurrentMonth(false, false, true);
    }
  }

  setInitailValuesForDhikrForCurrentMonth(
    morningDhikrs = false,
    eveningDhikrs = false,
    beforeSleeping = false
  ) {
    for (
      let i = new Date().getDate();
      i <= this.getDaysNumberOfCurrentMonth();
      i++
    ) {
      const date = this.getCurrentDateAsString(new Date(new Date().setDate(i)));
      if (morningDhikrs) {
        this.morningDhikrsFromStorage.push({
          date,
          total: 0,
          dhikrs: JSON.parse(JSON.stringify(this.morningDhikr)),
        });
      }
      if (eveningDhikrs) {
        this.eveningDhikrsFromStorage.push({ date, total: 0, dhikrs:JSON.parse(JSON.stringify(this.eveningDhikr)) });
      }
      if(beforeSleeping) {
        this.dhikrBeforeSleepingFromStorage.push({ date, total: 0, dhikrs:JSON.parse(JSON.stringify(this.dhikrBeforeSleeping)) });
      }
    }
    if (morningDhikrs) {
      localStorage.setItem(
        this.localStorageKeyMorningDhikr,
        JSON.stringify(this.morningDhikrsFromStorage)
      );
    }
    if (eveningDhikrs) {
      localStorage.setItem(
        this.localStorageKeyEveningDhikr,
        JSON.stringify(this.eveningDhikrsFromStorage)
      );
    }
    if(beforeSleeping) {
      localStorage.setItem(
        this.localStorageKeyDhikrBeforeSleeping,
        JSON.stringify(this.dhikrBeforeSleepingFromStorage)
      );
    }
  }

  increaseCounterForMorningDhikr(dhikr) {
    this.morningDhikrsFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        item.dhikrs.forEach((element) => {
          if (element.id === dhikr.id) {
            element.counter++;
          }
        });
      }
    });
    localStorage.setItem(
      this.localStorageKeyMorningDhikr,
      JSON.stringify(this.morningDhikrsFromStorage)
    );
  }

  increaseCounterForDhikrBeforeSleeping(dhikr) {
    this.dhikrBeforeSleepingFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        item.dhikrs.forEach((element) => {
          if (element.id === dhikr.id) {
            element.counter++;
          }
        });
      }
    });
    localStorage.setItem(
      this.localStorageKeyDhikrBeforeSleeping,
      JSON.stringify(this.dhikrBeforeSleepingFromStorage)
    );
  }

  setTotalCounterForMorningDhikr() {
    this.morningDhikrsFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        item.total++;
      }
    });
    localStorage.setItem(
      this.localStorageKeyMorningDhikr,
      JSON.stringify(this.morningDhikrsFromStorage)
    );
  }

  setTotalCounterForDhikrBeforeSleeping() {
    this.dhikrBeforeSleepingFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        item.total++;
      }
    });
    localStorage.setItem(
      this.localStorageKeyDhikrBeforeSleeping,
      JSON.stringify(this.dhikrBeforeSleepingFromStorage)
    );
  }

  getMorningDhikrsByMonth(month: string): Observable<any[]> {
    const localStorageKey = 'morningDhikr ' + month + '.' + this.currentDate.getFullYear().toString();
    const morningDhikrByMonthFromStorage = localStorage.getItem(localStorageKey);
    if(morningDhikrByMonthFromStorage) {
      return of(JSON.parse(morningDhikrByMonthFromStorage));
    }
    else {
      return of([]);
    }
  }

  getEveningDhikrsByMonth(month: string): Observable<any[]> {
    const localStorageKey = 'eveningDhikr ' + month + '.' + this.currentDate.getFullYear().toString();
    const eveningDhikrByMonthFromStorage = localStorage.getItem(localStorageKey);
    if(eveningDhikrByMonthFromStorage) {
      return of(JSON.parse(eveningDhikrByMonthFromStorage));
    }
    else {
      return of([]);
    }
  }

  getDhikrBeforeSleepingByMonth(month: string): Observable<any[]> {
    const localStorageKey = 'beforeSleeping ' + month + '.' + this.currentDate.getFullYear().toString();
    const dhikrBeforeSleepingByMonthFromStorage = localStorage.getItem(localStorageKey);
    if(dhikrBeforeSleepingByMonthFromStorage) {
      return of(JSON.parse(dhikrBeforeSleepingByMonthFromStorage));
    }
    else {
      return of([]);
    }
  }

  getTodaysMorningDhikrCounters(): Observable<any[]> {
    let result = [];
    this.morningDhikrsFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        result = item.dhikrs;
        return of(result);
      }
    });
    return of(result);
  }

  getTodaysEveningDhikrCounters(): Observable<any[]> {
    let result = [];
    this.eveningDhikrsFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        result = item.dhikrs;
        return of(result);
      }
    });
    return of(result);
  }

  getTodaysDhikrBeforeSleepingCounters(): Observable<any[]> {
    let result = [];
    this.dhikrBeforeSleepingFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        result = item.dhikrs;
        return of(result);
      }
    });
    return of(result);
  }

  //evening dhikr
  increaseCounterForEveningDhikr(dhikr) {
    this.eveningDhikrsFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        item.dhikrs.forEach((element) => {
          if (element.id === dhikr.id) {
            element.counter++;
          }
        });
      }
    });
    localStorage.setItem(
      this.localStorageKeyEveningDhikr,
      JSON.stringify(this.eveningDhikrsFromStorage)
    );
  }

  setTotalCounterForEveningDhikr() {
    this.eveningDhikrsFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        item.total++;
      }
    });
    localStorage.setItem(
      this.localStorageKeyEveningDhikr,
      JSON.stringify(this.eveningDhikrsFromStorage)
    );
  }

  clearLocalStorageExpiredData() {
    // eslint-disable-next-line guard-for-in
    for (const key in localStorage) {
      if (
        key.indexOf('morningDhikr') !== -1 ||
        key.indexOf('eveningDhikr') !== -1
      ) {
        if (key.indexOf(new Date().getFullYear().toString()) === -1) {
          //not found
          console.log(key);
          localStorage.removeItem(key);
        }
      }
    }
  }

  getCurrentDateAsString(date: Date) {
    return (
      date.getDate().toString() +
      '.' +
      (date.getMonth() + 1).toString() +
      '.' +
      date.getFullYear().toString()
    );
  }

  getDaysNumberOfCurrentMonth() {
    const currentMonth = new Date().getMonth() + 1;
    let numberOfDaysInCurrentMonth;
    if (
      currentMonth === 1 ||
      currentMonth === 3 ||
      currentMonth === 5 ||
      currentMonth === 7 ||
      currentMonth === 8 ||
      currentMonth === 10 ||
      currentMonth === 12
    ) {
      numberOfDaysInCurrentMonth = 31;
    } else if (
      currentMonth === 4 ||
      currentMonth === 6 ||
      currentMonth === 9 ||
      currentMonth === 11
    ) {
      numberOfDaysInCurrentMonth = 30;
    } else if (currentMonth === 2) {
      numberOfDaysInCurrentMonth = 28;
    }
    return numberOfDaysInCurrentMonth;
  }
}
