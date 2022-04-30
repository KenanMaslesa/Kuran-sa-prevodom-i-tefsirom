import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';
import { StorageService } from 'src/app/shared/storage.service';
import { TafsirAyah } from '../quran.models';
import { QuranService } from '../quran.service';
import { BookmarksService } from './bookmarks.service';

enum Segments {
  bookmark = 'bookmark',
  favorite = 'favorite',
}
@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage {
  public readonly segments = Segments;
  public selectedSegment = Segments.bookmark;
  public suraList = [];
  subs: Subscription = new Subscription();
  constructor(
    public bookmarksService: BookmarksService,
    private quranService: QuranService,
    private router: Router,
    public storageService: StorageService, //rename service
    public mediaPlayerService: MediaPlayerService,
    public nativePluginsService: NativePluginsService
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
}
