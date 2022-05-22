import { Component, Input, OnInit } from '@angular/core';
import { Sura } from 'src/app/quran/quran.models';
import { HifzTrackerService } from '../hifz-tracker.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() sura: Sura;
  ayahs = [];

  constructor(private hifzTrackerService: HifzTrackerService) { }
  ngOnInit(): void {
    this.hifzTrackerService.getAyahsBySura(this.sura.index).subscribe(response => {
      this.ayahs = response;
    });
  }

  saveLearnedAyahs(learnedAyahs, suraIndex) {
    this.hifzTrackerService.suraList.forEach(sura => {
      if(sura.index === suraIndex) {
        sura.learnedAyahs = +learnedAyahs;
      }
    });
    this.hifzTrackerService.storeSuraList();
  }

  getPercents(learnedAyahs, numberOfAyas) {
    return Math.floor((learnedAyahs / numberOfAyas) * 100);
  }

  saveCheckbox(value, learnedAyahs, suraIndex) {
    this.saveLearnedAyahs(value?learnedAyahs:0, suraIndex);
  }
  getArray(numberOfAyahs) {
    const array = [];
    for(let i = 1; i<=numberOfAyahs; i++) {
      array.push(i);
    }
    return array;
  }
}
