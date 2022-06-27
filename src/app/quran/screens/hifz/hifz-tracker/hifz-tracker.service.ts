import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Sura } from '../../../shared/quran.models';
const quranMetaData = require('@kmaslesa/quran-metadata');
const quranAyats = require('@kmaslesa/quran-ayats');
export enum LocalStorageKeys {
  suraList = 'suraListHifzTracker'
}
@Injectable({
  providedIn: 'root'
})
export class HifzTrackerService {
  suraList: any[] = [];

  constructor() {
    const suraListFromStorage = localStorage.getItem(LocalStorageKeys.suraList);
    if(suraListFromStorage) {
      this.suraList = JSON.parse(suraListFromStorage);
    }
    else {
      this.getSuraList().subscribe(suraList => {
        suraList.forEach(sura => {
          this.suraList.push({
            name: sura.name.bosnianTranscription + ' - ' + sura.name.bosnian,
            index: sura.index,
            numberOfAyas: sura.numberOfAyas,
            learnedAyahs: 0});
        });
      });
      this.storeSuraList();
    }
   }

   storeSuraList() {
     localStorage.setItem(LocalStorageKeys.suraList, JSON.stringify(this.suraList));
   }

  public getSuraList(): Observable<Sura[]> {
    return of(quranMetaData.getSuraList());
  }

  public getAyahsBySura(sura) {
    return of(quranAyats.getAyatsBySura(sura));
  }

  public getNumberOfLearnedSurahs() {
    let counter = 0;
    this.suraList.forEach(sura => {
      if(sura.numberOfAyas === sura.learnedAyahs) {
        counter++;
      }
    });
    return counter;
  }
}
