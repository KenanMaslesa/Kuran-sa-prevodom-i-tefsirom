import { Component, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage {
  @ViewChild('slider') private slider: IonSlides;
  newIndex: number;
  quranWordsForCurrentPage = [];
  hideAyhas = false;
  numbers = [0, 1, 2];
  firstLoad = true;
  slideOpts = {
    loop: true,
    initialSlide: 1,
    // speed:500
  };
  allQuranWords = [];
  allQuranWords$: Observable<any>;

  constructor(public quranService: QuranService) {
    this.allQuranWords$ = this.quranService.getAllQuranWords().pipe(
      tap((response) => {
        const newArray = [];
        this.allQuranWords = response;
        this.allQuranWords.forEach((element, index) => {
          newArray.push({ words: [...element], page: index + 1 });
        });
        this.allQuranWords = newArray;
        this.quranWordsForCurrentPage.push(
          this.allQuranWords[this.quranService.currentPage - 1]
        );
      })
    );
  }

  loadPrev() {
    if(this.quranService.currentPage === 1) {
      this.slider.lockSwipeToPrev(true);
    }

    this.hideAyhas = true;
    this.quranService.setCurrentPage(this.quranService.currentPage - 1);
    this.quranWordsForCurrentPage = [];
    this.quranWordsForCurrentPage.push(
      this.allQuranWords[this.quranService.currentPage - 1]
    );
    this.slider.slideTo(1, 50, false).then(()=> {
      setTimeout(() => {
        this.hideAyhas = false;
      }, 300);
    });
    console.log('loadPrev');
  }

  loadNext() {
    this.hideAyhas = true;
    if(this.quranService.currentPage !== 1) {
      this.slider.lockSwipeToPrev(false);
    }

    this.quranService.setCurrentPage(this.quranService.currentPage + 1);
    this.quranWordsForCurrentPage = [];
    this.quranWordsForCurrentPage.push(
      this.allQuranWords[this.quranService.currentPage - 1]
    );
    this.slider.slideTo(1, 50, false).then(()=> {
      setTimeout(() => {
        this.hideAyhas = false;
      }, 300);
    });
    console.log('loadNext');
  }
}
