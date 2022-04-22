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
        <ion-label>Podijelite sa drugima</ion-label>
        <ion-icon slot="end" name="share-social-outline"></ion-icon>
      </ion-item>

      <ion-item button (click)="nativePluginsService.rateApp()">
        <ion-label>Ocijenite nas na Google Play</ion-label>
        <ion-icon slot="end" name="star-outline"></ion-icon>
      </ion-item>

      <ion-item button (click)="nativePluginsService.donate()">
        <ion-label>Podržite naš rad</ion-label>
        <ion-icon slot="end" name="gift-outline"></ion-icon>
      </ion-item>

      <ion-item button (click)="nativePluginsService.allAps()">
        <ion-label>Druge aplikacije</ion-label>
        <ion-icon slot="end" name="layers-outline"></ion-icon>
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
    this.router.navigateByUrl(`${url}`,{
      replaceUrl : true
     });
    this.popoverCtrl.dismiss();
  }
}
