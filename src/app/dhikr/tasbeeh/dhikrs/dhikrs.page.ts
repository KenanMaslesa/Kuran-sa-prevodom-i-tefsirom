import { Component, OnInit } from '@angular/core';
import { TasbeehService } from '../tasbeeh.service';
@Component({
  selector: 'app-dhikrs',
  templateUrl: './dhikrs.page.html',
  styleUrls: ['./dhikrs.page.scss'],
})
export class DhikrsPage implements OnInit {
  isReorderingEnabled = false;
  constructor(public tasbeehService: TasbeehService) { }
  ngOnInit() {
  }

  reorderItems(ev) {
    this.tasbeehService.dhikrsFromStorage.filter((item) => {
      const currentDate = this.tasbeehService.getCurrentDateAsString(new Date());
      if (item.date === currentDate) {
      const itemMove = item.dhikrs.splice(ev.detail.from, 1)[0];
      item.dhikrs.splice(ev.detail.to, 0, itemMove);
      }
    });
    localStorage.setItem(this.tasbeehService.localStorageKey, JSON.stringify(this.tasbeehService.dhikrsFromStorage));

    ev.detail.complete();
}

// reorderItems(ev) {
//   const itemMove = this.items.splice(ev.detail.from, 1)[0];
//   this.items.splice(ev.detail.to, 0, itemMove);
//   ev.detail.complete();
// }https://stackoverflow.com/questions/54567446/ionic-4-ion-reorder-not-working-as-expected

}
