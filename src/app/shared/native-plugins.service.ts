import { Injectable } from '@angular/core';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { TafsirAyah } from '../quran/quran.models';

@Injectable({providedIn: 'root'})
export class NativePluginsService {
  appUrl = 'https://play.google.com/store/apps/details?id=com.coding.kuran';
  allApsUrl = 'https://play.google.com/store/apps/collection/cluster?clp=igM4ChkKEzg3ODY5NTcyOTM0MTczNDQ1MDMQCBgDEhkKEzg3ODY5NTcyOTM0MTczNDQ1MDMQCBgDGAA%3D:S:ANO1ljIGrkw&gsr=CjuKAzgKGQoTODc4Njk1NzI5MzQxNzM0NDUwMxAIGAMSGQoTODc4Njk1NzI5MzQxNzM0NDUwMxAIGAMYAA%3D%3D:S:ANO1ljLgMiE';
  donateUrl = 'https://www.paypal.com/paypalme/coding97';
  constructor(private socialSharing: SocialSharing) { }

  shareApp() {
    this.socialSharing.share('','','',this.appUrl);
  }

  share(message?: string, subject?: string, file?: string, url?: string) {
    this.socialSharing.share(message, subject, file, url);
  }

  rateApp() {
    window.location.href = this.appUrl;
  }

  allAps() {
    window.location.href = this.allApsUrl;
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
}
