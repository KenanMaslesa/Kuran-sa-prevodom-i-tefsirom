import { Component, OnInit } from '@angular/core';
import { QuranService } from './quran.service';
@Component({
  selector: 'app-quran',
  templateUrl: './quran.page.html',
})
export class QuranPage {
  defaultTab: string;
  constructor(private quranService: QuranService) {
    this.defaultTab = `quran-template/${this.quranService.currentPage}`;
  }
}
