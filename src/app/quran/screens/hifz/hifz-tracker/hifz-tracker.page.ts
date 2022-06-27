import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HifzTrackerService } from './hifz-tracker.service';
import { ModalPage } from './modal/modal.page';

@Component({
  selector: 'app-hifz-tracker',
  templateUrl: './hifz-tracker.page.html',
  styleUrls: ['./hifz-tracker.page.scss'],
})
export class HifzTrackerPage {

  constructor(public hifzTrackerService: HifzTrackerService, private modalController: ModalController) {
  }

  getPercents(learnedAyahs, numberOfAyas) {
    return Math.floor((learnedAyahs / numberOfAyas) * 100);
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 1000);
  }

  async presentModal(sura) {
    const modal = await this.modalController.create({
      component: ModalPage,
      initialBreakpoint: 0.92,
      componentProps: {
        sura,
      },
    });
    return await modal.present();
  }
}
