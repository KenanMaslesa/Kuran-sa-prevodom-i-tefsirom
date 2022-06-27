import { Injectable } from '@angular/core';

enum LocalStorageKeys {
  showArabicTextInTranslation = 'showArabicTextInTranslation',
  dailyVirdPagesNumber = 'dailyVirdPagesNumber',
  trackTimeSpendInApp = 'trackTimeSpendInApp'
}
@Injectable({providedIn: 'root'})
export class SettingsService {
  showArabicTextInTranslation: boolean;
  nightMode = false;
  dailyVirdPagesNumber: number;

  constructor() {
    const showArabicTextInTranslationFromStorage = localStorage.getItem(LocalStorageKeys.showArabicTextInTranslation);
    const dailyVirdPagesNumber = localStorage.getItem(LocalStorageKeys.dailyVirdPagesNumber);

    if(showArabicTextInTranslationFromStorage){
      this.showArabicTextInTranslation = JSON.parse(showArabicTextInTranslationFromStorage);
    }
    else {
      this.showArabicTextInTranslation = true;
    }

    if(dailyVirdPagesNumber) {
      this.dailyVirdPagesNumber = JSON.parse(dailyVirdPagesNumber);
    }
    else {
      this.dailyVirdPagesNumber = 5;
    }

   }

   showArabicTextInTranslationChanged(value: boolean){
    this.showArabicTextInTranslation = value;
    localStorage.setItem(LocalStorageKeys.showArabicTextInTranslation, JSON.stringify(this.showArabicTextInTranslation));
  }

  dailyVirdChanged() {
    if(!this.dailyVirdPagesNumber) {
      this.dailyVirdPagesNumber = 5;
    }
    localStorage.setItem(
      LocalStorageKeys.dailyVirdPagesNumber,
      JSON.stringify(this.dailyVirdPagesNumber)
    );
  }
}
