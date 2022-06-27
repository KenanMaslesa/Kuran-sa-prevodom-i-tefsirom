import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Sura, SuraQuranTracker } from '../../../shared/quran.models';
import { QuranService } from '../../../shared/services/quran.service';
import { SettingsService } from '../../settings/settings.service';
const quranMetaData = require('@kmaslesa/quran-metadata');
export enum LocalStorageKeys {
  suraList = 'suraListQuranTracker',
  completedPages = 'completedPagesQuranTracker',
}
@Injectable({
  providedIn: 'root',
})
export class QuranTrackerService {
  suraList: SuraQuranTracker[] = [];
  completedPages: number[] = [];
  todaysCompletedPages: number[] = [];
  todaysCompletedPagesLocalStorageKey: string;
  isCurrentPageCompleted: boolean;
  trackingMinutes = 0;
  trackingMinutesInterval: NodeJS.Timeout;

  constructor(private quranService: QuranService, private toastController: ToastController, private settingsService: SettingsService) {
    this.initTodaysTrackerData();
    this.initStream();

    //set isCurrentPageCompleted on Quran page changed
    this.quranService.currentPageChanged.subscribe(completed => {
      if(completed) {
        this.isCurrentPageCompleted = this.isPageCompleted(this.quranService.currentPage);
      }
    });
  }

  initStream() {
    const completedPagesFromStorage = localStorage.getItem(
      LocalStorageKeys.completedPages
    );
    if (completedPagesFromStorage) {
      this.completedPages = JSON.parse(completedPagesFromStorage);
    }

    const suraListFromStorage = localStorage.getItem(LocalStorageKeys.suraList);
    if (suraListFromStorage) {
      this.suraList = JSON.parse(suraListFromStorage);
    } else {
      this.getSuraList().subscribe((suraList) => {
        suraList.forEach((sura) => {
          this.suraList.push({
            name: sura.name.bosnianTranscription + ' - ' + sura.name.bosnian,
            index: sura.index,
            startPage: sura.startPage,
            endPage: sura.endPage,
            totalPages: sura.totalPages,
            completedPages: 0,
            pages: this.getSuraPagesArray(sura.startPage, sura.endPage)
          });
        });
      });
      this.storeSuraList();
    }
  }

  getSuraPagesArray(from, to) {
    const array = [];
    for(let i = from; i <= to; i++)  {
      array.push({page: i, completed: false});
    }
    return array;
  }

  storeSuraList() {
    localStorage.setItem(
      LocalStorageKeys.suraList,
      JSON.stringify(this.suraList)
    );
  }

  saveCompletedPages() {
    localStorage.setItem(
      LocalStorageKeys.completedPages,
      JSON.stringify(this.completedPages)
    );
      this.saveTodaysTrackerData();
  }

  public getSuraList(): Observable<Sura[]> {
    return of(quranMetaData.getSuraList());
  }

  public getNumberOfCompletedPages() {
    let counter = 0;
    this.suraList.forEach((sura) => {
      if (sura.totalPages === sura.completedPages) {
        counter++;
      }
    });
    return counter;
  }

  addOrRemovePage(add: boolean, page: number) {
    if (add) {
      this.completedPages.push(page);
      this.todaysCompletedPages.push(page);
      this.presentToast(`Uspješno ste označili stranicu ${page} kao pročitanu`);
      this.showTrackerMessages();
    } else {
      this.presentToast(`Uspješno ste označili stranicu ${page} kao nepročitanu`);
      this.completedPages = this.completedPages.filter((item) => item !== page);
      this.todaysCompletedPages = this.todaysCompletedPages.filter((item) => item !== page);;

    }
    this.updateSuraList();
    this.isCurrentPageCompleted = this.isPageCompleted(this.quranService.currentPage);
  }

  showTrackerMessages() {
    if(this.todaysCompletedPages.length === this.settingsService.dailyVirdPagesNumber) {
      this.presentToast(
        `Mašallah! Uspješno ste završili svoj dnevni vird!`,
        5000
      );
    }
    if(this.todaysCompletedPages.length > this.settingsService.dailyVirdPagesNumber) {
      const numberOf = this.todaysCompletedPages.length -
      this.settingsService.dailyVirdPagesNumber;
      this.presentToast(
        `Allahu ekber! Danas ste proučili ${
          numberOf
        } ${this.getRightTrackingPartOfMessage(numberOf)} više od svog dnevnog virda`,
        2000
      );
    }
  }

  getRightTrackingPartOfMessage(page) {
    if(page === 1) {
      return 'stranicu';
    }
    else if (page > 1 && page <5) {
      return 'stranice';
    }
    else if (page >= 5) {
      return 'stranica';
    }
  }

  updateSuraList() {
    this.suraList.forEach((sura) => {
      sura.completedPages = 0;
      sura.pages.forEach(pageObj => {
        pageObj.completed = false;
        if (this.completedPages.includes(pageObj.page)) {
          pageObj.completed = true;
          sura.completedPages++;
        }
      });
    });
    this.storeSuraList();
    this.saveCompletedPages();
  }

  saveOrDeleteCompletedPages(save: boolean, suraIndex) {
    this.suraList.forEach((sura) => {
      if (sura.index === suraIndex) {
        if (save) {
          sura.completedPages++;
        } else {
          sura.completedPages--;
        }
      }
    });
    this.storeSuraList();
  }

  isPageCompleted(page: number): boolean {
    return this.completedPages.includes(page);
  }

  async presentToast(message, duration = 1000) {
    const toast = await this.toastController.create({
      message,
      duration,
    });
    toast.present();
  }

  //todays tracker
  clearExpiredTodaysTrackerData() {
    for (const key in localStorage) {
      if (key.indexOf('todaysCompletedPages') !== -1) {
        if (key.indexOf(this.todaysCompletedPagesLocalStorageKey) === -1) {
          //not found
          localStorage.removeItem(key);
        }
      }
    }
  }

  initTodaysTrackerData() {
    this.todaysCompletedPagesLocalStorageKey = 'todaysCompletedPages ' + new Date().toDateString();

    this.clearExpiredTodaysTrackerData();

    const todaysCompletedPagesFromStorage = localStorage.getItem(
      this.todaysCompletedPagesLocalStorageKey
    );
    if(todaysCompletedPagesFromStorage) {
      this.todaysCompletedPages = JSON.parse(todaysCompletedPagesFromStorage);
    }
  }

  saveTodaysTrackerData() {
    localStorage.setItem(
      this.todaysCompletedPagesLocalStorageKey,
      JSON.stringify(this.todaysCompletedPages)
    );
  }

  resetTracker() {
    this.completedPages = [];
    this.updateSuraList();
  }
}
