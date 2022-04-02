import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-holy-quran',
  templateUrl: './holy-quran.page.html',
  styleUrls: ['./holy-quran.page.scss'],
})
export class HolyQuranPage {
  allQuranWords$: Observable<any>;
  allQuranWords = [];
  quranWordsForCurrentPage = [];
  routePageId: number;

  constructor(public quranService: QuranService, private route: ActivatedRoute) {
    this.routePageId = +this.route.snapshot.params.page;
    if(this.routePageId) {
      this.quranService.setCurrentPage(this.routePageId)
    }

    this.allQuranWords$ = this.quranService.getAllQuranWords().pipe(
      tap(response => {
        this.allQuranWords = response;
        this.quranWordsForCurrentPage.push(this.allQuranWords[this.quranService.currentPage-1]);
      })
    );
  }

  onSuraChanged(pageNumber) {
    if (pageNumber < 1) {
      return;
    }
    if (pageNumber > 604) {
      return;
    }
    this.quranService.setCurrentPage(pageNumber)
    this.quranWordsForCurrentPage = [];
    this.quranWordsForCurrentPage.push(this.allQuranWords[this.quranService.currentPage-1]);
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
