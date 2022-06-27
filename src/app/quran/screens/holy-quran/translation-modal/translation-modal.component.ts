import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuranService } from '../../../shared/services/quran.service';
import { MediaPlayerService } from '../../../shared/services/media-player.service';

@Component({
  selector: 'app-translation-modal',
  templateUrl: './translation-modal.component.html',
  styleUrls: ['./translation-modal.component.scss'],
})
export class TranslationModalComponent implements OnInit, OnDestroy, AfterViewInit {
  ayahList = [];
  subs: Subscription = new Subscription();

  constructor(public quranService: QuranService, public mediaPlayerService: MediaPlayerService) { }

  ngAfterViewInit(): void {
    this.scroll(this.mediaPlayerService.playingCurrentAyah);
  }

  ngOnInit() {
    this.subs.add(
      this.quranService.currentPageChanged.subscribe(() => {
        this.getTafsirAndTranslationForPage(this.quranService.currentPage);
      })
    );
    this.subs.add(
      this.mediaPlayerService.playingCurrentAyahChanged.subscribe(() => {
        setTimeout(() => {
          this.scroll(this.mediaPlayerService.playingCurrentAyah);
        }, 400);
      })
    );
    this.getTafsirAndTranslationForPage(this.quranService.currentPage);

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getTafsirAndTranslationForPage(page) {
    this.ayahList = [];
    this.subs.add(
      this.quranService.getTafsirAndTranslationForPage(page).subscribe(response => {
        this.ayahList.push(response);
      })
    );
  }

  markAyah(ayahIndex) {
    this.quranService.markedAyah = ayahIndex;
    this.quranService.scrollToAyah.emit(ayahIndex);
  }

  scroll(id) {
    const ayah = document.getElementById('translated-ayah'+id);
    if (ayah) {
      ayah.scrollIntoView({
        behavior: 'smooth',
      });
    } else {
      console.log('Nema ajeta sa ID: ' + id);
    }
  }

}

