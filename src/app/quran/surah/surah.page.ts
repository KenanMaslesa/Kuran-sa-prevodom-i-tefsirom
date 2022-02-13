import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-surah',
  templateUrl: './surah.page.html',
  styleUrls: ['./surah.page.scss'],
})
export class SurahPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) ionContent: IonContent;
  suraList;
  suraListLazyLoaded = [];
  searchSuraList;
  loadMoreIndex = 0;
  isSearchOn = false;
  showSearchHeader = false;
  constructor(public quranService: QuranService) { }

  ngOnInit() {
    this.getSuraList();
  }

  ionViewWillEnter(){
    this.loadMoreIndex = 0;
    this.suraListLazyLoaded = [];
    this.disableInfiniteScroll(false);
    if(this.suraList){
      this.loadMoreSura(this.loadMoreIndex++, this.isSearchOn);
    }
  }

  getSuraList(){
    this.quranService.getListOfSura().subscribe(response => {
      this.suraList = response;
      this.searchSuraList = response;
      this.loadMoreSura(this.loadMoreIndex++, this.isSearchOn);
    });
  }

  loadData(event) {
    this.loadMoreSura(this.loadMoreIndex++, this.isSearchOn);
    event.target.complete();

    if(this.suraListLazyLoaded.length === this.suraList.length){ //ako je sve ucitano iskljuci infinite scroll
      this.disableInfiniteScroll(true);
    }
  }

  disableInfiniteScroll(value: boolean) {
    if(this.infiniteScroll){
      this.infiniteScroll.disabled = value;
    }
  }

  ionContentScrollToTop(duration = 2000){
    this.ionContent.scrollToTop​(duration);
  }

  loadMoreSura(index, isSearchOn){
    const numberOfLoadedSurahsOnScroll = 10;
    let counter = 0;
    if(isSearchOn){
      for(let i = index * numberOfLoadedSurahsOnScroll; i<this.searchSuraList.length; i++){
        this.suraListLazyLoaded.push(this.searchSuraList[i]);
        counter++;
        if (counter >= numberOfLoadedSurahsOnScroll) {
          return;
        }
      }
    }
    else {
      for(let i = index * numberOfLoadedSurahsOnScroll; i<this.suraList.length; i++){
        this.suraListLazyLoaded.push(this.suraList[i]);
        counter++;

        if (counter >= numberOfLoadedSurahsOnScroll) {
          return;
        }
      }
    }

  }

  searchByType(type) {
    this.searchSuraList = this.suraList.filter(item => item.type === type || type === 'all');
    this.onEverySearch();
  }

  sortSuraListByOrder(sortBy) {
    this.searchSuraList = this.suraList.sort((a, b) => {
      if(sortBy === 'desc') {
       return b.order - a.order;
      }
      else if(sortBy === 'asc') {
        return a.order - b.order;
      }
      else {
        return a.index - b.index;
      }
    }
    );
    this.onEverySearch();
  }

  searchByTerm(term) {
    this.searchSuraList = this.suraList.filter(item => item.tname.toLowerCase().indexOf(term.toLowerCase()) !== -1 || term === '');
    this.onEverySearch();
  }

  onEverySearch(){
    this.ionContentScrollToTop(10);
    this.showSearchHeader = false;
    this.loadMoreIndex = 0;
    this.isSearchOn = true;
    this.disableInfiniteScroll(false);
    setTimeout(()=> {
      this.suraListLazyLoaded = [];
      this.loadMoreSura(this.loadMoreIndex++, this.isSearchOn);
    }, 100);
  }
}
