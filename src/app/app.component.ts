import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { QuranService } from './quran/quran.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  constructor(private quranService: QuranService, private ga: GoogleAnalytics) {
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

    //gogle analytics
    this.ga.startTrackerWithId('UA-XXXXXXXXXX-X')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('Outbox')
        .then(() => {
        })
        .catch(
          error => console.log(error)
        );
       }).catch(
        error => console.log('Google Analytics Error: ' + error)
      );
  }
}
