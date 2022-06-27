import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, IonSlides, PopoverController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MainPopoverComponent } from 'src/app/quran/shared/components/popovers/main-popover/main-popover.component';
import { MediaPlayerService } from 'src/app/quran/shared/services/media-player.service';
import {
  NativePluginsService,
} from 'src/app/quran/shared/services/native-plugins.service';
import { PlatformService } from 'src/app/quran/shared/services/platform.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { QuranTrackerService } from '../bookmarks/tracker/quran-tracker.service';
import { Juz, QuranWords, Sura } from '../../shared/quran.models';
import { QuranService } from '../../shared/services/quran.service';
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
    public settingsService: SettingsService,
    private alertController: AlertController,
    public quranTrackerService: QuranTrackerService
  ) {
    this.suraList$ = this.quranService.getSuraList();

    this.routePageId = +this.route.snapshot.params.page;
    this.routeAyahIndex = +this.route.snapshot.params.ayah;
    if (this.routePageId) {
      this.quranService.setCurrentPage(this.routePageId - 1);
    }
    this.getWordsForCurrentPage();


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
          if (this.nativePluginsService.isLandscape() || this.quranService.showTranslationModal) {
            setTimeout(() => {
              this.scroll(activeAyahId);
            }, 100);
          }
        }
      )
    );

    //hifz player ended
    this.subs.add(
      this.mediaPlayerService.hifzPlayerEnded.subscribe(ended => {
        if(ended) {
          this.presentAlertConfirmHifzPlayerEnded();
        }
      })
    );

    //scroll to ayah (when ayah is clicked on transcription modal)
    this.subs.add(
      this.quranService.scrollToAyah.subscribe(ayahId => {
        this.scroll(ayahId);
      })
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
    if(this.mediaPlayerService.hifzIsPlaying) {
      this.presentAlertConfirm(ayahIndex);
      this.mediaPlayerService.pauseAudio();
    }
    else {
      this.mediaPlayerService.playingCurrentAyahChanged.emit(true);
      this.mediaPlayerService.playAudio(
        ayahIndex
      );
    }

  }

  async presentAlertConfirm(ayahIndex) {
    const alert = await this.alertController.create({
      header: 'Prekidanje hifza',
      message: 'Jeste li sigurni da želite prekinuti hifz?',
      buttons: [
        {
          text: 'NE',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.mediaPlayerService.continueAudio();
          },
        },
        {
          text: 'Da',
          handler: () => {
            this.mediaPlayerService.hifzIsPlaying = false;
            this.mediaPlayerService.playAudio(
              ayahIndex
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertConfirmHifzPlayerEnded() {
    const alert = await this.alertController.create({
      header: 'Odabrani opseg proučen',
      message: 'Želite li nastaviti učiti?',
      buttons: [
        {
          text: 'NE',
          handler: () => {
            this.mediaPlayerService.showHifzPlayer = false;
            this.mediaPlayerService.hifzIsPlaying = false;
            this.mediaPlayerService.removePlayer();
          },
        },
        {
          text: 'Da',
          handler: () => {
            this.mediaPlayerService.showHifzPlayer = true;
          },
        },
      ],
    });

    await alert.present();
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
      component: MainPopoverComponent,
      event,
      componentProps: {
        showTranslationToggle: true
      }
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

  trackerAddOrRemovePage() {
    this.quranTrackerService.addOrRemovePage(this.quranTrackerService.isCurrentPageCompleted? false : true, this.quranService.currentPage);
  }
}
