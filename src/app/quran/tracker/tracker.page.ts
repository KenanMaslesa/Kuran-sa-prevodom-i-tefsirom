import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { QuranService } from '../quran.service';
import { TrackerService } from './tracker.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage {
  @ViewChild(IonContent) ionContent: IonContent;
  pages = [];
  showPages = true;
  showSurahs = false;
  constructor(
    public trackerService: TrackerService,
    public quranService: QuranService,
    private router: Router
  ) {}

  ionViewWillEnter(){
    this.pages = [];
    for (let i = 1; i <= 20; i++) {
      this.pages.push(i);
    }
  }

  segmentChanged(value) {
    if (value === 'pages') {
      this.showPages = true;
      this.showSurahs = false;
    } else if (value === 'surahs') {
      this.showPages = false;
      this.showSurahs = true;
    }
  }

  goTo(url, sura) {
    this.quranService.setCurrentPage(sura.startpage?sura.startpage: sura);
    this.quranService.currentPageChanged.next(true);
    this.router.navigate([url]);
  }

  loadData(event){
    let pagesPerScroll = 0;
    for(let i = this.pages.length; i <= 604; i++){
      pagesPerScroll++;
      if(pagesPerScroll >= 20){
        event.target.complete();
        return;
      }
      this.pages.push(i);
    }

    if(this.pages.length === 604) {
      // this.disableInfiniteScroll(true);
    }
  }

  ionContentScrollToTop(duration = 1000){
    this.ionContent.scrollToTop​(duration);
  }
}
