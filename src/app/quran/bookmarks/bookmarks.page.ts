import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuranService } from '../quran.service';
import { BookmarksItem, BookmarksService } from './bookmarks.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {

  constructor(public bookmarksService: BookmarksService, private quranService: QuranService, private router: Router) { }

  ngOnInit() {
  }

  deleteBookmark(pageNumber){
    const item: BookmarksItem = {
      pageNumber: +pageNumber,
    };
    this.bookmarksService.deleteBookmark(item);
  }

  deleteTafsirBookmark(pageNumber){
    const item: BookmarksItem = {
      pageNumber: +pageNumber,
    };
    this.bookmarksService.deleteTafsirBookmark(item);
  }

  goTo(url, item: BookmarksItem){
    this.quranService.currentPage = item.pageNumber;
    this.quranService.currentPageChanged.next(true);
    this.router.navigate([url]);
  }

}
