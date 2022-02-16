import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides } from '@ionic/angular';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.page.html',
  styleUrls: ['./translation.page.scss'],
})
export class TranslationPage implements OnInit {
  @ViewChild('slides', { static: true }) slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;
  showArabic = true;
  showTranslation = true;
  showTafsir = true;
  translationForCurrentPage = [];
  ayatsOfCurrentPage = [];
  arrayOfIndexes = [];
  selectedAyah: number;
  slideOpts = {
    initialSlide: 1,
    speed: 50,
    loop: true,
  };

  constructor(public quranService: QuranService, public mediaPlayerService: MediaPlayerService) {
   }

  ngOnInit() {
    this.getTafsirAndTranslationForPage(this.quranService.currentPage);
    this.quranService.currentPageChanged.subscribe(()=> {
      this.onSuraChanged(this.quranService.currentPage);
    });
  }

  ionViewWillEnter(){
    this.scrollToTop(1000);
  }

  getTafsirAndTranslationForPage(page) {
    this.translationForCurrentPage = this.quranService.getTafsirAndTranslationForPage(page);
  }

  onSuraChanged(pageNumber) {
    this.scrollToTop(1000);
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

  playAyah(ayahId){
    this.selectedAyah = ayahId;
    this.mediaPlayerService.playAudio(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahId}.mp3`);
  }

  scrollToBottom(){
    this.content.scrollToBottom(1500);
  }

  scrollToTop(duration){
    this.content.scrollToTop(duration);
  }

  scrollToElement(elementId){
    const y = document.getElementById(elementId).offsetTop;
    this.content.scrollToPoint(0, y - 20, 1000);
  }
}
