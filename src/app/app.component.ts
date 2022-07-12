import { Component } from '@angular/core';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { LocalStorageKeysSettings } from './quran/screens/settings/settings.page';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(private insomnia: Insomnia) {
    //keep app awake
    this.insomnia.keepAwake().then(
      () => console.log('app is awake'),
      () => console.log('error')
    );

    const themeColor = localStorage.getItem(LocalStorageKeysSettings.theme);
    const themeBackgroundColor = localStorage.getItem('themeBackgroundColor');

    if (themeColor) {
      document.documentElement.style.setProperty(
        `--ion-color-primary`,
        `${JSON.parse(themeColor)}`
      );
    } else {
      localStorage.setItem('theme', JSON.stringify('#536a9e'));
    }

    if (themeBackgroundColor) {
      document.documentElement.style.setProperty(
        `--background-color`,
        `${JSON.parse(themeBackgroundColor)}`
      );
    }
  }
}
