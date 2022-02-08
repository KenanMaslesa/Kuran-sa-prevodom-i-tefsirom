import { Component } from '@angular/core';
import { CachingService } from './shared/caching.service';
import { NativePluginsService } from './shared/native-plugins.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  pages = [
    {
      title: 'Jutarnji zikr',
      route: '/dhikr',
      icon: 'heart'
    },
    {
      title: 'Vaktija',
      route: '/prayer',
      icon: 'heart'
    },
    {
      title: `Kur'an`,
      route: '/quran',
      icon: 'heart'
    }
  ];

  constructor(private nativePluginsService: NativePluginsService, private cachingService: CachingService) {
    this.cachingService.initStorage();
    this.nativePluginsService.getCurrentLocation();
  }
}
