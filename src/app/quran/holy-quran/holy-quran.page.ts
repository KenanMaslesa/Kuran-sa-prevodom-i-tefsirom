import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { PlatformService } from 'src/app/shared/platform.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Juz, QuranWords, Sura } from '../quran.models';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-holy-quran',
  templateUrl: './holy-quran.page.html',
  styleUrls: ['./holy-quran.page.scss'],
})
export class HolyQuranPage {
  @ViewChild('slider') private slider: IonSlides;
  subs: Subscription = new Subscription();
  public suraList$: Observable<Sura[]>;
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
    public platformService: PlatformService
  ) {
    this.suraList$ = this.quranService.getSuraList();

    this.routePageId = +this.route.snapshot.params.page;
    this.routeAyahIndex = +this.route.snapshot.params.ayah;
    if (this.routePageId) {
      this.quranService.setCurrentPage(this.routePageId-1);
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
  }

  getWordsForCurrentPage() {
    this.getSuraByPageNumber(this.quranService.currentPage);
    this.getJuzByPageNumber(this.quranService.currentPage);
    this.quranWordsForCurrentPage$ = this.quranService
      .getQuranWordsByPage(this.quranService.currentPage)
      .pipe(tap((response) => {
        this.quranWordsForCurrentPage.push(response);
      }));
  }

  getSuraByPageNumber(page) {
    this.sura$ = this.quranService.getSuraByPageNumber(page);
  }

  getJuzByPageNumber(page) {
    this.juz$ = this.quranService.getJuzByPageNumber(page);
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
    this.mediaPlayerService.removePlayer();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.quranService.showLoader = false;
    }, 1000);
  }

  loadPrev() {
    this.quranService.showLoader = true;

    if (this.quranService.currentPage <= 2) {
      this.slider.lockSwipeToPrev(true);
    }

    this.quranService.setCurrentPage(this.quranService.currentPage - 1);
    this.quranWordsForCurrentPage = [];
    this.getWordsForCurrentPage();
    this.slider.slideTo(1, 50, false).then(()=> {
      setTimeout(() => {
        this.quranService.showLoader = false;
      }, 200);
    });
  }

  loadNext() {
    this.quranService.showLoader = true;
    if (this.quranService.currentPage >= 1) {
      this.slider.lockSwipeToPrev(false);
    }

    this.quranService.setCurrentPage(this.quranService.currentPage + 1);
    this.quranWordsForCurrentPage = [];
    this.getWordsForCurrentPage();
    this.slider.slideTo(1, 50, false).then(()=> {
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
    audio.onplay = (()=> {
      setTimeout(() => {
        this.quranService.showLoader = false;
      }, 400);
    });
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
    const names = sura.map(item => item.name.arabic && item.name.bosnianTranscription);
    names.forEach((name, index) => {
      if(index+1 < names.length) {
        bookmarkSuraName += name + ', ';
      }
      else {
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
    this.bookmarksService.deleteBookmark(
      page
    );
  }
  checkIsInBookmark() {
    return this.bookmarksService.checkIsInBookmark(
      this.quranService.currentPage
    );
  }

  goToPage(pageNumber: any) {
    pageNumber = +pageNumber;
    if(pageNumber <= 0 || pageNumber > 604) {return;}

    this.quranService.setCurrentPage(pageNumber);
    this.quranWordsForCurrentPage = [];
    this.getWordsForCurrentPage();
    this.slider.slideTo(1, 50, false).then(()=> {
      this.showGoToPageButton = false;
      setTimeout(() => {
        this.quranService.showLoader = false;
      }, 200);
    });

  }

  checkPage(pageNumber: any) {
    pageNumber = +pageNumber;
    if(pageNumber <= 0 || pageNumber > 604) {
      this.showGoToPageButton = false;
    }
    else {
      this.showGoToPageButton = true;
    }
  }
}
