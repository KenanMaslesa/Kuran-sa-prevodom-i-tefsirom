import { Component, ViewChild } from '@angular/core';
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

  constructor(public quranService: QuranService) {
  }

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
  }

}
