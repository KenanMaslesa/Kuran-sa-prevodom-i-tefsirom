import { Injectable } from '@angular/core';

export interface BookmarksItem {
  pageNumber: number;
  sura?: any;
  date?: string;
}
@Injectable({ providedIn: 'root' })
export class BookmarksService {
  bookmarks: BookmarksItem[] = [];
  tafsirBookmarks: BookmarksItem[] = [];
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

  addBookmark(bookmarksItem: BookmarksItem) {
    this.bookmarks.push(bookmarksItem);
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
  }

  deleteBookmark(bookmarksItem: BookmarksItem){
    this.bookmarks = this.bookmarks.filter(item => item.pageNumber !== bookmarksItem.pageNumber);
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
  }

  checkIsInBookmark(bookmarksItemPageNumber: number){
    return this.bookmarks.some(item => item.pageNumber === bookmarksItemPageNumber);
  }


  addTafsirBookmark(bookmarksItem: BookmarksItem) {
    this.tafsirBookmarks.push(bookmarksItem);
    localStorage.setItem('tafsirBookmarks', JSON.stringify(this.tafsirBookmarks));
  }

  deleteTafsirBookmark(bookmarksItem: BookmarksItem){
    this.tafsirBookmarks = this.tafsirBookmarks.filter(item => item.pageNumber !== bookmarksItem.pageNumber);
    localStorage.setItem('tafsirBookmarks', JSON.stringify(this.tafsirBookmarks));
  }

  checkIsInTafsirBookmark(bookmarksItemPageNumber: number){
    return this.tafsirBookmarks.some(item => item.pageNumber === bookmarksItemPageNumber);
  }
}
