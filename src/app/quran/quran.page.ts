import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { QuranService } from './quran.service';

enum Tabs {
  home = 'home',
  holyQuran = 'holy-quran',
  translation = 'translation',
  bookmarks = 'bookmarks',
}
@Component({
  selector: 'app-quran',
  templateUrl: './quran.page.html',
})
export class QuranPage {
  @ViewChild('tabs', { static: false }) tabs: IonTabs;
  tabsValue = Tabs;
  selectedTab: string;
  showLoader = false;
  constructor(public quranService: QuranService, private router: Router) {
  }

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
  }

  goTo(url) {
    this.quranService.showLoader = true;
    this.router.navigateByUrl(`/tabs/${url}`,{
      replaceUrl : true //remove page from stack (fix for audio issue when switching between pages)
     });
  }
}
