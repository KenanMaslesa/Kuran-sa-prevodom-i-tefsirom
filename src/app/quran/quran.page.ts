import { Component } from '@angular/core';
import { QuranService } from './quran.service';
@Component({
  selector: 'app-quran',
  templateUrl: './quran.page.html',
})
export class QuranPage {
  constructor(public quranService: QuranService) {
  }
}
