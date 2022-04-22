import { Component } from '@angular/core';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { QuranService } from './quran/quran.service';
import { LocalStorageKeysSettings } from './quran/settings/settings.page';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(private quranService: QuranService, private insomnia: Insomnia) {
    this.quranService.showLoader = true;

    //keep app awake
    this.insomnia.keepAwake().then(
      () => console.log('app is awake'),
      () => console.log('error')
    );

    const themeColor = localStorage.getItem(LocalStorageKeysSettings.theme);
    const fontSize = localStorage.getItem(LocalStorageKeysSettings.fontSize);
    const fontSizeLandscape = localStorage.getItem(LocalStorageKeysSettings.fontSizeLandscape);
    const lineHeight = localStorage.getItem(LocalStorageKeysSettings.lineHeight);
    const lineHeightLandscape = localStorage.getItem(LocalStorageKeysSettings.lineHeightLandscape);
    if (themeColor) {
      document.documentElement.style.setProperty(
        `--ion-color-primary`,
        `${JSON.parse(themeColor)}`
      );
    } else {
      localStorage.setItem('theme', JSON.stringify('#536a9e'));
    }

    if(fontSize) {
      document.documentElement.style.setProperty(
        `--quran-font-size`,
        `${fontSize}px`
      );
    }
    if(lineHeight) {
      document.documentElement.style.setProperty(
        `--quran-line-height`,
        `${lineHeight}px`
      );
    }
    if(fontSizeLandscape) {
      document.documentElement.style.setProperty(
        `--quran-landscape-font-size`,
        `${fontSizeLandscape}px`
      );
    }
    if(lineHeightLandscape) {
      document.documentElement.style.setProperty(
        `--quran-landscape-line-height`,
        `${lineHeightLandscape}px`
      );
    }
  }
}
