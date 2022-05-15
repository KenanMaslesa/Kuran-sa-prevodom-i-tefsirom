import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Ayah, Juz, PageInfo, QuranWords, Sura, Tafsir, TafsirAyah } from './quran.models';
const tefsir = require('@kmaslesa/tefsir');
const quranMetaData = require('@kmaslesa/quran-metadata');
const quranWords = require('@kmaslesa/quran-word-by-word');
const quranAyats = require('@kmaslesa/quran-ayats');
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
  currentPageChanged: EventEmitter<any> = new EventEmitter();

  qari = {
    value: '128/ar.alafasy',
    name: 'Mishary Alafasy'
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
      identifier: '128/ar.alafasy',
      englishName: 'Mishary Alafasy',
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
    const qari = localStorage.getItem('qari');
    if(qari != null && qari !== undefined && qari !== 'undefined'){
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
    this.currentPageChanged.next(true);
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

   //ayahs
   getAyahDetails(suraIndex: number, ayahNumber: number): Observable<Ayah[]> {
     return of(quranAyats.getAyat(ayahNumber, suraIndex));
   }

   getAyatDetailsByAyahIndex(ayahIndex): Observable<Ayah[]> {
     return of(quranAyats.getAyatByIndex(ayahIndex));
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

  getSuraByPageNumber(page): Observable<Sura[]> {
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

  getSuraByIndex(index: number): Observable<Sura> {
    return of(quranMetaData.getSuraByIndex(index));
  }

  getJuzList(): Observable<Juz[]> {
    return of(quranMetaData.getJuzList());
  }

  searchJuzListById(id): Observable<Juz[]> {
    return of(quranMetaData.searchJuzListById(id));
  }

  getNumberOfWordsAndLettersPerPage(page): PageInfo {
    return quranMetaData.getNumberOfWordsAndLettersPerPage(page);
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

  playBismillahBeforeAyah(ayahIndex): boolean {
    // eslint-disable-next-line max-len
    const bismillahs = [7,293,493,669,789,954,1160,1364,1473,1596,1707,1750,1802,1901,2029,2140,2250,2348,2483,2595,2673,2791,2855,2932,3159,3252,3340,3409,3469,3503,3533,3606,3660,3705,3788,3970,4058,4133,4218,4272,4325,4414,4473,4510,4545,4583,4612,4630,4675,4735,4784,4846,4901,4979,5075,5104,5126,5150,5163,5177,5188,5199,5217,5229,5241,5271,5323,5375,5419,5447,5475,5495,5551,5591,5622,5672,5712,5758,5800,5829,5848,5884,5909,5931,5948,5967,5993,6023,6043,6058,6079,6090,6098,6106,6125,6130,6138,6146,6157,6168,6176,6179,6188,6193,6197,6204,6207,6213,6216,6221,6225,6230];
    return bismillahs.includes(ayahIndex-1);
  }


}
