import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SettingsService {
  dailyVird: number;

  constructor() {
    const dailyVirdFromStorage = localStorage.getItem('dailyVird');
    if(dailyVirdFromStorage){
      this.dailyVird = JSON.parse(dailyVirdFromStorage);
    }
    else {
      this.dailyVird = null;
    }
   }

  dailyVirdChanged(value){
    this.dailyVird = +value;
    localStorage.setItem('dailyVird', JSON.stringify(this.dailyVird));
  }
}
