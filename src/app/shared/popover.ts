import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PopoverController } from '@ionic/angular';

@Component({
  template: `
    <ion-list>
      <ion-item button>
        <ion-label>O aplikaciji</ion-label>
      </ion-item>

      <ion-item button (click)="goTo('/tabs/settings')">
        <ion-label>Postavke</ion-label>
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(public popoverCtrl: PopoverController, private router: Router) {}

  goTo(url) {
    this.router.navigate([url]);
    this.popoverCtrl.dismiss();
  }
}
