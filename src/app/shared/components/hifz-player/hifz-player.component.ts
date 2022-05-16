import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ayah, Sura } from 'src/app/quran/quran.models';
import { QuranService } from 'src/app/quran/quran.service';
import { MediaPlayerService } from '../../media-player.service';

@Component({
  selector: 'app-hifz-player',
  templateUrl: './hifz-player.component.html',
  styleUrls: ['./hifz-player.component.scss'],
})
export class HifzPlayerComponent implements OnInit, OnDestroy {
  subs: Subscription = new Subscription();

  suraList: Sura[] = [];
  suraListTo: Sura[] = [];
  fromSuraAyahs: number[] = [];
  toSuraAyahs: number[] = [];

  selectedFromSura: Sura;
  selectedToSura: Sura;
  selectedFromSuraAyah: number;
  selectedToSuraAyah: number;

  playerEnded: boolean;

  constructor(
    public quranService: QuranService,
    public mediaPlayerService: MediaPlayerService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.subs.add(
      this.quranService.getSuraList().subscribe((response) => {
        this.suraList = response;
        this.getAyahDetails(this.mediaPlayerService.playingCurrentAyah);
      })
    );
    this.subs.add(
      this.mediaPlayerService.playingCurrentAyahChanged.subscribe((started) => {
        if (started && !this.mediaPlayerService.hifzIsPlaying) {
          this.getAyahDetails(this.mediaPlayerService.playingCurrentAyah);
        }
      })
    );
    //hifz player ended
    this.subs.add(
      this.mediaPlayerService.hifzPlayerEnded.subscribe((ended) => {
        this.playerEnded = ended;
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

  play() {
    this.mediaPlayerService.showHifzPlayer = false;
    let fromSura: Ayah;
    let toSura: Ayah;

    this.quranService
      .getAyahDetails(this.selectedFromSura.index, this.selectedFromSuraAyah)
      .subscribe((response) => {
        fromSura = response[0];
      });
    this.quranService
      .getAyahDetails(this.selectedToSura.index, this.selectedToSuraAyah)
      .subscribe((response) => {
        toSura = response[0];
      });
    this.quranService.setCurrentPage(fromSura.page);
    this.mediaPlayerService.playHifzPlayer(
      fromSura.index,
      fromSura.index,
      toSura.index
    );
  }

  stop() {
    this.mediaPlayerService.pauseAudio();
    this.mediaPlayerService.hifzIsPlaying = false;
    this.mediaPlayerService.hifzRepeatEveryAyahCounter = 0;
    this.mediaPlayerService.hifzRepeatGroupOfAyahsCounter = 0;
  }

  hideHifzPlayer() {
    this.mediaPlayerService.showHifzPlayer = false;
    if (this.playerEnded) {
      this.mediaPlayerService.removePlayer();
      this.mediaPlayerService.hifzIsPlaying = false;
    }
  }
}
