import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-holy-quran',
  templateUrl: './holy-quran.page.html',
  styleUrls: ['./holy-quran.page.scss'],
})
export class HolyQuranPage {
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
  routePageId: number;


  constructor(public quranService: QuranService, private route: ActivatedRoute) {
    this.routePageId = +this.route.snapshot.params.page;
    if(this.routePageId) {
      this.quranService.setCurrentPage(this.routePageId);
    }
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
    //AUDIO
    playWord(url) {
      let audioUrl = 'https://dl.salamquran.com/wbw/';
      audioUrl += url;
      const audio = new Audio(audioUrl);
      audio.play();
    }
    playAyat(ayahIndex) {
      const activeAyahs = document.querySelectorAll('.ayah'+ayahIndex);
      activeAyahs.forEach(element => {
        element.classList.add('active');
      });
      const audio = new Audio(`https://cdn.islamic.network/quran/audio/${this.quranService.qari}/${ayahIndex}.mp3`);
        audio.play();
    }
}
