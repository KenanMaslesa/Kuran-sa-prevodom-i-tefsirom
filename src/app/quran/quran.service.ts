import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Juz, QuranWords, Sura, Tafsir, TafsirAyah } from './quran.models';
const tefsir = require('@kmaslesa/tefsir');
const quranMetaData = require('@kmaslesa/quran-metadata');
const quranWords = require('@kmaslesa/quran-word-by-word');
export class QuranResponseData {
  result: any;
}
@Injectable({
  providedIn: 'root',
})
export class QuranService {
  showHeaderAndTabs = true;
  showLoader = false;
  currentPage = 0;
  currentPageChanged = new Subject();
  qari = {
    value: '128/ar.alafasy',
    name: 'Mishhary Afasy'
  };
  qariList = [
    {
      identifier: '64/ar.aymanswoaid',
      englishName: 'Ayman Sowaid',
    },
    {
      identifier: '64/ar.abdulbasitmurattal',
      englishName: 'Abdul Basit',
    },
    {
      identifier: '64/ar.abdullahbasfar',
      englishName: 'Abdullah Basfar',
    },
    {
      identifier: '64/ar.abdurrahmaansudais',
      englishName: 'Abdurrahmaan As-Sudais',
    },
    {
      identifier: '64/ar.abdulsamad',
      englishName: 'Abdul Samad',
    },
    {
      identifier: '128/ar.shaatree',
      englishName: 'Abu Bakr Ash-Shaatree',
    },
    {
      identifier: '128/ar.ahmedajamy',
      englishName: 'Ahmed ibn Ali al-Ajamy',
    },
    {
      identifier: '128/ar.alafasy',
      englishName: 'Mishary Alafasy',
    },
    {
      identifier: '64/ar.hanirifai',
      englishName: 'Hani Rifai',
    },
    {
      identifier: '128/ar.husary',
      englishName: 'Husary',
    },
    {
      identifier: '128/ar.husarymujawwad',
      englishName: 'Husary (Mujawwad)',
    },
    {
      identifier: '128/ar.hudhaify',
      englishName: 'Hudhaify',
    },
    {
      identifier: '128/ar.mahermuaiqly',
      englishName: 'Maher Al Muaiqly',
    },
    {
      identifier: '128/ar.minshawi',
      englishName: 'Minshawi',
    },
    {
      identifier: '64/ar.minshawimujawwad',
      englishName: 'Minshawy (Mujawwad)',
    },
    {
      identifier: '128/ar.muhammadayyoub',
      englishName: 'Muhammad Ayyoub',
    },
    {
      identifier: '128/ar.muhammadjibreel',
      englishName: 'Muhammad Jibreel',
    },
    {
      identifier: '64/ar.saoodshuraym',
      englishName: 'Saood bin Ibraaheem Ash-Shuraym',
    }
  ];

  constructor() {
    const page = localStorage.getItem('currentPage');
    if (page != null) {
      this.setCurrentPage(+page);
    } else {
      this.setCurrentPage(1);
    }
    this.currentPageChanged.next(true);
    const qari = localStorage.getItem('qari');
    if(qari){
      const qariObj = JSON.parse(qari);
      this.qari = {
        value: qariObj.identifier,
        name: qariObj.englishName
      };
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

  changeQari(qariIdentifier){
    const qariObj = this.qariList.find(item =>  item.identifier === qariIdentifier);
    localStorage.setItem('qari', JSON.stringify(qariObj));
    this.qari = {
      value: qariObj.identifier,
      name: qariObj.englishName
    };
  }


  //tafsir
  getTafsirAndTranslationForPage(page): Observable<Tafsir>{
    return of(tefsir.getTafsirAndTranslationForPage(page));
  }

  getNumberOfAyahsByPage(page): Observable<number>{
    return of(tefsir.getNumberOfAyahsByPage(page));
  }

  getOrdinalNumberOfAyahOnPage(ayahIndex, page): Observable<number>{
    return of(tefsir.getOrdinalNumberOfAyahOnPage(ayahIndex,page));
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

  getSuraByPageNumber(page): Observable<Sura> {
    return of(quranMetaData.getSuraByPageNumber(page));
  }

  getJuzByPageNumber(page): Observable<Juz> {
    return of(quranMetaData.getJuzByPageNumber(page));
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

  // getQuranForPageWordByWord(page): Observable<any> {
  //   return this.http.get(`https://salamquran.com/en/api/v6/page/wbw?index=${page}`);
  // }

  getQuranWordsByPage(page): Observable<QuranWords> {
    return of(quranWords.getWordsByPage(page));
  }

  getAllQuranWords(): Observable<QuranWords[]> {
    return of(quranWords.getWordsByPage());
  }

  searchAyahs(searchTerm): Observable<TafsirAyah[]>  {
    return of(tefsir.searchAyahs(searchTerm));
  }

}
