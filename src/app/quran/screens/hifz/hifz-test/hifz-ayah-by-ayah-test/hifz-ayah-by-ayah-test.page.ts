import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QuranWords, Sura } from 'src/app/quran/shared/quran.models';
import { QuranService } from 'src/app/quran/shared/services/quran.service';
import { NativePluginsService } from 'src/app/quran/shared/services/native-plugins.service';

@Component({
  selector: 'app-hifz-ayah-by-ayah-test',
  templateUrl: './hifz-ayah-by-ayah-test.page.html',
  styleUrls: ['./hifz-ayah-by-ayah-test.page.scss'],
})
export class HifzAyahByAyahTestPage implements OnInit ,OnDestroy {
  @Input() selectedFromSura: Sura;
  @Input() selectedToSura: Sura;
  @Input() selectedFromSuraAyah: number;
  @Input() selectedToSuraAyah: number;
  @Output() testIsFinished: EventEmitter<boolean> = new EventEmitter();

  subs: Subscription = new Subscription();
  quranWordsForCurrentPage$: Observable<QuranWords>;
  quranWordsForCurrentPage: QuranWords[] = [];

  //testing
  testPage: number;
  testAyah: number;
  toAyah: number;
  isTestInProgress = false;
  showAyahs = [];

  constructor(
    public quranService: QuranService,
    public nativePluginsService: NativePluginsService
  ) {
  }

  ngOnInit(): void {
    this.startTest();
  }

  startTest() {
    this.isTestInProgress = true;
    // this.testPage = this.selectedFromSura.startPage;
    this.testAyah = this.selectedFromSuraAyah;

    //selected to
    this.quranService
    .getAyahDetails(this.selectedToSura.index, this.selectedToSuraAyah)
    .subscribe((ayahDetails) => {
      this.toAyah = ayahDetails[0].index;
      this.testPage = ayahDetails[0].page;
    });
    //selected to

    this.quranService
      .getAyahDetails(this.selectedFromSura.index, this.selectedFromSuraAyah)
      .subscribe((ayahDetails) => {
        this.testPage = ayahDetails[0].page;
        this.testAyah = ayahDetails[0].index;
        this.getQuranWordsForPage(this.testPage);
      });
  }

  getQuranWordsForPage(page) {
    this.quranWordsForCurrentPage = [];
    this.quranWordsForCurrentPage$ = this.quranService
      .getQuranWordsByPage(page)
      .pipe(
        tap((response) => {
          this.quranWordsForCurrentPage.push(response);
        })
      );
  }

  finishTest() {
    this.isTestInProgress = false;
    this.testIsFinished.emit(true);
    this.showAyahs = [];
  }

  showNextAyah() {
    if(this.testAyah >= this.toAyah) {
      this.isTestInProgress = false;
    }
    this.showAyahs.push(this.testAyah);
    this.getAyahDetails(this.testAyah);
    this.testAyah++;
  }

  isAyahInArray(ayah) {
    console.log('isAyahInArray');
    return this.showAyahs.find(item => item === ayah);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getAyahDetails(ayahIndexInHolyQuran) {
    this.subs.add(
      this.quranService
        .getAyatDetailsByAyahIndex(ayahIndexInHolyQuran)
        .subscribe((ayah) => {
          const ayahObj = ayah[0];
          if(ayahObj.page > this.testPage) {
            this.testPage = ayahObj.page;
          this.getQuranWordsForPage(this.testPage);
          this.selectedFromSuraAyah = ayahObj.ayaNumber;
          }

        })
    );
  }
}
