import { Component } from '@angular/core';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { QuranService } from './quran/quran.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(private quranService: QuranService, private insomnia: Insomnia) {
    this.quranService.showLoader = true;
    const themeColor = localStorage.getItem('theme');

    if (themeColor) {
      document.documentElement.style.setProperty(
        `--ion-color-primary`,
        `${JSON.parse(themeColor)}`
      );
    } else {
      localStorage.setItem('theme', JSON.stringify('#536a9e'));
    }

    //keep app awake
    this.insomnia.keepAwake().then(
      () => console.log('app is awake'),
      () => console.log('error')
    );
  }
}
