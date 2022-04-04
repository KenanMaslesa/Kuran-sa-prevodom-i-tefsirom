import { Component, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { QuranService } from 'src/app/quran/quran.service';
import { MediaPlayerService } from '../../media-player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @ViewChild('speedOptions', { static: false }) speedOptions: IonSelect;
  @ViewChild('qari', { static: false }) qari: IonSelect;
  showSpeedOptions = false;
  constructor(public mediaPlayerService: MediaPlayerService, public quranService: QuranService) {
  }

  openSpeedOptions() {
    this.speedOptions.open();
  }

  openQari() {
    this.qari.open();
  }
}
