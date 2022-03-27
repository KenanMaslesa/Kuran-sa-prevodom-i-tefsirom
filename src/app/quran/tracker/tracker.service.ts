import { Injectable } from '@angular/core';

enum LocalStorageKeys {
  completedQuranPages = 'completedQuranPages',
  completedTranslationPages = 'completedTranslationPages',
}
@Injectable({providedIn: 'root'})
export class TrackerService {
  completedQuranPages = [];
  completedTranslationPages = [];
  constructor() {
    const completedQuranPagesFromStorage = localStorage.getItem(LocalStorageKeys.completedQuranPages);
    const completedTranslationPagesFromStorage = localStorage.getItem(LocalStorageKeys.completedTranslationPages);
    if(completedQuranPagesFromStorage){
      this.completedQuranPages = JSON.parse(completedQuranPagesFromStorage);
    }
    if(completedTranslationPagesFromStorage){
      this.completedTranslationPages = JSON.parse(completedTranslationPagesFromStorage);
    }
   }

  addQuranPageToComplated(pageNumber: number){
    if(this.isQuranPageCompleted(pageNumber)){
      return;
    }
    this.completedQuranPages.push(pageNumber);
    localStorage.setItem(LocalStorageKeys.completedQuranPages, JSON.stringify(this.completedQuranPages));
  }

  addTranslationPageToComplated(pageNumber: number){
    if(this.isTranslationPageCompleted(pageNumber)){
      return;
    }
    this.completedTranslationPages.push(pageNumber);
    localStorage.setItem(LocalStorageKeys.completedTranslationPages, JSON.stringify(this.completedTranslationPages));
  }

  removeQuranPageFromComplated(pageNumber: number){
    this.completedQuranPages = this.completedQuranPages.filter(item => item !== pageNumber);
    localStorage.setItem(LocalStorageKeys.completedQuranPages, JSON.stringify(this.completedQuranPages));
  }

  removeTranslationPageFromComplated(pageNumber: number){
    this.completedTranslationPages = this.completedTranslationPages.filter(item => item !== pageNumber);
    localStorage.setItem(LocalStorageKeys.completedTranslationPages, JSON.stringify(this.completedTranslationPages));
  }

  isQuranPageCompleted(pageNumber: number){
    return this.completedQuranPages.some(item => +item === pageNumber);
  }

  isTranslationPageCompleted(pageNumber: number){
    return this.completedTranslationPages.some(item => +item === pageNumber);
  }

  getQuranCounterForRange(startPage: number, endPage: number){
    const counter = this.completedQuranPages.filter(item => item >= startPage && item <= endPage).length;
    return counter;
  }

  getTranslationCounterForRange(startPage: number, endPage: number){
    const counter = this.completedTranslationPages.filter(item => item >= startPage && item <= endPage).length;
    return counter;
  }

  removeAllCompletedQuranPages() {
    this.completedQuranPages = [];
    localStorage.setItem(LocalStorageKeys.completedQuranPages, JSON.stringify(this.completedQuranPages));
  }

  removeAllCompletedTranslationPages() {
    this.completedTranslationPages = [];
    localStorage.setItem(LocalStorageKeys.completedTranslationPages, JSON.stringify(this.completedTranslationPages));
  }
}
