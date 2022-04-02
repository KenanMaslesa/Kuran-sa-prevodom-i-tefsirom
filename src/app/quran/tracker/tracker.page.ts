import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { QuranService } from '../quran.service';
import { TrackerService } from './tracker.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  translationPages = false;
  arabicPages = true;
  suraList;
  suraListLazyLoaded = [];
  loadMoreIndex = 0;
  constructor(
    public trackerService: TrackerService,
    public quranService: QuranService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSuraList();
  }

  ionViewWillEnter(){
    this.initData();
  }

  initData() {
    this.loadMoreIndex = 0;
    this.suraListLazyLoaded = [];
    this.disableInfiniteScroll(false);
    if(this.suraList){
      this.loadMoreSura(this.loadMoreIndex++);
    }
  }

  goTo(url, sura) {
    this.quranService.setCurrentPage(+sura.startpage);
    this.quranService.currentPageChanged.next(true);
    this.router.navigate([url]);
  }

  ionContentScrollToTop(duration = 1000) {
    this.ionContent.scrollToTop(duration);
  }

  calculateTotalSuraPages(endPage: number, startPage: number) {
    return endPage - startPage + 1;
  }

  segmentChanged(value) {
    this.initData();
    if (value === 'translationPages') {
      this.translationPages = true;
      this.arabicPages = false;
    } else if (value === 'arabicPages') {
      this.translationPages = false;
      this.arabicPages = true;
    }
  }

  loadData(event) {
    this.loadMoreSura(this.loadMoreIndex++);
    event.target.complete();

    if (this.suraListLazyLoaded.length === this.suraList.length) {
      this.disableInfiniteScroll(true);
    }
  }

  loadMoreSura(index) {
    const numberOfLoadedSurahsOnScroll = 15;
    let counter = 0;
    for (
      let i = index * numberOfLoadedSurahsOnScroll;
      i < this.suraList.length;
      i++
    ) {
      this.suraListLazyLoaded.push(this.suraList[i]);
      counter++;

      if (counter >= numberOfLoadedSurahsOnScroll) {
        return;
      }
    }
  }

  getSuraList() {
    // this.suraList = this.quranService.suraList;
    this.loadMoreSura(this.loadMoreIndex++);
  }

  disableInfiniteScroll(value: boolean) {
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = value;
    }
  }
}
