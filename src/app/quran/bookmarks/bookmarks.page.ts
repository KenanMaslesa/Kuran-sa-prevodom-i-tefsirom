import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Sura } from '../quran.models';
import { QuranService } from '../quran.service';
import {BookmarksService } from './bookmarks.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage {

  constructor(public bookmarksService: BookmarksService, private quranService: QuranService, private router: Router) { }

  goTo(url, pageNumber){
    this.quranService.setCurrentPage(pageNumber-1);
    this.quranService.currentPageChanged.next(true);
    this.router.navigate([url]);
  }

  ionViewDidEnter() {
      this.quranService.showLoader = false;
  }

}
