import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, IonSlides } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { StorageService } from 'src/app/shared/storage.service';
import { Tafsir } from '../quran.models';
import { QuranService } from '../quran.service';
@Component({
  selector: 'app-translation',
  templateUrl: './translation.page.html',
  styleUrls: ['./translation.page.scss'],
})
export class TranslationPage {
  @ViewChild(IonContent) ionContent: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSlides) slides: IonSlides;

  dataStream$: Observable<any>;
  subs: Subscription = new Subscription();
  loadMoreIndex = 0;
  ayahList = [];
  ayahListLazyLoaded = [];
  numberOfLoadedPagesOnSlide = 1;
  showLoader = false;
  routeSuraId: number;
  routePageId: number;
  routeAyahId: number;
  sliderActiveIndex: number;
  isCurrentPageInBookmarks = false;
  moreInfoAboutSura = false;
  slideOpts = {
    loop: true,
    initialSlide: 1,
    // speed:500
  };
  constructor(
    private route: ActivatedRoute,
    public quranService: QuranService,
    public storage: StorageService,
    public mediaPlayerService: MediaPlayerService,
    private router: Router
  ) {
    this.routeSuraId = +this.route.snapshot.params.id;
    this.routePageId = +this.route.snapshot.params.page;
    this.routeAyahId = +this.route.snapshot.params.ayah;

    //switch slide when last ayah on current page is played
    this.subs.add(
      this.mediaPlayerService.switchSlide.subscribe(() => {
        this.slides.slideTo(this.quranService.currentPage).finally(()=> {
          setTimeout(() => {
            this.mediaPlayerService.slideSwitched.emit(true);
          }, 1000);
        });
      })
    );

    //scroll into playing ayah
    this.subs.add(
      this.mediaPlayerService.scrollIntoPlayingAyah.subscribe(activeAyahId => {
        console.log('this.mediaPlayerService.scrollIntoPlayingAyah.subscribe: SCROL');
        this.scroll(activeAyahId);
      })
    );

  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
  }

  ionViewWillEnter() {
    this.setStream();
  }

  ionViewDidLeave() {
    this.mediaPlayerService.removePlayer();
  }

  loadMoreByFragmentAndThenScroll(fragment) {
    this.showLoader = true;

    for (let i = 0; i <= fragment; i++) {
      this.loadMoreIndex++;
      this.ayahListLazyLoaded.push(this.ayahList[i]);
    }
      this.slides.slideTo(this.routePageId).finally(()=> {
        if(this.routeAyahId) {
          setTimeout(() => {
            this.scroll(this.routeAyahId);
            this.showLoader = false;
            }, 2500);
        }
        else {
          this.showLoader = false;
        }
      });

  }

  slideTo(page) {
    this.slides.slideTo(page);
    this.showLoader = false;
  }

  scroll(id) {
    const ayah = document.getElementById(id);
    if(ayah){
      ayah.scrollIntoView({
        behavior: 'smooth'
      });
    }
    else {
      console.log('Nema ajeta sa ID: ' + id);
    }
  }

  loadNext() {
    if(this.quranService.currentPage !== 1) {
      this.slides.lockSwipeToPrev(false);
    }
    this.ayahList = [];
    this.quranService.setCurrentPage(this.quranService.currentPage+1);
    this.setStream();
    this.slides.slideTo(1, 50, false);
  }

  loadPrev() {
    if(this.quranService.currentPage === 1) {
      this.slides.lockSwipeToPrev(true);
    }

    this.ayahList = [];
    this.quranService.setCurrentPage(this.quranService.currentPage-1);
    this.setStream();

    this.slides.slideTo(1, 50, false);
  }

  setStream() {
    this.ayahList = [];
    this.dataStream$ = this.quranService
      .getTafsirAndTranslationForPage(this.quranService.currentPage)
      .pipe(
        tap((response) => {
          this.ayahList.push(response.ayahsPerPages);
        })
      );
  }

  playAyah(ayah, ayahOrderNumberOnPage) {
    this.mediaPlayerService.playAudioForTranslationPage(
      ayah.index,
      ayah.ayaNumber,
      this.ayahList,
      this.quranService.currentPage,
      ayahOrderNumberOnPage
    );
  }

  loadMorePages() {
    let counter = 0;
    for (
      let i = this.loadMoreIndex * this.numberOfLoadedPagesOnSlide;
      i < this.ayahList.length;
      i++
    ) {
      this.ayahListLazyLoaded.push(this.ayahList[i]);
      counter++;

      if (counter >= this.numberOfLoadedPagesOnSlide) {
        this.loadMoreIndex++;
        return;
      }
    }
  }

  displayCityBySuraType(type) {
    if (type === 'Meccan') {
      return 'Mekki';
    } else if (type === 'Medinan') {
      return 'Medini';
    }
  }

  checkIsPageInBookmarks(suraInfo) {
    this.isCurrentPageInBookmarks = this.storage.isInBookmarks(
      suraInfo,
      this.sliderActiveIndex
    );
  }
}
