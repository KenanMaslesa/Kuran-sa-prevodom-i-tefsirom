import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonSlides, PopoverController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import {
  NativePluginsService,
  SCREEN_ORIENTATIONS,
} from 'src/app/shared/native-plugins.service';
import { PlatformService } from 'src/app/shared/platform.service';
import { PopoverPage, PopoverTypes } from 'src/app/shared/popover';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Juz, QuranWords, Sura } from '../quran.models';
import { QuranService } from '../quran.service';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-holy-quran',
  templateUrl: './holy-quran.page.html',
  styleUrls: ['./holy-quran.page.scss'],
})
export class HolyQuranPage {
  @ViewChild('slider') private slider: IonSlides;
  @ViewChild('content') private content: IonContent;
  subs: Subscription = new Subscription();
  public suraList$: Observable<Sura[]>;
  public screenOrientation$: Observable<any>;
  quranWordsForCurrentPage$: Observable<QuranWords>;
  quranWordsForCurrentPage: QuranWords[] = [];
  slideOpts = {
    loop: true,
    initialSlide: 1,
  };
  quranWords$: Observable<any>;
  routePageId: number;
  routeAyahIndex: number;
  ayahCounter: number;
  sura$: Observable<Sura[]>;
  juz$: Observable<Juz>;
  showGoToPageButton = false;
  constructor(
    public quranService: QuranService,
    private route: ActivatedRoute,
    public mediaPlayerService: MediaPlayerService,
    public bookmarksService: BookmarksService,
    public platformService: PlatformService,
    private router: Router,
    public nativePluginsService: NativePluginsService,
    private changeDetectorRef: ChangeDetectorRef,
    private popoverCtrl: PopoverController,
    public settingsService: SettingsService
  ) {
    this.suraList$ = this.quranService.getSuraList();

    this.routePageId = +this.route.snapshot.params.page;
    this.routeAyahIndex = +this.route.snapshot.params.ayah;
    if (this.routePageId) {
      this.quranService.setCurrentPage(this.routePageId - 1);
    }
    this.getWordsForCurrentPage();

    //switch slide when last ayah on current page is played
    this.subs.add(
      this.mediaPlayerService.switchSlide.subscribe(() => {
        this.quranService.setCurrentPage(this.quranService.currentPage - 1); //zato sto ce mi se povecati stranica u this.loadNext();
        this.loadNext();
        setTimeout(() => {
          this.mediaPlayerService.slideSwitched.emit(true);
        }, 1000);
      })
    );

    //screen orientation
    this.screenOrientation$ = this.nativePluginsService.screenOrientation
      .onChange()
      .pipe(
        tap(() => {
          this.nativePluginsService.currentScreenOrientation =
            this.nativePluginsService.screenOrientation.type;
          this.changeDetectorRef.detectChanges();
        })
      );

    //page is changed
    this.subs.add(
      this.quranService.currentPageChanged.subscribe(() => {
        this.quranWordsForCurrentPage = [];
        this.getWordsForCurrentPage();
        this.slider.slideTo(1, 50, false).then(() => {
          this.showGoToPageButton = false;
          setTimeout(() => {
            this.quranService.showLoader = false;
          }, 200);
        });
      })
    );

    //scroll into playing ayah
    this.subs.add(
      this.mediaPlayerService.scrollIntoPlayingAyah.subscribe(
        (activeAyahId) => {
          if (this.nativePluginsService.isLandscape()) {
            this.scroll(activeAyahId);
          }
        }
      )
    );
  }

  getWordsForCurrentPage() {
    this.getSuraByPageNumber(this.quranService.currentPage);
    this.getJuzByPageNumber(this.quranService.currentPage);
    this.quranWordsForCurrentPage$ = this.quranService
      .getQuranWordsByPage(this.quranService.currentPage)
      .pipe(
        tap((response) => {
          this.quranWordsForCurrentPage.push(response);
        })
      );
  }

  getSuraByPageNumber(page) {
    this.sura$ = this.quranService.getSuraByPageNumber(page);
  }

  getJuzByPageNumber(page) {
    this.juz$ = this.quranService.getJuzByPageNumber(page);
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
    // this.mediaPlayerService.removePlayer();
    this.quranService.showHeaderAndTabs = true;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.quranService.showLoader = false;
    }, 1000);
    if (
      this.mediaPlayerService.player &&
      this.nativePluginsService.isLandscape()
    ) {
      setTimeout(() => {
        this.scroll(this.mediaPlayerService.playingCurrentAyah);
      }, 500);
    }
  }

  loadPrev() {
    this.scrollToTop();
    this.quranService.showLoader = true;

    if (this.quranService.currentPage <= 2) {
      this.slider.lockSwipeToPrev(true);
    }

    this.quranService.setCurrentPage(this.quranService.currentPage - 1);
    this.quranWordsForCurrentPage = [];
    this.getWordsForCurrentPage();
    this.slider.slideTo(1, 50, false).then(() => {
      setTimeout(() => {
        this.quranService.showLoader = false;
      }, 200);
    });
  }

  loadNext() {
    this.scrollToTop();

    this.quranService.showLoader = true;
    if (this.quranService.currentPage >= 1) {
      this.slider.lockSwipeToPrev(false);
    }

    this.quranService.setCurrentPage(this.quranService.currentPage + 1);
    this.quranWordsForCurrentPage = [];
    this.getWordsForCurrentPage();
    this.slider.slideTo(1, 50, false).then(() => {
      setTimeout(() => {
        this.quranService.showLoader = false;
      }, 200);
    });
  }

  //AUDIO
  playWord(url) {
    this.quranService.showLoader = true;
    let audioUrl = 'https://dl.salamquran.com/wbw/';
    audioUrl += url;
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onplay = () => {
      setTimeout(() => {
        this.quranService.showLoader = false;
      }, 400);
    };
  }

  playAyah(ayahIndex) {
    this.subs.add(
      this.quranService
        .getOrdinalNumberOfAyahOnPage(ayahIndex, this.quranService.currentPage)
        .subscribe((ordinalnumber) => {
          this.quranService
            .getNumberOfAyahsByPage(this.quranService.currentPage)
            .subscribe((numberOfAyahs) => {
              this.mediaPlayerService.playAudio(
                ayahIndex,
                ordinalnumber,
                this.quranService.currentPage,
                numberOfAyahs
              );
            });
        })
    );
  }

  //bookmarks
  addBookmark(sura) {
    let bookmarkSuraName = '';
    const names = sura.map(
      (item) => item.name.arabic && item.name.bosnianTranscription
    );
    names.forEach((name, index) => {
      if (index + 1 < names.length) {
        bookmarkSuraName += name + ', ';
      } else {
        bookmarkSuraName += name;
      }
    });
    this.bookmarksService.addBookmark({
      pageNumber: this.quranService.currentPage,
      sura: bookmarkSuraName,
      date: new Date(),
    });
  }
  deleteBookmark(page: number) {
    this.bookmarksService.deleteBookmark(page);
  }
  checkIsInBookmark() {
    return this.bookmarksService.checkIsInBookmark(
      this.quranService.currentPage
    );
  }

  goToHomePage() {
    this.router.navigateByUrl('/', {
      replaceUrl: true,
    });
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event,
      componentProps: { popoverType: PopoverTypes.quranPage },
    });
    await popover.present();
  }

  scroll(id) {
    const ayah = document.getElementById(id);
    if (ayah) {
      ayah.scrollIntoView({
        behavior: 'smooth',
      });
    } else {
      console.log('Nema ajeta sa ID: ' + id);
    }
  }

  scrollToTop() {
    this.content.scrollToTop(1000);
  }
}
