import { Component, OnInit } from '@angular/core';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { DhikrService } from '../dhikr.service';

@Component({
  selector: 'app-evening-dhikr',
  templateUrl: 'evening-dhikr.page.html',
})
export class EveningDhikrPage implements OnInit {
  eveningDhikrs: any;

  constructor(
    private eveningDhikrsService: DhikrService,
    private mediaPlayerService: MediaPlayerService
  ) {}

  ngOnInit(): void {
    this.getMorningDhikr();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.eveningDhikrsService.eveningDhikrPageEntered.next(true);
    }, 100);
  }

  ionViewDidLeave() {
    this.mediaPlayerService.removePlayer();
  }

  getMorningDhikr() {
    this.eveningDhikrsService.getEveningDhikr().subscribe((dhikrs) => {
      this.eveningDhikrs = dhikrs;
    });
  }
}
