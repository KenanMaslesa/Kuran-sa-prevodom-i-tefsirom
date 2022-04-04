import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Juz, Sura, TafsirAyah } from '../quran.models';
import { QuranService } from '../quran.service';
import { ModalPage } from './modal/modal.page';

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
export class HomePage {
  public readonly segments = Segments;
  public readonly suraTypes = SuraTypes;
  public selectedSuraTypes = SuraTypes.both;
  public readonly sortOptions = SortOptions;
  public selectedSortOptions = SortOptions.byOrderInMushaf;
  public showSearchForSuraSegment = false;
  public showSearchForJuzSegment = false;
  public selectedSegment: Segments;
  public suraList$: Observable<Sura[]>;
  public juzList$: Observable<Juz[]>;

  //search ayahs
  public dataStream$: Observable<any>;
  public allAyahs: TafsirAyah[] = [];
  public lazyLoadedAyahs: TafsirAyah[] = [];
  public selectedAyah: any;
  public loadMoreIndex = 0;
  public readonly numberOfLoadedAyahsOnScroll = 5;

  constructor(private quranService: QuranService, private router: Router, private modalController: ModalController) {
    this.selectedSegment = this.segments.sura;
    this.suraList$ = this.quranService.getSuraList();
    this.juzList$ = this.quranService.getJuzList();
  }

  ionViewDidEnter() {
      this.quranService.showLoader = false;
  }

  searchByTerm(searchTerm) {
    this.suraList$ = this.quranService.searchSuraByBosnianName(searchTerm);
  }

  searchByCity(type: SuraTypes) {
    this.selectedSortOptions = SortOptions.byOrderInMushaf;
    if (type === this.suraTypes.meccan) {
      this.suraList$ = this.quranService.getSuraListPublishedInMekka();
    } else if (type === this.suraTypes.medinan) {
      this.suraList$ = this.quranService.getSuraListPublishedInMedina();
    } else if (type === this.suraTypes.both) {
      this.suraList$ = this.quranService.getSuraList();
    }
  }

  sortSuraListByOrder(sortOption: SortOptions) {
    this.selectedSuraTypes = SuraTypes.both;
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

  //search ayahs
  searchAyahs(searchTerm) {
    if(searchTerm.length !== 0) {
      this.dataStream$ = this.quranService.searchAyahs(searchTerm).pipe(
        tap(response => {
          this.allAyahs = response;
          this.loadMoreIndex = 0;
          this.lazyLoadedAyahs = [];
          if(this.allAyahs.length >= 1){
            this.loadMoreAyahs(this.loadMoreIndex);
          }
        })
      );
    }
    else {
      this.dataStream$ = of(null);
      this.lazyLoadedAyahs = [];
    }
  }

  loadData(event) {
      event.target.complete();
      if (this.lazyLoadedAyahs.length >= this.allAyahs.length) {
        event.target.disabled = true;
        return;
      }
      this.loadMoreAyahs(this.loadMoreIndex);
  }

  loadMoreAyahs(loadMoreIndex) {
    let counter = 0;
    for(let i = loadMoreIndex * this.numberOfLoadedAyahsOnScroll; i < this.allAyahs.length; i++) {

      if (counter >= this.numberOfLoadedAyahsOnScroll) {
        this.loadMoreIndex++;
        return;
      }
      else {
        this.lazyLoadedAyahs.push(this.allAyahs[i]);
        counter++;
      }
    }
  }

  async presentModal(page, ayah = null) {
    const modal = await this.modalController.create({
      component: ModalPage,
      initialBreakpoint: 0.2,
      componentProps: {
        page,
        ayah
      },
    });
    return await modal.present();
  }
}
