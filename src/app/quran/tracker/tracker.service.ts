import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class TrackerService {
  completedPages = [];
  constructor() {
    const completedPagesFromStorage = localStorage.getItem('completedPages');
    if(completedPagesFromStorage){
      this.completedPages = JSON.parse(completedPagesFromStorage);
    }
   }

  addPageToComplated(pageNumber){
    if(this.isPageCompleted(pageNumber)){
      return;
    }
    this.completedPages.push(pageNumber);
    localStorage.setItem('completedPages', JSON.stringify(this.completedPages));
  }

  removePageFromComplated(pageNumber){
    this.completedPages = this.completedPages.filter(item => item !== pageNumber);
    localStorage.setItem('completedPages', JSON.stringify(this.completedPages));
  }

  isPageCompleted(pageNumber){
    return this.completedPages.some(item => item === pageNumber);
  }

  getCounterForRange(startPage, endPage){
    const counter = this.completedPages.filter(item => item >= +startPage && item <= +endPage).length;
    return counter;
  }
}
