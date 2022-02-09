import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
export class QuranResponseData {
  result: any;
}
@Injectable({
  providedIn: 'root',
})
export class QuranService {
  words: any;
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

  getSuraWordsByPage(page) {
    this.showLoader = true;
    this.apiService
      .getData(`${this.quranAPI}/page/wbw?index=${page}`)
      .subscribe((response) => {
        this.words = response;
        this.showLoader = false;
      });
  }

  getWordsBySura(sura) {
    return this.http.get(`${this.quranAPI}/page/wbw?index=${sura}`);
  }

  getListOfSura() {
    return this.apiService.getData(`assets/db/quran/surahs.json`);
  }

  getAyah(pageNumber) {
    return this.http.get(`${this.quranAPI}/aya?index=${pageNumber}`);
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
}
