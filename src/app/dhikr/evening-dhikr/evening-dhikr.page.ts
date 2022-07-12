import { Component, OnInit } from '@angular/core';
import { DhikrType, MorningEveningTrackerService } from '../morning-evening-tracker.service';
import { DhikrService } from '../shared/dhikr.service';
import { MediaPlayerService } from '../shared/media-player.service';

@Component({
  selector: 'app-evening-dhikr',
  templateUrl: 'evening-dhikr.page.html',
})
export class EveningDhikrPage implements OnInit {
  eveningDhikrs: any;
  dhikrType = DhikrType.eveningDhikr;
  todaysDhikrCounters: any[];

  constructor(
    private eveningDhikrsService: DhikrService,
    private mediaPlayerService: MediaPlayerService,
    private morningEveningTrackerService: MorningEveningTrackerService,
  ) {}

  ngOnInit(): void {
    this.getEveningDhikr();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.eveningDhikrsService.eveningDhikrPageEntered.next(true);
    }, 100);
  }

  ionViewDidLeave() {
    this.mediaPlayerService.removePlayer();
  }

  getEveningDhikr() {
    this.morningEveningTrackerService.getTodaysEveningDhikrCounters().subscribe(response => {
      this.todaysDhikrCounters = response;
      this.eveningDhikrsService.getEveningDhikr().subscribe((dhikrs) => {
        if(this.todaysDhikrCounters.length > 0){
          dhikrs.forEach(dhikr => {
            dhikr.counter = this.getCounterForTodaysDhikr(dhikr);
          });
        }
        this.eveningDhikrs = dhikrs;
      });
    });
  }

  getCounterForTodaysDhikr(dhikr){
    return this.todaysDhikrCounters.filter(item => item.id === dhikr.id)?.map(item => item.counter)[0];
  }
}
