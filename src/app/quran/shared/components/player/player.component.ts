import { Component, Input, ViewChild } from '@angular/core';
import { AlertController, IonSelect, ModalController } from '@ionic/angular';
import { QuranService } from 'src/app/quran/shared/services/quran.service';
import { MediaPlayerService } from '../../services/media-player.service';
import { HifzPlayerComponent } from '../hifz-player/hifz-player.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @ViewChild('speedOptions', { static: false }) speedOptions: IonSelect;
  @ViewChild('qari', { static: false }) qari: IonSelect;
  @Input() showHifzIcon: boolean;
  showSpeedOptions = false;
  constructor(public mediaPlayerService: MediaPlayerService, public quranService: QuranService, private alertController: AlertController) {
  }

  openSpeedOptions() {
    this.speedOptions.open();
  }

  openQari() {
    this.qari.open();
  }

  stopPlayer() {
    if(this.mediaPlayerService.hifzIsPlaying) {
      this.presentAlertConfirm();
      this.mediaPlayerService.pauseAudio();
    }
    else {
      this.mediaPlayerService.removePlayer();
      this.mediaPlayerService.playingCurrentAyah = null;
    }
  }

  showHifzPlayer() {
    this.mediaPlayerService.showHifzPlayer = true;
    if(!this.mediaPlayerService.hifzIsPlaying) {
      this.mediaPlayerService.pauseAudio();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Prekidanje hifza',
      message: 'Jeste li sigurni da želite prekinuti hifz?',
      buttons: [
        {
          text: 'NE',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.mediaPlayerService.continueAudio();
          },
        },
        {
          text: 'Da',
          handler: () => {
            this.mediaPlayerService.removePlayer();
            this.mediaPlayerService.hifzIsPlaying = false;
            this.mediaPlayerService.playingCurrentAyah = null;
          },
        },
      ],
    });

    await alert.present();
  }

  speedChanged() {
    setTimeout(() => {
      this.mediaPlayerService.playAudio(this.mediaPlayerService.playingCurrentAyah);
    }, 100);
  }
}
