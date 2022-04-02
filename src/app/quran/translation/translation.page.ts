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
  ayahList: Tafsir;
  ayahListLazyLoaded = [];
  numberOfLoadedPagesOnSlide = 1;
  showLoader = false;
  routeSuraId: number;
  routePageId: number;
  routeAyahId: number;
  sliderActiveIndex: number;
  isCurrentPageInBookmarks = false;
  moreInfoAboutSura = false;
  startPage = 1;
  ayahsPerPage = [];
  pagesArray = [];

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

    if (this.routePageId) {
      this.quranService.setCurrentPage(this.routePageId);
    }

    //switch slide when last ayah on current page is played
    this.subs.add(
      this.mediaPlayerService.switchSlide.subscribe(() => {
        this.setStream();
        setTimeout(() => {
          this.mediaPlayerService.slideSwitched.emit(true);
        }, 1000);
      })
    );

    //scroll into playing ayah
    this.subs.add(
      this.mediaPlayerService.scrollIntoPlayingAyah.subscribe(
        (activeAyahId) => {
          this.scroll(activeAyahId);
        }
      )
    );

    this.setStream();
  }

  setStream() {
    this.dataStream$ = this.quranService
      .getTafsirAndTranslationForPage(this.quranService.currentPage)
      .pipe(
        tap((response) => {
          this.ayahList = response;
        })
      );
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
    // this.router.navigateByUrl('/', { replaceUrl: true }); //da ukloni sa steka stranicu da bi samo skrolalo kad se pusti audio ali pravi problem sa tabovima/navigacijom, skontati netso
  }

  ionViewWillEnter() {
    if (this.routePageId) {
      this.quranService.setCurrentPage(this.routePageId)
    }
    this.setStream();
  }

  onSuraChanged(page) {
    this.quranService.setCurrentPage(page);
    this.setStream();
  }

  ionViewDidLeave() {
    this.mediaPlayerService.removePlayer();
  }

  slideTo(page) {
    this.slides.slideTo(page);
    this.showLoader = false;
  }

  scroll(id) {
    console.log('SCOLL INTO AYAH WITH ID:' + id);
    const ayah = document.getElementById(id);
    ayah.scrollIntoView({
      behavior: 'smooth',
    });
  }

  playAyah(ayah, ayahNumberOnCurrentPage) {
    this.mediaPlayerService.playAudio(
      ayah.index,
      ayahNumberOnCurrentPage,
      this.quranService.currentPage,
      this.ayahList.ayahsPerPages.length
    );
  }

  ionContentScrollToTop(duration = 2000) {
    this.ionContent.scrollToTop(duration);
  }

  disableInfiniteScroll(value: boolean) {
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = value;
    }
  }

  displayCityBySuraType(type) {
    if (type === 'Meccan') {
      return 'Mekki';
    } else if (type === 'Medinan') {
      return 'Medini';
    }
  }

  setSliderActiveIndex(suraInfo) {
    if (this.slides !== undefined) {
      this.slides.getActiveIndex().then((index: number) => {
        this.sliderActiveIndex = index;
        this.checkIsPageInBookmarks(suraInfo);
      });
    }
  }

  checkIsPageInBookmarks(suraInfo) {
    this.isCurrentPageInBookmarks = this.storage.isInBookmarks(
      suraInfo,
      this.sliderActiveIndex
    );
  }
}
