import { Component, OnDestroy } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable, of, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MainPopoverComponent } from 'src/app/shared/components/popovers/main-popover/main-popover.component';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { PlatformService } from 'src/app/shared/platform.service';
import { Juz, Sura, TafsirAyah } from '../quran.models';
import { QuranService } from '../quran.service';
import { ModalPage } from './modal/modal.page';

enum Segments {
  sura = 'sura',
  juz = 'juz',
  ayah = 'ayah',
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
export class HomePage implements OnDestroy {
  public readonly segments = Segments;
  public selectedSegment: Segments;
  public readonly suraTypes = SuraTypes;
  public selectedSuraTypes = SuraTypes.both;
  public readonly sortOptions = SortOptions;
  public selectedSortOptions = SortOptions.byOrderInMushaf;
  public showSearchForSuraSegment = false;
  public showSearchForJuzSegment = false;
  public suraList: Sura[] = [];
  public juzList: Juz[] = [];
  public subs: Subscription = new Subscription();

  //search ayahs
  public dataStream$: Observable<any>;
  public allAyahs: TafsirAyah[] = [];
  public lazyLoadedAyahs: TafsirAyah[] = [];
  public selectedAyah: any;
  public loadMoreIndex = 0;
  public readonly numberOfLoadedAyahsOnScroll = 10;

  constructor(
    private quranService: QuranService,
    public popoverCtrl: PopoverController,
    private modalController: ModalController,
    public platformService: PlatformService,
    private mediaPlayerService: MediaPlayerService
  ) {
    this.selectedSegment = this.segments.sura;
    this.getSuraList();
    this.getJuzList();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getSuraList() {
    if(this.suraList.length === 0) {
      this.subs.add(
        this.quranService.getSuraList().subscribe(response => {
          this.suraList = response;
        })
      );
    }
  }

  getJuzList() {
    if(this.juzList.length === 0) {
      this.subs.add(
        this.quranService.getJuzList().subscribe(response => {
          this.juzList = response;
        })
      );
    }
  }

  ionViewDidEnter() {
    this.quranService.showLoader = false;
    this.mediaPlayerService.removePlayer();
  }

  searchByTerm(searchTerm) {
    this.subs.add(
      this.quranService.searchSuraByBosnianName(searchTerm).subscribe(response => {
        this.suraList = response;
      })
    );
  }

  searchByCity(type: SuraTypes) {
    this.selectedSortOptions = SortOptions.byOrderInMushaf;
    if (type === this.suraTypes.meccan) {
      this.subs.add(this.quranService.getSuraListPublishedInMekka().subscribe(response => {
        this.suraList = response;
      }));
    } else if (type === this.suraTypes.medinan) {
      this.subs.add(this.quranService.getSuraListPublishedInMedina().subscribe(response => {
        this.suraList = response;
      }));
    } else if (type === this.suraTypes.both) {
      this.subs.add(this.quranService.getSuraList().subscribe(response => {
        this.suraList = response;
      }));
    }
  }

  sortSuraListByOrder(sortOption: SortOptions) {
    this.selectedSuraTypes = SuraTypes.both;
    if (sortOption === this.sortOptions.byFirstPublished) {
      this.subs.add(this.quranService.sortSuraListByFirstPublished().subscribe(response => {
        this.suraList = response;
      }));
    } else if (sortOption === this.sortOptions.byLastPublished) {
      this.subs.add(this.quranService.sortSuraListByLastPublished().subscribe(response => {
        this.suraList = response;
      }));
    } else if (sortOption === this.sortOptions.byOrderInMushaf) {
      this.subs.add(this.quranService.getSuraList().subscribe(response => {
        this.suraList = response;
      }));
    }
  }

  searchJuzListById(juzId) {
    this.subs.add(this.quranService.searchJuzListById(juzId).subscribe(response => {
      this.juzList = response;
    }));
  }

  //search ayahs
  searchAyahs(searchTerm) {
    if (searchTerm.length !== 0) {
      this.dataStream$ = this.quranService.searchAyahs(searchTerm).pipe(
        tap((response) => {
          this.allAyahs = response;
          this.loadMoreIndex = 0;
          this.lazyLoadedAyahs = [];
          if (this.allAyahs.length >= 1) {
            this.loadMoreAyahs(this.loadMoreIndex);
          }
        })
      );
    } else {
      this.dataStream$ = of(null);
      this.lazyLoadedAyahs = [];
    }
  }

  loadAyahs(event) {
    event.target.complete();
    if (this.lazyLoadedAyahs.length >= this.allAyahs.length) {
      event.target.disabled = true;
      return;
    }
    this.loadMoreAyahs(this.loadMoreIndex);
  }

  loadMoreAyahs(loadMoreIndex) {
    let counter = 0;
    for (
      let i = loadMoreIndex * this.numberOfLoadedAyahsOnScroll;
      i < this.allAyahs.length;
      i++
    ) {
      if (counter >= this.numberOfLoadedAyahsOnScroll) {
        this.loadMoreIndex++;
        return;
      } else {
        this.lazyLoadedAyahs.push(this.allAyahs[i]);
        counter++;
      }
    }
  }

  async presentModal(page, ayah = null) {
    const modal = await this.modalController.create({
      component: ModalPage,
      initialBreakpoint: 0.2,
      breakpoints: [0, 0.2, 0.3, 0.5],
      componentProps: {
        page,
        ayah,
      },
    });
    return await modal.present();
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: MainPopoverComponent,
      event,
      componentProps : {
        showExternalLinks: true
      }
    });
    await popover.present();
  }

  donate() {
    window.location.href = 'https://www.paypal.com/paypalme/coding97';
  }

  scrollIntoElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'auto',
      });
    }
  }
}
