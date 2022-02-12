import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../shared/api.service';
const quranTranslation = require('@kmaslesa/quran-translation-bs_korkut');
const quranAyats = require('@kmaslesa/quran-ayats');
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
  qari = 'https://dl.salamquran.com/ayat/afasy-murattal-192/';
  quranAPI = 'https://salamquran.com/en/api/v6'; //https://salamquran.com/api/v6/doc

  constructor(private http: HttpClient, private apiService: ApiService) {
    const page = localStorage.getItem('currentPage');
    if (page != null) {
      this.currentPage = +page;
    } else {
      localStorage.setItem('currentPage', JSON.stringify(1));
      this.currentPage = 1;
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
    return this.apiService.getData(`assets/db/quran/surahs.json`);
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
}
