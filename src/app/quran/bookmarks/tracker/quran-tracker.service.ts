import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Sura, SuraQuranTracker } from '../../quran.models';
import { QuranService } from '../../quran.service';
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
  isCurrentPageCompleted: boolean;

  constructor(private quranService: QuranService, private toastController: ToastController) {
    this.quranService.currentPageChanged.subscribe(completed => {
      if(completed) {
        this.isCurrentPageCompleted = this.isPageCompleted(this.quranService.currentPage);
      }
    });
    const completedPagesFromStorage = localStorage.getItem(
      LocalStorageKeys.completedPages
    );
    const suraListFromStorage = localStorage.getItem(LocalStorageKeys.suraList);
    if (completedPagesFromStorage) {
      this.completedPages = JSON.parse(completedPagesFromStorage);
    }
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
      this.presentToast(`Uspješno ste označili stranicu ${page} kao pročitanu`);
    } else {
      this.presentToast(`Uspješno ste označili stranicu ${page} kao nepročitanu`);
      this.completedPages = this.completedPages.filter((item) => item !== page);
    }
    this.updateSuraList();
    this.isCurrentPageCompleted = this.isPageCompleted(this.quranService.currentPage);
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

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}
