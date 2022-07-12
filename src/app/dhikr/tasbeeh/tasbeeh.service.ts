import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TasbeehService {
  selectedDhikr: any;
  dhikrs = [
    {
      arabic: 'لَٓا إِلٰهَ إِلَّا اللّٰهُ',
      bosnian: 'Nema boga osim Allaha',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'سُبْحَانَ اللَّهِ',
      bosnian: 'Slavljen neka je Allah',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'الْحَمْدُ لِلَّهِ',
      bosnian: 'Hvala Allahu',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'اللَّهُ أَكْبَرُ',
      bosnian: 'Allah je najveći',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
      bosnian: 'Allahu moj oprosti mi',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'اللَّهُــمَّ صَلِّ وَسَـــلِّمْ على نَبِيِّنَـــا مُحمَّد',
      bosnian: 'O Allahu, blagoslovi našeg poslanika Muhammeda ﷺ',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِه',
      bosnian: 'Slavljen neka je Allah i Njemu pripada sva hvala',
      counter: 0,
      favorite: false,
    },
    {
      arabic:
        'لا إِلَهَ إِلاّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِير',
      bosnian:
        'Nema boga osim Allaha, Jedinoga, Koji druga nema. Njemu pripada vlast nad svim i sva pohvala. On sve može.',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِیْمَ',
      bosnian: 'Molim oprost od Svemogućeg Allaha',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'لَٓا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ',
      bosnian: 'Nema snage niti moći osim kod Allaha',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'لَٓا إِلَهَ إِلّاَ اللّٰهُ مُحَمَّدٌ رَسُوْلُ اللّٰهِ',
      bosnian: 'Nema boga osim Allaha, Muhammed je Njegov Poslanik',
      counter: 0,
      favorite: false,
    },
    {
      arabic: 'سُبْحَانَ اللّٰهِ وَ بِحَمْدِهِ ، سُبْحَانَ اللّٰهِ الْعَظِيْمِ',
      bosnian: 'Neka je slavljen i hvaljen Uzvišeni Allah, neka je slavljen Allah Veličanstveni',
      counter: 0,
      favorite: false,
    },
    {
      arabic:
        'سُبْحَانَ اللّٰهِ ، وَالْحَمْدُلِلّٰهِ ، وَ لَٓا إِلَهَ إِلّاَ اللّٰهُ ، وَ اللّٰهُ أَكْبَرُ',
      bosnian: 'Neka je slavljen i hvaljen Allah, nema boga osim Allaha, Allah je najveći',
      counter: 0,
      favorite: false,
    },
    {
      arabic:
        'لَٓا إِلَهَ إِلّاَ أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِيْنَ',
      bosnian: 'Nema boga, osim Tebe, hvaljen neka si, ja sam se zaista ogriješio prema sebi!',
      counter: 0,
      favorite: false,
    },
    {
      arabic:
        'أَسْتَغْفِرُ اللّٰهَ الْعَظِيْمَ الَّذِي لَٓا إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّوْمُ وَ أَتُوْبُ إِلَيْهِ',
      bosnian: 'Tražim oprosta od Tebe Uzvišeni Allahu, osim Kojeg drugog boga nema, Živog i Postojanog Održavatelja, i Tebi se kajem.',
      counter: 0,
      favorite: false,
    },
  ];
  localStorageKey: string;
  dhikrsFromStorage = [];
  currentDate: Date;
  constructor() {
    this.currentDate = new Date();
    this.localStorageKey = 'date '+(this.currentDate.getMonth()+1).toString() + '.' + this.currentDate.getFullYear().toString();
    this.selectedDhikr = { counter: 0 };
    this.getLocalStorageDhikr();
    this.clearLocalStorageExpiredData();
  }

  getLocalStorageDhikr() {
    const dhikrsFromStorage = localStorage.getItem(this.localStorageKey);
    if (dhikrsFromStorage) {
      this.dhikrsFromStorage = JSON.parse(dhikrsFromStorage);
      this.dhikrsFromStorage.filter((item) => {
        const currentDate = this.getCurrentDateAsString(new Date());
        if (item.date === currentDate) {
          this.dhikrs = JSON.parse(JSON.stringify(item.dhikrs));
        }
      });
    }
    if (this.dhikrsFromStorage.length === 0) {
        for(let i = new Date().getDate(); i <= this.getDaysNumberOfCurrentMonth(); i++) {
          const obj = {
            date: this.getCurrentDateAsString(new Date(new Date().setDate(i))),
            dhikrs: JSON.parse(JSON.stringify(this.dhikrs))
          };

          this.dhikrsFromStorage.push(obj);
        }
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.dhikrsFromStorage));
    }
  }
  clearLocalStorageExpiredData(){
    // eslint-disable-next-line guard-for-in
    for (const key in localStorage){
      if(key.indexOf('date') !== -1){
        if(key.indexOf(new Date().getFullYear().toString()) === -1){ //not found
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

  increaseCounter() {
    this.dhikrsFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        item.dhikrs.forEach(element => {
          if(element.arabic === this.selectedDhikr.arabic){
            element.counter ++;
          }
        });
      }
    });
    this.selectedDhikr.counter++;
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.dhikrsFromStorage));
    localStorage.setItem('selectedDhikr', JSON.stringify(this.selectedDhikr));
  }

  setSelectedDhikr(dhikr) {
    this.selectedDhikr = dhikr;
    localStorage.setItem('selectedDhikr', JSON.stringify(this.selectedDhikr));
  }

  resetCounter() {
    this.dhikrsFromStorage.forEach((item) => {
      if (item.date === this.getCurrentDateAsString(new Date())) {
        item.dhikrs.forEach(element => {
          if(element.arabic === this.selectedDhikr.arabic){
            element.counter = 0;
          }
        });
      }
    });
    this.selectedDhikr.counter = 0;
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.dhikrsFromStorage));
    localStorage.setItem('selectedDhikr', JSON.stringify(this.selectedDhikr));
  }

  getDhikrsByMonth(month: string) {
    const localStorageKey = 'date ' + month + '.' + this.currentDate.getFullYear().toString();
    const dhikrByMonthFromStorage = localStorage.getItem(localStorageKey);
    if(dhikrByMonthFromStorage) {
      return JSON.parse(dhikrByMonthFromStorage);
    }
    else {
      return [];
    }
  }

  getParticularDhikrByMonth(selectedDhikr: any, month: string) {
    const localStorageKey = 'date ' +month + '.' + this.currentDate.getFullYear().toString();
    const dhikrByMonthFromStorage = localStorage.getItem(localStorageKey);
    const dhikrs = [];
    const dates = [];
    let dhikrsByDate;
    if(dhikrByMonthFromStorage) {
      dhikrsByDate = JSON.parse(dhikrByMonthFromStorage);

      dhikrsByDate.forEach((item) => {
        dates.push(item.date);
        item.dhikrs.forEach((dhikr) => {
          if (dhikr.arabic === selectedDhikr.arabic) {
            dhikrs.push(dhikr);
          }
        });
      });
    }

    const obj = {
      labels: dates,
      data: dhikrs.map((item) => item.counter),
    };
    return obj;
  }

  getMonthFromDate(date: string) {
    const month = date.split('.')[1];
    return month;
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
