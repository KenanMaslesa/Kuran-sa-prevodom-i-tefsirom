import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  isAndroid: boolean;
  isIOS: boolean;

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.isAndroid = true;
      } else if (this.platform.is('ios')) {
        this.isIOS = true;
      } else {
        //fallback to browser APIs or
        console.log('The platform is not supported');
      }
    });
  }
}
