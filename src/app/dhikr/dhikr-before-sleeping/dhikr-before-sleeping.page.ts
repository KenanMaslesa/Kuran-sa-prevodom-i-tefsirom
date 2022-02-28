import { Component, OnInit } from '@angular/core';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { DhikrService } from '../dhikr.service';

@Component({
  selector: 'app-dhikr-before-sleeping',
  templateUrl: './dhikr-before-sleeping.page.html',
  styleUrls: ['./dhikr-before-sleeping.page.scss'],
})
export class DhikrBeforeSleepingPage implements OnInit {
  dhikrs: any;

  constructor(
    private dhikrService: DhikrService,
    private mediaPlayerService: MediaPlayerService
  ) {}

  ngOnInit(): void {
    this.getDhikrBeforeSleeping();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.dhikrService.morningDhikrPageEntered.next(true);
    }, 100);
  }

  ionViewDidLeave() {
    this.mediaPlayerService.removePlayer();
  }

  getDhikrBeforeSleeping() {
    this.dhikrService.getDhikrBeforeSleeping().subscribe((dhikrs) => {
      this.dhikrs = dhikrs;
    });
  }
}
