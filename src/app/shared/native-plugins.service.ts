import { Injectable } from '@angular/core';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ToastController } from '@ionic/angular';
import { TafsirAyah } from '../quran/quran.models';

@Injectable({providedIn: 'root'})
export class NativePluginsService {
  appUrl = 'https://play.google.com/store/apps/details?id=com.coding.kuran';
  constructor(private socialSharing: SocialSharing, private toastController: ToastController) { }

  shareApp() {
    this.socialSharing.share('','','',this.appUrl);
  }

  share(message?: string, subject?: string, file?: string, url?: string) {
    this.socialSharing.share(message, subject, file, url);
  }

  rateApp() {
    window.location.href = this.appUrl;
  }

  shareAyah(ayah: TafsirAyah) {
    const message = `
    ${ayah.aya}\n\n
    Prijevod:
    ${ayah.korkutsTranslation}\n\n
    Tefsir:
    ${ayah.tafsir}\n\n
    #Kur'an
    `;
    this.share(message);
  }
}
