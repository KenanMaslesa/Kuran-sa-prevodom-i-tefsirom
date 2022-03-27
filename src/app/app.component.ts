import { Component } from '@angular/core';
import { CachingService } from './shared/caching.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private cachingService: CachingService) {
    this.cachingService.initStorage();

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
