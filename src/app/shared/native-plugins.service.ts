/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { TafsirAyah } from '../quran/quran.models';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { PlatformService } from './platform.service';

export enum SCREEN_ORIENTATIONS {
  PORTRAIT_PRIMARY = 'portrait-primary',
  PORTRAIT_SECONDARY = 'portrait-secondary',
  LANDSCAPE_PRIMARY = 'landscape-primary',
  LANDSCAPE_SECONDARY = 'landscape-secondary',
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
  ANY = 'any',
}

@Injectable({ providedIn: 'root' })
export class NativePluginsService {
  androidAppUrl = 'https://play.google.com/store/apps/details?id=com.coding.kuran';
  iosAppUrl = 'https://apps.apple.com/us/app/kuran-sa-prevodom-i-tefsirom/id1619092709?platform=iphone';
  allAndroidApsUrl =
    // eslint-disable-next-line max-len
    'https://play.google.com/store/apps/collection/cluster?clp=igM4ChkKEzg3ODY5NTcyOTM0MTczNDQ1MDMQCBgDEhkKEzg3ODY5NTcyOTM0MTczNDQ1MDMQCBgDGAA%3D:S:ANO1ljIGrkw&gsr=CjuKAzgKGQoTODc4Njk1NzI5MzQxNzM0NDUwMxAIGAMSGQoTODc4Njk1NzI5MzQxNzM0NDUwMxAIGAMYAA%3D%3D:S:ANO1ljLgMiE';
    allIosApsUrl = 'https://apps.apple.com/us/developer/kenan-maslesa/id1619092711';
  donateUrl = 'https://www.paypal.com/paypalme/coding97';
  currentScreenOrientation: string;
  constructor(
    private socialSharing: SocialSharing,
    public screenOrientation: ScreenOrientation,
    private platformService: PlatformService
  ) {
    this.currentScreenOrientation = this.screenOrientation.type;
  }

  shareApp() {
    if(this.platformService.isAndroid) {
      this.socialSharing.share('', '', '', this.androidAppUrl);
    }
    if(this.platformService.isIOS) {
      this.socialSharing.share('', '', '', this.iosAppUrl);
    }
  }

  share(message?: string, subject?: string, file?: string, url?: string) {
    this.socialSharing.share(message, subject, file, url);
  }

  rateApp() {
    if(this.platformService.isAndroid) {
      window.location.href = this.androidAppUrl;
    }
    if(this.platformService.isIOS) {
      window.location.href = this.iosAppUrl;
    }
  }

  allAps() {
    if(this.platformService.isAndroid) {
      window.location.href = this.allAndroidApsUrl;
    }
    if(this.platformService.isIOS) {
      window.location.href = this.allIosApsUrl;
    }
  }

  donate() {
    window.location.href = this.donateUrl;
  }

  shareAyah(suraTitle: string, ayah: TafsirAyah) {
    const message = `
    ${ayah.aya}\n\n
    Prijevod:
    "${ayah.korkutsTranslation}"\n\n
    Tefsir:
    ${ayah.tafsir}\n\n
    (Sura ${suraTitle}, ${ayah.ayaNumber}. ajet)
    `;
    this.share(message);
  }

  //orientation
  getCurrentScreenOrientation() {
    return this.screenOrientation.type;
  }

  isPortrait(): boolean {
    return (
      this.currentScreenOrientation === SCREEN_ORIENTATIONS.PORTRAIT ||
      this.currentScreenOrientation === SCREEN_ORIENTATIONS.PORTRAIT_PRIMARY ||
      this.currentScreenOrientation === SCREEN_ORIENTATIONS.PORTRAIT_SECONDARY
    );
  }

  isLandscape(): boolean {
    return (
      this.currentScreenOrientation === SCREEN_ORIENTATIONS.LANDSCAPE ||
      this.currentScreenOrientation === SCREEN_ORIENTATIONS.LANDSCAPE_PRIMARY ||
      this.currentScreenOrientation === SCREEN_ORIENTATIONS.LANDSCAPE_SECONDARY
    );
  }

  setScreenOrientationToLandscape() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  setScreenOrientationToPortrait() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  unlockScreenOrientation() {
    this.screenOrientation.unlock();
  }

  watchSceenOrientationChanges() {
    this.screenOrientation.onChange().subscribe(() => {
      this.currentScreenOrientation = this.screenOrientation.type;
    });
  }
}
