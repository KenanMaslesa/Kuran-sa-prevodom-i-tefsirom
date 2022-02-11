import { Component, OnInit } from '@angular/core';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.page.html',
  styleUrls: ['./translation.page.scss'],
})
export class TranslationPage implements OnInit {
  translation: any;

  constructor(private quranService: QuranService) { }

  ngOnInit() {
    this.getTranslation();
  }

  getTranslation() {
    this.quranService.getTranslation().subscribe(response => {
      this.translation = response;
    });
  }

  getTranslationForAyah() {

  }

}
