import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';
import { QuranWords, Sura } from '../../quran.models';
import { QuranService } from '../../quran.service';

@Component({
  selector: 'app-hifz-test',
  templateUrl: './hifz-test.page.html',
  styleUrls: ['./hifz-test.page.scss'],
})
export class HifzTestPage implements OnInit, OnDestroy {
  subs: Subscription = new Subscription();

  suraList: Sura[] = [];
  suraListTo: Sura[] = [];
  fromSuraAyahs: number[] = [];
  toSuraAyahs: number[] = [];

  selectedFromSura: Sura;
  selectedToSura: Sura;
  selectedFromSuraAyah: number;
  selectedToSuraAyah: number;

  quranWordsForCurrentPage$: Observable<QuranWords>;
  quranWordsForCurrentPage: QuranWords[] = [];

  //testing
  testPage: number;
  testAyah: number;
  fromAyah: number;
  toAyah: number;
  answerAyah: number;
  showAnswer = false;
  isTestInProgress = false;

  constructor(
    public quranService: QuranService,
    public nativePluginsService: NativePluginsService
  ) {
  }

  startTest() {
    this.isTestInProgress = true;
    this.showAnswer = false;
    this.testPage = this.getRandomNumberBetween(this.selectedFromSura.startPage, this.selectedToSura.endPage);
    this.testAyah = this.getRandomNumberBetween(this.selectedFromSuraAyah, this.selectedToSuraAyah);
    const testSuraIndexesArray = this.getSuraNumbersArray(this.selectedFromSura.index, this.selectedToSura.index);
    const testSuraIndex = this.getRandomNumberBetween(testSuraIndexesArray[0], testSuraIndexesArray[testSuraIndexesArray.length-1]);

    if(testSuraIndex === this.selectedFromSura.index) {
      this.fromAyah = this.selectedFromSuraAyah;
    }
    else {
      this.fromAyah = 1;
    }

    if(testSuraIndex === this.selectedToSura.index) {
      this.toAyah = this.selectedToSuraAyah;
    }
    else {
      this.toAyah = (this.suraList[testSuraIndex-1].numberOfAyas)-1; //do predzadnjeg
    }
    const testAyahNumber = this.getRandomNumberBetween(this.fromAyah, this.toAyah);
    this.quranService
      .getAyahDetails(testSuraIndex, testAyahNumber)
      .subscribe((ayahDetails) => {
        this.testPage = ayahDetails[0].page;
        this.testAyah = ayahDetails[0].index;
        this.answerAyah = this.testAyah + 1;

        this.quranWordsForCurrentPage = [];
        this.quranWordsForCurrentPage$ = this.quranService
          .getQuranWordsByPage(this.testPage)
          .pipe(
            tap((response) => {
              this.quranWordsForCurrentPage.push(response);
            })
          );
      });
  }

  getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  getSuraNumbersArray(fromSuraIndex, toSuraIndex) {
    const array = [];
    for(let i = fromSuraIndex; i<= toSuraIndex; i++) {
      array.push(i);
    }
    return array;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.subs.add(
      this.quranService.getSuraList().subscribe((response) => {
        this.suraList = response;
      })
    );
  }

  getAyahsFromSura(sura: Sura) {
    this.selectedFromSura = sura;
    this.fromSuraAyahs = this.getArray(sura.numberOfAyas);
    this.selectedFromSuraAyah = 1;
    this.suraListTo = this.suraList.filter((item) => item.index >= sura.index);
    this.selectedToSura = this.selectedFromSura;
    this.selectedToSuraAyah = sura.numberOfAyas;
  }

  getAyahsToSura(sura: Sura) {
    this.selectedToSura = sura;
    this.toSuraAyahs = this.getArray(sura.numberOfAyas);
    this.selectedToSuraAyah = sura.numberOfAyas;
  }

  selectedFromSuraAyahChanged() {
    this.toSuraAyahs = this.fromSuraAyahs.filter((item) => item >= this.selectedFromSuraAyah);;
  }

  getAyahDetails(ayahIndexInHolyQuran) {
    this.subs.add(
      this.quranService
        .getAyatDetailsByAyahIndex(ayahIndexInHolyQuran)
        .subscribe((ayah) => {
          const ayahObj = ayah[0];
          this.getAyahsFromSura(this.suraList[ayahObj.sura - 1]);
          this.selectedFromSura = this.suraList[ayahObj.sura - 1];
          this.selectedFromSuraAyah = ayahObj.ayaNumber;
          this.toSuraAyahs = this.fromSuraAyahs.filter((item) => item >= this.selectedFromSuraAyah);;
        })
    );
  }

  getArray(length) {
    const array = [];
    for (let i = 1; i <= length; i++) {
      array.push(i);
    }
    return array;
  }
}


