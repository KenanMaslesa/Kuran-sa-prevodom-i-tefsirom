import { Component, OnInit } from '@angular/core';
import { DhikrType, MorningEveningTrackerService } from '../morning-evening-tracker.service';
import { DhikrService } from '../shared/dhikr.service';
import { MediaPlayerService } from '../shared/media-player.service';

@Component({
  selector: 'app-morning-dhikr',
  templateUrl: 'morning-dhikr.page.html',
})
export class MorningDhikrPage implements OnInit {
  morningDhikrs: any;
  todaysDhikrCounters: any[];
  dhikrType = DhikrType.morningDhikr;

  constructor(
    private morningDhikrService: DhikrService,
    private mediaPlayerService: MediaPlayerService,
    private morningEveningTrackerService: MorningEveningTrackerService
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
    this.morningEveningTrackerService.getTodaysMorningDhikrCounters().subscribe(response => {
      this.todaysDhikrCounters = response;
      this.morningDhikrService.getMorningDhikr().subscribe((dhikrs) => {
        if(this.todaysDhikrCounters.length > 0){
          dhikrs.forEach(dhikr => {
            dhikr.counter = this.getCounterForTodaysDhikr(dhikr);
          });
        }
        this.morningDhikrs = dhikrs;
      });
    });
  }

  getCounterForTodaysDhikr(dhikr){
    return this.todaysDhikrCounters.filter(item => item.id === dhikr.id)?.map(item => item.counter)[0];
  }

}
