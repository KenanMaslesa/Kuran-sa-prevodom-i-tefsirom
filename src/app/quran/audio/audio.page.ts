import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { HomePopoverComponent } from 'src/app/shared/components/popovers/home-popover/home-popover.component';
import { PlatformService } from 'src/app/shared/platform.service';
import { QuranService } from '../quran.service';
import { AudioPlayerService } from './audio-player.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit {
  suraList;
  constructor(
    private quranService: QuranService,
    public audioPlayerService: AudioPlayerService,
    private popoverCtrl: PopoverController,
    public platformService: PlatformService
  ) {
  }

  ngOnInit() {
    this.getSuraList();
    this.quranService.showLoader = false;
  }

  ionViewDidLeave() {
    this.audioPlayerService.removePlayer();
  }

  getSuraList() {
    this.quranService.getSuraList().subscribe((response) => {
      this.suraList = response;
    });
  }

  searchSura(searchTerm) {
    this.quranService.searchSuraByBosnianName(searchTerm).subscribe(response => {
      this.suraList = response;
    });
  }

  playSura(selectedSura = 1) {
    this.audioPlayerService.isPlayerMinimized = false;
    this.audioPlayerService.currentTime = -1;
    this.audioPlayerService.play(this.audioPlayerService.qari, +selectedSura);
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: HomePopoverComponent,
      event,
    });
    await popover.present();
  }
}
