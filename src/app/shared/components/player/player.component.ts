import { Component, ViewChild } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { QuranService } from 'src/app/quran/quran.service';
import { MediaPlayerService } from '../../media-player.service';
import { HifzPlayerComponent } from '../hifz-player/hifz-player.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @ViewChild('speedOptions', { static: false }) speedOptions: IonSelect;
  @ViewChild('qari', { static: false }) qari: IonSelect;
  showSpeedOptions = false;
  constructor(public mediaPlayerService: MediaPlayerService, public quranService: QuranService, private modalController: ModalController) {
  }

  openSpeedOptions() {
    this.speedOptions.open();
  }

  openQari() {
    this.qari.open();
  }

  async showHifzPlayer() {
    this.mediaPlayerService.showHifzPlayer = true;
    // const modal = await this.modalController.create({
    //   component: HifzPlayerComponent,
    //   initialBreakpoint: 0.8,
    //   breakpoints: [0, 0.2, 0.3, 0.5],
    //   componentProps: {
    //   },
    // });
    // return await modal.present();
  }
}
