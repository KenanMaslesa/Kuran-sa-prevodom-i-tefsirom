import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.page.html',
  styleUrls: ['./translation.page.scss'],
})
export class TranslationPage implements OnInit {
  @ViewChild('slides', { static: true }) slides: IonSlides;
  showArabic = false;
  translationForCurrentPage = [];
  ayatsOfCurrentPage = [];
  arrayOfIndexes = [];
  slideOpts = {
    initialSlide: 1,
    speed: 50,
    loop: true,
  };

  constructor(public quranService: QuranService) {
   }

  ngOnInit() {
    this.getTafsirAndTranslationForPage(this.quranService.currentPage);
    this.quranService.currentPageChanged.subscribe(()=> {
      this.onSuraChanged(this.quranService.currentPage);
    });
  }

  getTafsirAndTranslationForPage(page) {
    this.translationForCurrentPage = this.quranService.getTafsirAndTranslationForPage(page);
  }

  onSuraChanged(pageNumber) {
    if (pageNumber === 1) {
      this.slides.lockSwipeToPrev(true);
    } else {
      this.slides.lockSwipeToPrev(false);
    }

    if (pageNumber === 604) {
      this.slides.lockSwipeToNext(true);
    } else {
      this.slides.lockSwipeToNext(false);
    }
    this.quranService.currentPage = pageNumber;
    localStorage.setItem('currentPage', pageNumber);
    this.ayatsOfCurrentPage = this.quranService.getAyatsByPage(
      this.quranService.currentPage
    );

    this.translationForCurrentPage = [];
    this.getTafsirAndTranslationForPage(this.quranService.currentPage);
  }

  slideTo(slideNumber) {
    this.slides.slideTo(slideNumber);
  }
}
