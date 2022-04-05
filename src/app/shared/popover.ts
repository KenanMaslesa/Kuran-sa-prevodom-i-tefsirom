import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PopoverController } from '@ionic/angular';
import { NativePluginsService } from './native-plugins.service';

@Component({
  template: `
    <ion-list>
      <!-- <ion-item button>
        <ion-label>O aplikaciji</ion-label>
        <ion-icon slot="end" name="information-circle-outline"></ion-icon>
      </ion-item> -->

      <ion-item button (click)="nativePluginsService.shareApp()">
        <ion-label>Podijeli sa drugima</ion-label>
        <ion-icon slot="end" name="share-social-outline"></ion-icon>
      </ion-item>

      <ion-item button (click)="nativePluginsService.rateApp()">
        <ion-label>Ocijeni nas na Google Play</ion-label>
        <ion-icon slot="end" name="star-outline"></ion-icon>
      </ion-item>

      <ion-item button (click)="goTo('/tabs/settings')">
        <ion-label>Postavke</ion-label>
        <ion-icon slot="end" name="settings-outline"></ion-icon>
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(public popoverCtrl: PopoverController, private router: Router, public nativePluginsService: NativePluginsService) {}

  goTo(url) {
    this.router.navigate([url]);
    this.popoverCtrl.dismiss();
  }
}
