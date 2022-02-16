import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../shared/api.service';
const quranTranslation = require('@kmaslesa/quran-translation-bs_korkut');
const quranAyats = require('@kmaslesa/quran-ayats');
const tefsir = require('@kmaslesa/tefsir');
export class QuranResponseData {
  result: any;
}
@Injectable({
  providedIn: 'root',
})
export class QuranService {
  words: any;
  showHeaderAndTabs = true;
  showLoader = false;
  currentPage: number;
  currentPageChanged = new Subject();
  qari = 'https://dl.salamquran.com/ayat/afasy-murattal-192/';
  quranAPI = 'https://salamquran.com/en/api/v6'; //https://salamquran.com/api/v6/doc
  suraList = [];

  constructor(private http: HttpClient, private apiService: ApiService) {
    const page = localStorage.getItem('currentPage');
    if (page != null) {
      this.currentPage = +page;
    } else {
      localStorage.setItem('currentPage', JSON.stringify(1));
      this.currentPage = 1;
    }
    if(this.currentPage < 1 || this.currentPage > 604){
      this.currentPage = 1;
    }
    this.currentPageChanged.next(true);
    const qari = localStorage.getItem('qari');
    if(qari){
      this.qari = qari;
    }
  }

  getSura(sura) {
    return this.http.get(`${this.quranAPI}/v6/sura?index=${sura}`).pipe();
  }

  getSuraWordsByPage(page): Observable<any> {
    this.showLoader = true;
    return this.apiService
      .getData(`${this.quranAPI}/page/wbw?index=${page}`);
  }

  getWordsBySura(sura) {
    return this.http.get(`${this.quranAPI}/page/wbw?index=${sura}`);
  }

  getListOfSura() {
    return this.apiService.getData(`assets/db/quran/surahs.json`).pipe(
      map(response=> {
        this.suraList = response;
        return response;
      })
    );
  }

  getAyatsByPage(pageNumber) {
    return quranAyats.getAyatsByPage(pageNumber);
  }

  changeQariUrl(url: string) {
    return url.replace(
      'https://dl.salamquran.com/ayat/afasy-murattal-192/',
      this.qari
    );
  }

  setQariUrl(url: string){
    localStorage.setItem('qari', url);
    this.qari = url;
  }

  cacheAllQuranPages(page) {
    this.apiService.getData(`${this.quranAPI}/page/wbw?index=${page}`).subscribe();
  }

  getNumberOfLettersAndWordsPerPage() {
    return this.apiService.getData(`assets/db/quran/lettersPerPage.json`);
  }

  getTranslation() {
    return quranTranslation.getHolyQuranTranslation();
  }

  getTranslationForIndex(index){
   return quranTranslation.getIndexTranslation(index);
  }

  getJuzs() {
    return this.apiService.getData(`assets/db/quran/juzs.json`);
  }

  setCurrentSuraTitle(page) {
    if (this.suraList) {
      this.suraList.forEach((sura, index) => {
        if (
          parseInt(page, 10) >= parseInt(sura.startpage, 10) &&
          parseInt(page, 10) <= parseInt(sura.endpage, 10)
        ) {
          return `${index + 1}. ${sura.name} - ${sura.tname}`;
        }
      });
    }
  }

  getTafsirAndTranslationForPage(page){
    return tefsir.getTafsirAndTranslationForPage(page);
  }
}
