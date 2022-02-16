import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-juz',
  templateUrl: './juz.page.html',
  styleUrls: ['./juz.page.scss'],
})
export class JuzPage implements OnInit {
  juzList = [];
  suraList = [];
  constructor(public quranService: QuranService, private router: Router) { }

  ngOnInit() {
    this.getJuzList();
    this.getSuraList();
  }

  getJuzList() {
    this.quranService.getJuzs().subscribe(response => {
      this.juzList = response;
    });
  }

  getSuraList() {
    this.quranService.getListOfSura().subscribe(response => {
      this.suraList = response;
    });
  }

  goTo(url, juz){
    this.quranService.currentPage = juz.startPage;
    this.quranService.currentPageChanged.next(true);
    this.router.navigate([url]);
  }
}
