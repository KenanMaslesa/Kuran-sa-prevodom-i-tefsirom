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
    this.ayatsOfCurrentPage = this.quranService.getAyatsByPage(
      this.quranService.currentPage
    );
    this.getIndexesFromPage(this.ayatsOfCurrentPage);
    this.quranService.currentPageChanged.subscribe(()=> {
      this.onSuraChanged(this.quranService.currentPage);
    });
  }

  getIndexesFromPage(ayats: any[]) {
    if (ayats) {
      ayats.forEach((aya) => {
        this.arrayOfIndexes.push(aya.index);
        this.translationForCurrentPage.push({
          translation: this.getTranslationForIndex(aya.index),
          text: aya.text,
          juz: aya.juz,
          page: aya.page,
          verseKey: aya.verse_key,
        });
      });
    }
  }

  getTranslationForIndex(index) {
    const response = this.quranService.getTranslationForIndex(+index);
    return response;
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
    this.getIndexesFromPage(this.ayatsOfCurrentPage);
  }

  slideTo(slideNumber) {
    this.slides.slideTo(slideNumber);
  }
}
