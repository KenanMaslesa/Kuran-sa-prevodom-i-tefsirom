import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../shared/api.service';
import { Juz, Sura, Tafsir } from './quran.models';
const tefsir = require('@kmaslesa/tefsir');
const quranMetaData = require('@kmaslesa/quran-metadata');
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
  currentPage = 0;
  currentPageChanged = new Subject();
  currentPageForCaching: number;
  qari = '64/ar.aymanswoaid';
  quranAPI = 'https://salamquran.com/en/api/v6'; //https://salamquran.com/api/v6/doc
  qariList = [
    {
      identifier: '64/ar.aymanswoaid',
      language: 'ar',
      name: 'أيمن سويد',
      englishName: 'Ayman Sowaid',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '64/ar.abdulbasitmurattal',
      language: 'ar',
      name: 'عبد الباسط عبد الصمد المرتل',
      englishName: 'Abdul Basit',
      format: 'audio',
      type: 'translation',
      direction: null
    },
    {
      identifier: '64/ar.abdullahbasfar',
      language: 'ar',
      name: 'عبد الله بصفر',
      englishName: 'Abdullah Basfar',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '64/ar.abdurrahmaansudais',
      language: 'ar',
      name: 'عبدالرحمن السديس',
      englishName: 'Abdurrahmaan As-Sudais',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '64/ar.abdulsamad',
      language: 'ar',
      name: 'عبدالباسط عبدالصمد',
      englishName: 'Abdul Samad',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '128/ar.shaatree',
      language: 'ar',
      name: 'أبو بكر الشاطري',
      englishName: 'Abu Bakr Ash-Shaatree',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '128/ar.ahmedajamy',
      language: 'ar',
      name: 'أحمد بن علي العجمي',
      englishName: 'Ahmed ibn Ali al-Ajamy',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '128/ar.alafasy',
      language: 'ar',
      name: 'مشاري العفاسي',
      englishName: 'Alafasy',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '64/ar.hanirifai',
      language: 'ar',
      name: 'هاني الرفاعي',
      englishName: 'Hani Rifai',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '128/ar.husary',
      language: 'ar',
      name: 'محمود خليل الحصري',
      englishName: 'Husary',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '128/ar.husarymujawwad',
      language: 'ar',
      name: 'محمود خليل الحصري (المجود)',
      englishName: 'Husary (Mujawwad)',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '128/ar.hudhaify',
      language: 'ar',
      name: 'علي بن عبدالرحمن الحذيفي',
      englishName: 'Hudhaify',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '128/ar.mahermuaiqly',
      language: 'ar',
      name: 'ماهر المعيقلي',
      englishName: 'Maher Al Muaiqly',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '128/ar.minshawi',//128
      language: 'ar',
      name: 'محمد صديق المنشاوي',
      englishName: 'Minshawi',
      format: 'audio',
      type: 'translation',
      direction: null
    },
    {
      identifier: '64/ar.minshawimujawwad',
      language: 'ar',
      name: 'محمد صديق المنشاوي (المجود)',
      englishName: 'Minshawy (Mujawwad)',
      format: 'audio',
      type: 'translation',
      direction: null
    },
    {
      identifier: '128/ar.muhammadayyoub', //128
      language: 'ar',
      name: 'محمد أيوب',
      englishName: 'Muhammad Ayyoub',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '128/ar.muhammadjibreel',//128
      language: 'ar',
      name: 'محمد جبريل',
      englishName: 'Muhammad Jibreel',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    },
    {
      identifier: '64/ar.saoodshuraym',
      language: 'ar',
      name: 'سعود الشريم',
      englishName: 'Saood bin Ibraaheem Ash-Shuraym',
      format: 'audio',
      type: 'versebyverse',
      direction: null
    }
  ];

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.setCurrentPageForCaching();
    const page = localStorage.getItem('currentPage');
    if (page != null) {
      this.setCurrentPage(+page);
    } else {
      this.setCurrentPage(1);
    }
    this.currentPageChanged.next(true);
    const qari = localStorage.getItem('qari');
    if(qari){
      this.qari = qari;
    }
  }

  setCurrentPage(pageNumber: number){
    if(pageNumber >= 1 && pageNumber <= 604){
      this.currentPage = +pageNumber;
    }
    else {
      this.currentPage = 1;
    }
    localStorage.setItem('currentPage', JSON.stringify(+this.currentPage));
  }

  setCurrentPageForCaching() {
    const currentPageForCachingFromStore = localStorage.getItem('currentPageForCaching');
    if(currentPageForCachingFromStore != null) {
      this.currentPageForCaching = +currentPageForCachingFromStore;
    }
    else {
      this.currentPageForCaching = 1;
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

  changeQari(qariIdentifier: string){
    localStorage.setItem('qari', qariIdentifier);
    this.qari = qariIdentifier;
  }

  cacheAllQuranPages() {
    if(this.currentPageForCaching <= 604){
      return this.apiService.getData(`${this.quranAPI}/page/wbw?index=${this.currentPageForCaching}`).subscribe(response => {
        console.log(`${this.currentPageForCaching}. stranica kesirana`);
        if(this.currentPageForCaching > 604){
          return;
        }
        else {
          this.cacheAllQuranPages();
          localStorage.setItem('currentPageForCaching', JSON.stringify(this.currentPageForCaching));
          this.currentPageForCaching += 1;
        }
      }, error => {
        console.log(`${this.currentPageForCaching}. stranica NIJE kesirana`);
        this.cacheAllQuranPages();
      });
    }
    else {
      console.log('Pages are already cached');
    }
  }

  // setCurrentSuraTitle(page) {
  //   if (this.suraList) {
  //     this.suraList.forEach((sura, index) => {
  //       if (
  //         parseInt(page, 10) >= parseInt(sura.startpage, 10) &&
  //         parseInt(page, 10) <= parseInt(sura.endpage, 10)
  //       ) {
  //         return `${index + 1}. ${sura.name} - ${sura.tname}`;
  //       }
  //     });
  //   }
  // }

  //tafsir
  getTafsirAndTranslationForPage(page): Observable<Tafsir>{
    return of(tefsir.getTafsirAndTranslationForPage(page));
  }

  getNumberOfAyahsByPage(page): Observable<number>{
    return of(tefsir.getNumberOfAyahsByPage(page));
  }

  getTafsirAndTranslationForSura(suraId: number): Observable<any> {
    return of(tefsir.getTafsirAndTranslationForSura(+suraId));
  }

  //metadata
  getSuraList(): Observable<Sura[]> {
    return of(quranMetaData.getSuraList());
  }

  getSuraListPublishedInMekka(): Observable<Sura[]> {
    return of(quranMetaData.getSuraListPublishedInMekka());
  }

  sortSuraListByFirstPublished(): Observable<Sura[]> {
    return of(quranMetaData.sortSuraListByFirstPublished());
  }

  sortSuraListByLastPublished(): Observable<Sura[]> {
    return of(quranMetaData.sortSuraListByLastPublished());
  }

  getSuraListPublishedInMedina(): Observable<Sura[]> {
    return of(quranMetaData.getSuraListPublishedInMedina());
  }

  searchSuraByBosnianName(searchTerm: string): Observable<Sura[]> {
    return of(quranMetaData.searchSuraByBosnianName(searchTerm));
  }

  getJuzList(): Observable<Juz[]> {
    return of(quranMetaData.getJuzList());
  }

  searchJuzListById(id): Observable<Juz[]> {
    return of(quranMetaData.searchJuzListById(id));
  }

  getAllQuranWords(): Observable<any> {
    return this.http.get('assets/quran-words-with-audio-index-charType.json');
  }

  getQuranForPageWordByWord(page): Observable<any> {
    return this.http.get(`https://salamquran.com/en/api/v6/page/wbw?index=${page}`);
  }


}
