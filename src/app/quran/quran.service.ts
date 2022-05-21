import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Ayah,
  Juz,
  PageInfo,
  QuranWords,
  Sura,
  Tafsir,
  TafsirAyah,
} from './quran.models';
const tefsir = require('@kmaslesa/tefsir');
const quranMetaData = require('@kmaslesa/quran-metadata');
const quranWords = require('@kmaslesa/quran-word-by-word');
const quranAyats = require('@kmaslesa/quran-ayats');

@Injectable({
  providedIn: 'root',
})
export class QuranService {
  showHeaderAndTabs = true;
  showLoader = false;
  showTranslationModal = false;
  currentPage = 0;
  markedAyah = -1;
  currentPageChanged: EventEmitter<any> = new EventEmitter();
  scrollToAyah: EventEmitter<number> = new EventEmitter();

  qari = {
    value: 'Alafasy_128kbps',
    name: 'Mishary Alafasy',
  };

  qariList = [
    { identifier: 'Ayman_Sowaid_64kbps', englishName: 'Ayman Sowaid' },
    { identifier: 'aziz_alili_128kbps', englishName: 'Aziz Alili' },
    {
      identifier: 'ahmed_ibn_ali_al_ajamy_128kbps',
      englishName: 'Ahmed Ibn Ali Al-Ajamy',
    },
    {
      identifier: 'AbdulSamad_64kbps_QuranExplorer.Com',
      englishName: 'Abdul Basit Abdul Samad',
    },
    {
      identifier: 'Abdul_Basit_Mujawwad_128kbps',
      englishName: 'Abdul Basit Mujawwad 128kbps',
    },
    {
      identifier: 'Abdul_Basit_Murattal_192kbps',
      englishName: 'Abdul Basit Murattal 192kbps',
    },
    {
      identifier: 'Abdul_Basit_Murattal_64kbps',
      englishName: 'Abdul Basit Murattal 64kbps',
    },
    {
      identifier: 'Abdullaah_3awwaad_Al-Juhaynee_128kbps',
      englishName: 'Abdullaah Awaad Al-Juhaynee',
    },
    {
      identifier: 'Abdullah_Basfar_192kbps',
      englishName: 'Abdullah Basfar 192kbps',
    },
    {
      identifier: 'Abdullah_Basfar_64kbps',
      englishName: 'Abdullah Basfar 64kbps',
    },
    {
      identifier: 'Abdullah_Basfar_32kbps',
      englishName: 'Abdullah Basfar 32kbps',
    },
    { identifier: 'Abdullah_Matroud_128kbps', englishName: 'Abdullah Matroud' },
    {
      identifier: 'Abdurrahmaan_As-Sudais_192kbps',
      englishName: 'Abdurrahmaan As-Sudais 192kbps',
    },
    {
      identifier: 'Abdurrahmaan_As-Sudais_64kbps',
      englishName: 'Abdurrahmaan As-Sudais 64kbps',
    },
    {
      identifier: 'Abu_Bakr_Ash-Shaatree_128kbps',
      englishName: 'Abu Bakr Ash-Shaatree 128kbps',
    },
    {
      identifier: 'Abu_Bakr_Ash-Shaatree_64kbps',
      englishName: 'Abu Bakr_Ash-Shaatree 64kbps',
    },
    { identifier: 'Ahmed_Neana_128kbps', englishName: 'Ahmed Neana' },
    {
      identifier: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net',
      englishName: 'Ahmed Ibn Ali Al-Ajamy 128kbps',
    },
    {
      identifier: 'Ahmed_ibn_Ali_al-Ajamy_64kbps_QuranExplorer.Com',
      englishName: 'Ahmed Ibn Ali Al-Ajamy 64kbps',
    },
    { identifier: 'Akram_AlAlaqimy_128kbps', englishName: 'Akram AlAlaqimy' },
    {
      identifier: 'Ali_Hajjaj_AlSuesy_128kbps',
      englishName: 'Ali Hajjaj AlSuesy',
    },
    { identifier: 'Ali_Jaber_64kbps', englishName: 'Ali Jaber' },
    {
      identifier: 'MultiLanguage/Basfar_Walk_192kbps',
      englishName: 'Basfar - MultiLanguage',
    },
    { identifier: 'Fares_Abbad_64kbps', englishName: 'Fares Abbad' },
    { identifier: 'Ghamadi_40kbps', englishName: 'Ghamadi' },
    { identifier: 'Hani_Rifai_192kbps', englishName: 'Hani Rifai 192kbps' },
    { identifier: 'Hani_Rifai_64kbps', englishName: 'Hani Rifai 64kbps' },
    { identifier: 'Hudhaify_128kbps', englishName: 'Hudhaify 128kbps' },
    { identifier: 'Hudhaify_32kbps', englishName: 'Hudhaify 32kbps' },
    { identifier: 'Hudhaify_64kbps', englishName: 'Hudhaify 64kbps' },
    { identifier: 'Husary_64kbps', englishName: 'Husary 64kbps' },
    { identifier: 'Husary_128kbps', englishName: 'Husary 128kbps' },
    {
      identifier: 'Husary_Mujawwad_64kbps',
      englishName: 'Husary - Mujawwad 64kbps',
    },
    {
      identifier: 'Husary_128kbps_Mujawwad',
      englishName: 'Husary - Mujawwad 128kbps)',
    },
    {
      identifier: 'Husary_Muallim_128kbps',
      englishName: 'Husary - Muallim',
    },
    {
      identifier: 'Ibrahim_Akhdar_32kbps',
      englishName: 'Ibrahim Akhdar 32kbps',
    },
    {
      identifier: 'khalefa_al_tunaiji_64kbps',
      englishName: 'Khalefa Al Tunaiji',
    },
    { identifier: 'Karim_Mansoori_40kbps', englishName: 'Karim Mansoori' },
    {
      identifier: 'Khaalid_Abdullaah_al-Qahtaanee_192kbps',
      englishName: 'Khaalid Abdullaah Al-Qahtaanee',
    },
    { identifier: 'Alafasy_128kbps', englishName: 'Mishary Alafasy 128kbps' },
    { identifier: 'Alafasy_64kbps', englishName: 'Mishary Alafasy 64kbps' },
    {
      identifier: 'MaherAlMuaiqly128kbps',
      englishName: 'Maher AlMuaiqly 128kbps',
    },
    {
      identifier: 'Maher_AlMuaiqly_64kbps',
      englishName: 'Maher AlMuaiqly 64kbps',
    },
    { identifier: 'Menshawi_16kbps', englishName: 'Menshawi 16kbps' },
    { identifier: 'Menshawi_32kbps', englishName: 'Menshawi 32kbps' },
    {
      identifier: 'Minshawy_Mujawwad_192kbps',
      englishName: 'Minshawy - Mujawwad 192kbps',
    },
    {
      identifier: 'Minshawy_Mujawwad_64kbps',
      englishName: 'Minshawy - Mujawwad 64kbps',
    },
    {
      identifier: 'Minshawy_Murattal_128kbps',
      englishName: 'Minshawy - Murattal',
    },
    {
      identifier: 'Mohammad_al_Tablaway_128kbps',
      englishName: 'Mohammad Al Tablaway 128kbps',
    },
    {
      identifier: 'Mohammad_al_Tablaway_64kbps',
      englishName: 'Mohammad Al Tablaway 64kbps',
    },
    {
      identifier: 'Muhammad_AbdulKareem_128kbps',
      englishName: 'Muhammad AbdulKareem',
    },
    {
      identifier: 'Muhammad_Ayyoub_128kbps',
      englishName: 'Muhammad Ayyoub 128kbps',
    },
    {
      identifier: 'Muhammad_Ayyoub_64kbps',
      englishName: 'Muhammad Ayyoub 64kbps',
    },
    {
      identifier: 'Muhammad_Ayyoub_32kbps',
      englishName: 'Muhammad Ayyoub 32kbps',
    },
    {
      identifier: 'Muhammad_Jibreel_128kbps',
      englishName: 'Muhammad Jibreel 128kbps',
    },
    {
      identifier: 'Muhammad_Jibreel_64kbps',
      englishName: 'Muhammad Jibreel 64kbps',
    },
    { identifier: 'Muhsin_Al_Qasim_192kbps', englishName: 'Muhsin Al Qasim' },
    { identifier: 'Mustafa_Ismail_48kbps', englishName: 'Mustafa Ismail' },
    {
      identifier: 'mahmoud_ali_al_banna_32kbps',
      englishName: 'Mahmoud Ali Al Banna',
    },
    { identifier: 'Nasser_Alqatami_128kbps', englishName: 'Nasser Alqatami' },
    { identifier: 'Parhizgar_48kbps', englishName: 'Parhizgar' },
    { identifier: 'Sahl_Yassin_128kbps', englishName: 'Sahl Yassin' },
    {
      identifier: 'Salaah_AbdulRahman_Bukhatir_128kbps',
      englishName: 'Salaah AbdulRahman Bukhatir',
    },
    { identifier: 'Salah_Al_Budair_128kbps', englishName: 'Salah Al Budair' },
    {
      identifier: 'Saood_ash-Shuraym_128kbps',
      englishName: 'Saood Ash-Shuraym 128kbps',
    },
    {
      identifier: 'Saood_ash-Shuraym_64kbps',
      englishName: 'Saood Ash-Shuraym 64kbps',
    },
    { identifier: 'Yaser_Salamah_128kbps', englishName: 'Yaser Salamah' },
    {
      identifier: 'Yasser_Ad-Dussary_128kbps',
      englishName: 'Yasser Ad-Dussary',
    },
    {
      identifier: 'English/Sahih_Intnl_Ibrahim_Walk_192kbps',
      englishName: 'Sahih Ibrahim - translation',
    },
    {
      identifier: 'translations/Fooladvand_Hedayatfar_40Kbps',
      englishName: 'Hedayatfar - with translations by Fooladvand',
    },
    {
      identifier: 'translations/Makarem_Kabiri_16Kbps',
      englishName: 'Makarem Kabiri - with translations',
    },
    {
      identifier: 'translations/azerbaijani/balayev',
      englishName: 'Balayev - with azerbaijani translations',
    },
    {
      identifier: 'translations/besim_korkut_ajet_po_ajet',
      englishName: 'Besim Korkut - prijevod',
    },
    {
      identifier: 'translations/urdu_farhat_hashmi',
      englishName: 'Farhat Hashmi - with Urdu translations',
    },
    {
      identifier: 'translations/urdu_shamshad_ali_khan_46kbps',
      englishName: 'Shamshad Ali Khan - with Urdu translations',
    },
    {
      identifier: 'warsh/warsh_Abdul_Basit_128kbps',
      englishName: 'Abdul Basit - warsh',
    },
    {
      identifier: 'warsh/warsh_ibrahim_aldosary_128kbps',
      englishName: 'Ibrahim Al Dosary - warsh',
    },
    {
      identifier: 'warsh/warsh_yassin_al_jazaery_64kbps',
      englishName: 'Yassin Al Jazaery - warsh',
    },
  ];

