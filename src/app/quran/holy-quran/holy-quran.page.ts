import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { BookMarkItem, BookmarksService } from '../bookmarks/bookmarks.service';
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
  quranWordsForCurrentPage: QuranWords[] = [];
  slideOpts = {
    loop: true,
    initialSlide: 1,
    // speed:500
  };
  quranWords$: Observable<any>;
  routePageId: number;
  ayahCounter: number;
  sura$: Observable<Sura>;
  juz$: Observable<Juz>;

  constructor(
    public quranService: QuranService,
    private route: ActivatedRoute,
    public mediaPlayerService: MediaPlayerService,
    public bookmarksService: BookmarksService
  ) {
    this.suraList$ = this.quranService.getSuraList();
    this.routePageId = +this.route.snapshot.params.page;
    if (this.routePageId) {
      this.quranService.setCurrentPage(this.routePageId-1);
    }

    this.subs.add(this.getWordsForCurrentPage());

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

  getWordsForCurrentPage(): Subscription {
    this.getSuraByPageNumber(this.quranService.currentPage);
    this.getJuzByPageNumber(this.quranService.currentPage);
    return this.quranService
      .getQuranWordsByPage(this.quranService.currentPage)
      .subscribe((response) => {
        this.quranWordsForCurrentPage.push(response);
      });
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

    if (this.quranService.currentPage === 1) {
      this.slider.lockSwipeToPrev(true);
    }

    this.quranService.setCurrentPage(this.quranService.currentPage - 1);
    this.quranWordsForCurrentPage = [];
    this.subs.add(this.getWordsForCurrentPage());
    this.slider.slideTo(1, 50, false).then(()=> {
      setTimeout(() => {
        this.quranService.showLoader = false;
      }, 200);
    });
  }

  loadNext() {
    this.quranService.showLoader = true;
    if (this.quranService.currentPage !== 1) {
      this.slider.lockSwipeToPrev(false);
    }

    this.quranService.setCurrentPage(this.quranService.currentPage + 1);
    this.quranWordsForCurrentPage = [];
    this.subs.add(this.getWordsForCurrentPage());
    this.slider.slideTo(1, 50, false).then(()=> {
      setTimeout(() => {
        this.quranService.showLoader = false;
      }, 200);
    });
  }

  //AUDIO
  playWord(url) {
    let audioUrl = 'https://dl.salamquran.com/wbw/';
    audioUrl += url;
    const audio = new Audio(audioUrl);
    audio.play();
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
    this.bookmarksService.addBookmark({
      pageNumber: this.quranService.currentPage,
      sura,
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
}
