import { Injectable } from '@angular/core';

export enum StorageKeys {
  favorite = 'favorite',
  bookmarks = 'bookmarks',
}
@Injectable({ providedIn: 'root' })
export class StorageService {
  favoriteAyahs = [];
  bookmarksAyahs = [];
  constructor() {
    const favoriteAyahs = localStorage.getItem(StorageKeys.favorite);
    const bookmarksAyahs = localStorage.getItem(StorageKeys.bookmarks);
    if (favoriteAyahs) {
      this.favoriteAyahs = JSON.parse(favoriteAyahs);
    }
    if (bookmarksAyahs) {
      this.bookmarksAyahs = JSON.parse(bookmarksAyahs);
    }
  }

  //favorites
  addToFavorites(ayah) {
    this.favoriteAyahs.push(ayah);
    localStorage.setItem(
      StorageKeys.favorite,
      JSON.stringify(this.favoriteAyahs)
    );
  }

  removeFromFavorites(ayah) {
    this.favoriteAyahs = this.favoriteAyahs.filter(
      (item) => item.aya !== ayah.aya
    );
    localStorage.setItem(
      StorageKeys.favorite,
      JSON.stringify(this.favoriteAyahs)
    );
  }

  isFavorite(ayah) {
    return this.favoriteAyahs.find((item) => item.aya === ayah.aya);
  }

  //bookmarks
  addToBookmarks(suraInfo, page) {
    this.bookmarksAyahs.push({
      index: suraInfo.index,
      pageNumber: page,
      realPageNumber: suraInfo.startPage + page,
      name: suraInfo.name,
      date: this.getFormatedDate(new Date()),
    });
    localStorage.setItem(
      StorageKeys.bookmarks,
      JSON.stringify(this.bookmarksAyahs)
    );
  }

  removeFromBookmarks(ayah, pageNumber?) {
    if(pageNumber) {
      this.bookmarksAyahs = this.bookmarksAyahs.filter(item => item.realPageNumber !== ayah.startPage + pageNumber);
    }
    else {
      this.bookmarksAyahs = this.bookmarksAyahs.filter(item => item.realPageNumber !== ayah.realPageNumber);
    }
    localStorage.setItem(
      StorageKeys.bookmarks,
      JSON.stringify(this.bookmarksAyahs)
    );
  }

  isInBookmarks(ayah, pageNumber) {
    return this.bookmarksAyahs.find((item) => item.realPageNumber === ayah.startPage + pageNumber);
  }

  //helpers
  getFormatedDate(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${
      hours < 10 ? '0' + hours : hours
    }:${minutes < 10 ? '0' + minutes : minutes}`;
  }
}