  constructor() {
    const page = localStorage.getItem('currentPage');
    if (page != null) {
      this.setCurrentPage(+page);
    } else {
      this.setCurrentPage(1);
    }
    const qari = localStorage.getItem('qari');
    if (qari != null && qari !== undefined && qari !== 'undefined') {
      const qariObj = JSON.parse(qari);
      if (
        this.qariList.find((item) => item.identifier === qariObj.identifier)
      ) {
        this.qari = {
          value: qariObj.identifier,
          name: qariObj.englishName,
        };
      } else {
        this.changeQari(this.qari.value);
      }
    }
  }

  setCurrentPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= 604) {
      this.currentPage = +pageNumber;
    } else {
      this.currentPage = 1;
    }
    this.currentPageChanged.next(true);
    localStorage.setItem('currentPage', JSON.stringify(+this.currentPage));
  }

  changeQari(qariIdentifier) {
    const qariObj = this.qariList.find(
      (item) => item.identifier === qariIdentifier
    );
    localStorage.setItem('qari', JSON.stringify(qariObj));
    this.qari = {
      value: qariObj.identifier,
      name: qariObj.englishName,
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
  getTafsirAndTranslationForPage(page): Observable<Tafsir> {
    return of(tefsir.getTafsirAndTranslationForPage(page));
  }

  getNumberOfAyahsByPage(page): Observable<number> {
    return of(tefsir.getNumberOfAyahsByPage(page));
  }

  getOrdinalNumberOfAyahOnPage(ayahIndex, page): Observable<number> {
    return of(tefsir.getOrdinalNumberOfAyahOnPage(ayahIndex, page));
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

  searchAyahs(searchTerm): Observable<TafsirAyah[]> {
    return of(tefsir.searchAyahs(searchTerm));
  }

  playBismillahBeforeAyah(ayahIndex): boolean {
    // eslint-disable-next-line max-len
    const bismillahs = [
      7, 293, 493, 669, 789, 954, 1160, 1364, 1473, 1596, 1707, 1750, 1802,
      1901, 2029, 2140, 2250, 2348, 2483, 2595, 2673, 2791, 2855, 2932, 3159,
      3252, 3340, 3409, 3469, 3503, 3533, 3606, 3660, 3705, 3788, 3970, 4058,
      4133, 4218, 4272, 4325, 4414, 4473, 4510, 4545, 4583, 4612, 4630, 4675,
      4735, 4784, 4846, 4901, 4979, 5075, 5104, 5126, 5150, 5163, 5177, 5188,
      5199, 5217, 5229, 5241, 5271, 5323, 5375, 5419, 5447, 5475, 5495, 5551,
      5591, 5622, 5672, 5712, 5758, 5800, 5829, 5848, 5884, 5909, 5931, 5948,
      5967, 5993, 6023, 6043, 6058, 6079, 6090, 6098, 6106, 6125, 6130, 6138,
      6146, 6157, 6168, 6176, 6179, 6188, 6193, 6197, 6204, 6207, 6213, 6216,
      6221, 6225, 6230,
    ];
    return bismillahs.includes(ayahIndex - 1);
  }
}
