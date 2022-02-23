import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuranService } from '../quran.service';
import { TrackerService } from './tracker.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  pages = [];
  showPages = true;
  showSurahs = false;
  constructor(
    public trackerService: TrackerService,
    public quranService: QuranService,
    private router: Router
  ) {}

  ngOnInit() {
    for (let i = 1; i <= 604; i++) {
      this.pages.push(i);
    }
  }

  segmentChanged(value) {
    if (value === 'pages') {
      this.showPages = true;
      this.showSurahs = false;
    } else if (value === 'surahs') {
      this.showPages = false;
      this.showSurahs = true;
    }
  }

  goTo(url, sura) {
    this.quranService.setCurrentPage(sura.startpage?sura.startpage: sura);
    this.quranService.currentPageChanged.next(true);
    this.router.navigate([url]);
  }
}
