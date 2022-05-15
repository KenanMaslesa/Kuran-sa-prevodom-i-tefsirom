import { Component, OnInit } from '@angular/core';
import { Ayah, Sura } from 'src/app/quran/quran.models';
import { QuranService } from 'src/app/quran/quran.service';
import { MediaPlayerService } from '../../media-player.service';

@Component({
  selector: 'app-hifz-player',
  templateUrl: './hifz-player.component.html',
  styleUrls: ['./hifz-player.component.scss'],
})
export class HifzPlayerComponent implements OnInit {
  suraList: Sura[] = [];
  fromSuraAyahs: number[] = [];
  toSuraAyahs: number[] = [];

  selectedFromSura: Sura;
  selectedToSura: Sura;
  selectedFromSuraAyah: number;
  selectedToSuraAyah: number;

  constructor(private quranService: QuranService, public mediaPlayerService: MediaPlayerService) { }

  ngOnInit() {
    this.quranService.getSuraList().subscribe(response => {
      this.suraList = response;
    });
  }

  getAyahsFromSura(sura: Sura) {
    this.selectedFromSura = sura;
    this.fromSuraAyahs = this.getArray(sura.numberOfAyas);
    this.selectedFromSuraAyah = 1;

    if(!this.selectedToSura) {
      this.toSuraAyahs = this.fromSuraAyahs;
      this.selectedToSura = this.selectedFromSura;
      this.selectedToSuraAyah = sura.numberOfAyas;
    }
  }

  getAyahsToSura(sura: Sura) {
    this.selectedToSura = sura;
    this.toSuraAyahs = this.getArray(sura.numberOfAyas);
    if(this.selectedFromSura === this.selectedToSura) {
      this.selectedToSuraAyah = sura.numberOfAyas;
    }
    else {
      this.selectedToSuraAyah = 1;
    }
  }

  getArray(length) {
    const array = [];
    for(let i = 1; i<=length; i++) {
      array.push(i);
    }
    return array;
  }

  play() {
    let fromSura: Ayah;
    let toSura: Ayah;

    this.quranService.getAyahDetails(this.selectedFromSura.index, this.selectedFromSuraAyah).subscribe(response => {
      fromSura = response[0];
    });
    this.quranService.getAyahDetails(this.selectedToSura.index, this.selectedToSuraAyah).subscribe(response => {
      toSura = response[0];
    });
    this.quranService.setCurrentPage(fromSura.page);
    this.mediaPlayerService.playHifzPlayer(fromSura.index, fromSura.index, toSura.index);
  }

}
