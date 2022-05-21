import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QuranWords, Sura } from 'src/app/quran/quran.models';
import { QuranService } from 'src/app/quran/quran.service';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';

@Component({
  selector: 'app-hifz-random-ayahs-test',
  templateUrl: './hifz-random-ayahs-test.page.html',
  styleUrls: ['./hifz-random-ayahs-test.page.scss'],
})
export class HifzRandomAyahsTestPage implements OnInit, OnDestroy {
  @Input() selectedFromSura: Sura;
  @Input() selectedToSura: Sura;
  @Input() selectedFromSuraAyah: number;
  @Input() selectedToSuraAyah: number;
  @Output() testIsFinished: EventEmitter<boolean> = new EventEmitter();

  subs: Subscription = new Subscription();

  suraList: Sura[] = [];

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

  ngOnInit() {
    this.subs.add(
      this.quranService.getSuraList().subscribe((response) => {
        this.suraList = response;
      })
    );

    this.startTest();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

  getAyahDetails(ayahIndexInHolyQuran) {
    this.subs.add(
      this.quranService
        .getAyatDetailsByAyahIndex(ayahIndexInHolyQuran)
        .subscribe((ayah) => {
          const ayahObj = ayah[0];
          this.selectedFromSura = this.suraList[ayahObj.sura - 1];
          this.selectedFromSuraAyah = ayahObj.ayaNumber;
        })
    );
  }
}
