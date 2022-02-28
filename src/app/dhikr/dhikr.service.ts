import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export enum DhikrLocalStoarge {
  'showArabicDhikr',
  'showBosnianDhikr',
  'showDhikrTranslation',
  'showSlider'
}
@Injectable({
  providedIn: 'root'
})
export class DhikrService {
  morningDhikrPageEntered: Subject<boolean>;
  eveningDhikrPageEntered: Subject<boolean>;
  showArabicDhikr: boolean;
  showBosnianDhikr: boolean;
  showDhikrTranslation: boolean;
  showSlider: boolean;

  constructor(private http: HttpClient) {
    this.morningDhikrPageEntered = new Subject();
    this.eveningDhikrPageEntered = new Subject();
    this.getItemsFromLocalStoarge();
   }

  getMorningDhikr() {
    return this.http.get<any[]>('assets/db/dhikr.json').pipe(
      map(response => response.filter(item => item.category === 'MORNING' || item.category === 'MORNING&EVENING'))
    );
  }

  getEveningDhikr() {
    return this.http.get<any[]>('assets/db/dhikr.json').pipe(
      map(response => response.filter(item => item.category === 'EVENING' || item.category === 'MORNING&EVENING'))
    );
  }

  getDhikrBeforeSleeping(){
    return this.http.get<any[]>('assets/db/dhikr.json').pipe(
      map(response => response.filter(item => item.category === 'BEFORE-SLEEPING'))
    );
  }

  getItemsFromLocalStoarge() {
    const showArabicDhikrFromStorage = localStorage.getItem(DhikrLocalStoarge.showArabicDhikr.toString());
    const showBosnianDhikrFromStorage = localStorage.getItem(DhikrLocalStoarge.showBosnianDhikr.toString());
    const showDhikrTranslationFromStorage = localStorage.getItem(DhikrLocalStoarge.showDhikrTranslation.toString());
    const showSliderFromStorage = localStorage.getItem(DhikrLocalStoarge.showSlider.toString());

    if(showArabicDhikrFromStorage){
      this.showArabicDhikr = JSON.parse(showArabicDhikrFromStorage);
    }
    else {
      this.showArabicDhikr = true;
    }

    if(showBosnianDhikrFromStorage){
      this.showBosnianDhikr = JSON.parse(showBosnianDhikrFromStorage);
    }
    else {
      this.showBosnianDhikr = true;
    }

    if(showDhikrTranslationFromStorage){
      this.showDhikrTranslation = JSON.parse(showDhikrTranslationFromStorage);
    }
    else {
      this.showDhikrTranslation = true;
    }

    if(showSliderFromStorage){
      this.showSlider = JSON.parse(showSliderFromStorage);
    }
    else {
      this.showSlider = false;
    }
  }

  onModelChange(item: DhikrLocalStoarge, value: boolean) {
    if(item === DhikrLocalStoarge.showArabicDhikr){
      localStorage.setItem(DhikrLocalStoarge.showArabicDhikr.toString(), JSON.stringify(value));
    }
    else if(item === DhikrLocalStoarge.showDhikrTranslation){
      localStorage.setItem(DhikrLocalStoarge.showDhikrTranslation.toString(), JSON.stringify(value));
    }
    else if(item === DhikrLocalStoarge.showBosnianDhikr){
      localStorage.setItem(DhikrLocalStoarge.showBosnianDhikr.toString(), JSON.stringify(value));
    }
  }

  onShowSliderModelChange(value) {
      localStorage.setItem(DhikrLocalStoarge.showSlider.toString(), JSON.stringify(value));
  }
}
