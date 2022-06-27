import { Injectable } from '@angular/core';
import { Sura } from '../../shared/quran.models';

export class BookMarkItem {
  sura: string;
  pageNumber: number;
  date: Date;
}
@Injectable({ providedIn: 'root' })
export class BookmarksService {
  bookmarks: BookMarkItem[] = [];
  tafsirBookmarks: BookMarkItem[] = [];
  constructor() {
    const bookmarksFromStorage = localStorage.getItem('bookmarks');
    if (bookmarksFromStorage) {
      this.bookmarks = JSON.parse(bookmarksFromStorage);
    }

    const tafsirBookmarksFromStorage = localStorage.getItem('tafsirBookmarks');
    if (tafsirBookmarksFromStorage) {
      this.tafsirBookmarks = JSON.parse(tafsirBookmarksFromStorage);
    }
  }

  addBookmark(bookmarksItem: BookMarkItem) {
    this.bookmarks.push(bookmarksItem);
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
  }

  deleteBookmark(bookmarksItemPage: number){
    this.bookmarks = this.bookmarks.filter(item => item.pageNumber !== bookmarksItemPage);
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
  }

  checkIsInBookmark(pageNumber: number){
    return this.bookmarks.some(item => item.pageNumber === pageNumber);
  }


  addTafsirBookmark(bookmarksItem: BookMarkItem) {
    this.tafsirBookmarks.push(bookmarksItem);
    localStorage.setItem('tafsirBookmarks', JSON.stringify(this.tafsirBookmarks));
  }

  deleteTafsirBookmark(pageNumber: number){
    this.tafsirBookmarks = this.tafsirBookmarks.filter(item => item.pageNumber !== pageNumber);
    localStorage.setItem('tafsirBookmarks', JSON.stringify(this.tafsirBookmarks));
  }

  checkIsInTafsirBookmark(pageNumber: number){
    return this.tafsirBookmarks.some(item => item.pageNumber === pageNumber);
  }
}
