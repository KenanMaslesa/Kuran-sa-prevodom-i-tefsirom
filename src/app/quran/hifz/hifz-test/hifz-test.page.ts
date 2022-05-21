import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sura } from '../../quran.models';
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

  randomAyahTest: boolean;
  isTestInProgress: boolean;

  constructor(public quranService: QuranService) {}

  ngOnInit() {
    this.subs.add(
      this.quranService.getSuraList().subscribe((response) => {
        this.suraList = response;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getSuraNumbersArray(fromSuraIndex, toSuraIndex) {
    const array = [];
    for (let i = fromSuraIndex; i <= toSuraIndex; i++) {
      array.push(i);
    }
    return array;
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
    this.toSuraAyahs = this.fromSuraAyahs.filter(
      (item) => item >= this.selectedFromSuraAyah
    );
  }

  getArray(length) {
    const array = [];
    for (let i = 1; i <= length; i++) {
      array.push(i);
    }
    return array;
  }

  startTest() {
    this.isTestInProgress = true;
  }

  finishTest() {
    this.isTestInProgress = false;
  }
}
