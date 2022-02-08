import { Component, OnInit } from '@angular/core';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-surah',
  templateUrl: './surah.page.html',
  styleUrls: ['./surah.page.scss'],
})
export class SurahPage implements OnInit {
  suraList;
  searchSuraList;
  constructor(private quranService: QuranService) { }

  ngOnInit() {
    this.getSuraList();
  }

  getSuraList(){
    this.quranService.getListOfSura().subscribe(response => {
      this.suraList = response;
      this.searchSuraList = response;
    });
  }

  searchByType(type) {
    this.searchSuraList = this.suraList.filter(item => item.type === type || type === 'all');
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
  }

  searchByTerm(term) {
    this.searchSuraList = this.suraList.filter(item => item.tname.toLowerCase().indexOf(term.toLowerCase()) !== -1 || term === '');
  }
}
