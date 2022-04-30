import { Injectable } from '@angular/core';

enum LocalStorageKeys {
  showArabicTextInTranslation = 'showArabicTextInTranslation'
}
@Injectable({providedIn: 'root'})
export class SettingsService {
  showArabicTextInTranslation: boolean;
  nightMode = false;

  constructor() {
    const showArabicTextInTranslationFromStorage = localStorage.getItem(LocalStorageKeys.showArabicTextInTranslation);
    if(showArabicTextInTranslationFromStorage){
      this.showArabicTextInTranslation = JSON.parse(showArabicTextInTranslationFromStorage);
    }
    else {
      this.showArabicTextInTranslation = true;
    }
   }

   showArabicTextInTranslationChanged(value: boolean){
    this.showArabicTextInTranslation = value;
    localStorage.setItem(LocalStorageKeys.showArabicTextInTranslation, JSON.stringify(this.showArabicTextInTranslation));
  }
}
