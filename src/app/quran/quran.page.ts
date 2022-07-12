import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { LocalStorageKeysSettings } from './screens/settings/settings.page';
import { QuranService } from './shared/services/quran.service';
import { TimeTrackingService } from './shared/services/time-tracking.service';

enum Tabs {
  home = 'home',
  holyQuran = 'holy-quran',
  translation = 'translation',
  tracker = 'tracker',
}
@Component({
  selector: 'app-quran',
  templateUrl: './quran.page.html',
})
export class QuranPage {
  @ViewChild('tabs', { static: false }) tabs: IonTabs;
  tabsValue = Tabs;
  selectedTab: string;
  constructor(public quranService: QuranService, private router: Router, private timeTrackingService: TimeTrackingService) {
    const fontSize = localStorage.getItem(LocalStorageKeysSettings.fontSize);
    const fontSizeLandscape = localStorage.getItem(LocalStorageKeysSettings.fontSizeLandscape);
    const lineHeight = localStorage.getItem(LocalStorageKeysSettings.lineHeight);
    const lineHeightLandscape = localStorage.getItem(LocalStorageKeysSettings.lineHeightLandscape);

    if(this.timeTrackingService.trackTimeSpendInApp) {
      this.timeTrackingService.trackTime();
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

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
  }

  goTo(url) {
    if(this.selectedTab === url) {
      return;
    }
    if(url === this.tabsValue.holyQuran || url === this.tabsValue.translation) {
      this.quranService.setCurrentPage(this.quranService.currentPage-1);
    }
    this.quranService.showLoader = true;
    this.router.navigateByUrl(`quran/tabs/${url}`,{
      replaceUrl : true //remove page from stack (fix for audio issue when switching between pages)
     });
  }
}
