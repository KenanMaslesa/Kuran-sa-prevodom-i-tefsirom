import { Component, OnInit } from '@angular/core';
import { DhikrService } from '../dhikr.service';

@Component({
  selector: 'app-evening-dhikr',
  templateUrl: 'evening-dhikr.page.html',
})
export class EveningDhikrPage implements OnInit {
  eveningDhikrs: any;

  constructor(private eveningDhikrsService: DhikrService) { }

  ngOnInit(): void {
    this.getMorningDhikr();
  }

  ionViewDidEnter() {
    setTimeout(() => {
    this.eveningDhikrsService.eveningDhikrPageEntered.next(true);
    }, 100);
  }

  getMorningDhikr(){
    this.eveningDhikrsService.getEveningDhikr().subscribe(dhikrs => {
      this.eveningDhikrs = dhikrs;
    });
  }
}

