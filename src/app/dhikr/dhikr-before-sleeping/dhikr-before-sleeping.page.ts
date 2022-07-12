import { Component, OnInit } from '@angular/core';
import { DhikrType, MorningEveningTrackerService } from '../morning-evening-tracker.service';
import { DhikrService } from '../shared/dhikr.service';
import { MediaPlayerService } from '../shared/media-player.service';

@Component({
  selector: 'app-dhikr-before-sleeping',
  templateUrl: './dhikr-before-sleeping.page.html',
})
export class DhikrBeforeSleepingPage implements OnInit {
  dhikrs: any;
  dhikrType = DhikrType.dhikrBeforeSleeping;
  todaysDhikrCounters: any[];
  constructor(
    private dhikrService: DhikrService,
    private mediaPlayerService: MediaPlayerService,
    private morningEveningTrackerService: MorningEveningTrackerService
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
    this.morningEveningTrackerService.getTodaysDhikrBeforeSleepingCounters().subscribe(response => {
      this.todaysDhikrCounters = response;
      this.dhikrService.getDhikrBeforeSleeping().subscribe((dhikrs) => {
        if(this.todaysDhikrCounters.length > 0){
          dhikrs.forEach(dhikr => {
            dhikr.counter = this.getCounterForTodaysDhikr(dhikr);
          });
        }
        this.dhikrs = dhikrs;
      });
    });
  }

  getCounterForTodaysDhikr(dhikr){
    return this.todaysDhikrCounters.filter(item => item.id === dhikr.id)?.map(item => item.counter)[0];
  }
}
