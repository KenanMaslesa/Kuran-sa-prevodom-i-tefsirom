import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TafsirAyah } from '../../shared/quran.models';
import { QuranService } from '../../shared/services/quran.service';
import { MainPopoverComponent } from '../../shared/components/popovers/main-popover/main-popover.component';
import { MediaPlayerService } from '../../shared/services/media-player.service';
import { NativePluginsService } from '../../shared/services/native-plugins.service';
import { StorageService } from '../../shared/services/storage.service';
import { BookmarksService } from './bookmarks.service';

enum Segments {
  bookmark = 'bookmark',
  favorite = 'favorite',
  tracker = 'tracker',
}

enum TrackerValue {
  todays = 'todays',
  total = 'total',
}
@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage {
  public readonly segments = Segments;
  public selectedSegment = Segments.tracker;
  public suraList = [];
  public selectedTrackerValue = TrackerValue.todays;
  public readonly trackerValue = TrackerValue;
  subs: Subscription = new Subscription();
  constructor(
    public bookmarksService: BookmarksService,
    private quranService: QuranService,
    private router: Router,
    public storageService: StorageService, //rename service
    public mediaPlayerService: MediaPlayerService,
    public nativePluginsService: NativePluginsService,
    private popoverCtrl: PopoverController
  ) {
    this.subs.add(
      this.quranService.getSuraList().subscribe((response) => {
        this.suraList = response;
      })
    );
  }

  goTo(url, pageNumber) {
    this.quranService.setCurrentPage(pageNumber - 1);
    this.quranService.currentPageChanged.next(true);
    this.router.navigate([url]);
  }

  ionViewDidEnter() {
    this.mediaPlayerService.removePlayer();
    this.quranService.showLoader = false;
  }

  ionViewDidLeave() {
    this.subs.unsubscribe();
  }

  playAyah(ayahIndex) {
    this.mediaPlayerService.playingCurrentAyah = ayahIndex;
    this.mediaPlayerService.playOneAyah(ayahIndex);
  }

  shareAyah(suraName: string, ayah: TafsirAyah) {
    this.nativePluginsService.shareAyah(suraName, ayah);
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: MainPopoverComponent,
      event,
      componentProps: {
        showExternalLinks: true
      }
    });
    await popover.present();
  }
}
