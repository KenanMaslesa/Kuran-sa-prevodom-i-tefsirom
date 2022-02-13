import { Component, OnInit } from '@angular/core';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { DhikrService } from '../dhikr.service';

@Component({
  selector: 'app-morning-dhikr',
  templateUrl: 'morning-dhikr.page.html',
})
export class MorningDhikrPage implements OnInit {
  morningDhikrs: any;

  constructor(
    private morningDhikrService: DhikrService,
    private mediaPlayerService: MediaPlayerService
  ) {}

  ngOnInit(): void {
    this.getMorningDhikr();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.morningDhikrService.morningDhikrPageEntered.next(true);
    }, 100);
  }

  ionViewDidLeave() {
    this.mediaPlayerService.removePlayer();
  }

  getMorningDhikr() {
    this.morningDhikrService.getMorningDhikr().subscribe((dhikrs) => {
      this.morningDhikrs = dhikrs;
    });
  }
}
