import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { QuranService } from './quran.service';

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
  constructor(public quranService: QuranService, private router: Router) {
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
    this.router.navigateByUrl(`/tabs/${url}`,{
      replaceUrl : true //remove page from stack (fix for audio issue when switching between pages)
     });
  }
}
