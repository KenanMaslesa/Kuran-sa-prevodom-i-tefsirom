import { Component } from '@angular/core';
import { QuranService } from './quran/quran.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  constructor(private quranService: QuranService) {
    this.quranService.showLoader = true;
    const themeColor = localStorage.getItem('theme');

    if (themeColor) {
      document.documentElement.style.setProperty(
        `--ion-color-primary`,
        `${JSON.parse(themeColor)}`
      );
    }
    else {
      localStorage.setItem('theme', JSON.stringify('#536a9e'));
    }
  }
}
