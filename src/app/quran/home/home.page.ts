import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Juz, Sura } from '../quran.models';
import { QuranService } from '../quran.service';

enum Segments {
  sura = 'sura',
  juz = 'juz',
  page = 'page',
}

enum SuraTypes {
  meccan = 'Meccan',
  medinan = 'Medinan',
  both = 'both',
}

enum SortOptions {
  byLastPublished = 'desc',
  byFirstPublished = 'asc',
  byOrderInMushaf = 'normal',
}
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public readonly segments = Segments;
  public readonly suraTypes = SuraTypes;
  public readonly sortOptions = SortOptions;
  public showSearchForSuraSegment = false;
  public selectedSegment: Segments;
  public suraList$: Observable<Sura[]>;
  public juzList$: Observable<Juz[]>;

  constructor(private quranService: QuranService, private router: Router, private modalController: ModalController) {
    this.selectedSegment = this.segments.sura;
    this.suraList$ = this.quranService.getSuraList();
    this.juzList$ = this.quranService.getJuzList();
  }

  ngOnInit() {}

  ionViewDidEnter() {
    setTimeout(() => {
      this.quranService.showLoader = false;
    }, 1000);
  }

  searchByTerm(searchTerm) {
    this.suraList$ = this.quranService.searchSuraByBosnianName(searchTerm);
  }

  searchByCity(type: SuraTypes) {
    if (type === this.suraTypes.meccan) {
      this.suraList$ = this.quranService.getSuraListPublishedInMekka();
    } else if (type === this.suraTypes.medinan) {
      this.suraList$ = this.quranService.getSuraListPublishedInMedina();
    } else if (type === this.suraTypes.both) {
      this.suraList$ = this.quranService.getSuraList();
    }
  }

  sortSuraListByOrder(sortOption: SortOptions) {
    if (sortOption === this.sortOptions.byFirstPublished) {
      this.suraList$ = this.quranService.sortSuraListByFirstPublished();
    } else if (sortOption === this.sortOptions.byLastPublished) {
      this.suraList$ = this.quranService.sortSuraListByLastPublished();
    } else if (sortOption === this.sortOptions.byOrderInMushaf) {
      this.suraList$ = this.quranService.getSuraList();
    }
  }

  searchJuzListById(juzId) {
    this.juzList$ = this.quranService.searchJuzListById(juzId);
  }
}
