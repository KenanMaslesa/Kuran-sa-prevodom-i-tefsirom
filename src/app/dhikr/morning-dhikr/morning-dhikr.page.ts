import { Component, OnInit } from '@angular/core';
import { DhikrService } from '../dhikr.service';

@Component({
  selector: 'app-morning-dhikr',
  templateUrl: 'morning-dhikr.page.html',
})
export class MorningDhikrPage implements OnInit {
  morningDhikrs: any;

  constructor(private morningDhikrService: DhikrService) { }

  ngOnInit(): void {
    this.getMorningDhikr();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.morningDhikrService.morningDhikrPageEntered.next(true);
    }, 100);
  }

  getMorningDhikr(){
    this.morningDhikrService.getMorningDhikr().subscribe(dhikrs => {
      this.morningDhikrs = dhikrs;
    });
  }
}
