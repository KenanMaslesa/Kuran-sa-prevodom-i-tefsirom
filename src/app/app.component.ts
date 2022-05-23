import { Component } from '@angular/core';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { LocalStorageKeysSettings } from './quran/settings/settings.page';
import { TimeTrackingService } from './shared/time-tracking.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(private insomnia: Insomnia, private timeTrackingService: TimeTrackingService) {
    if(this.timeTrackingService.trackTimeSpendInApp) {
      this.timeTrackingService.trackTime();
    }
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
