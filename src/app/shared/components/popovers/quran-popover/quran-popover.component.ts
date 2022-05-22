import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { QuranService } from 'src/app/quran/quran.service';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';

@Component({
  selector: 'app-quran-popover',
  templateUrl: './quran-popover.component.html',
  styleUrls: ['./quran-popover.component.scss'],
})
export class QuranPopoverComponent {
  public showGoToPageButton = false;
  public nightMode = false;

  constructor(
    public popoverCtrl: PopoverController,
    private router: Router,
    public nativePluginsService: NativePluginsService,
    public quranService: QuranService,
  ) {}

  goToUrl(url) {
    this.router.navigateByUrl(`${url}`, {
      replaceUrl: true,
    });
    this.popoverCtrl.dismiss();
  }

  goToQuranPage(pageNumber: any) {
    pageNumber = +pageNumber;
    if (pageNumber <= 0 || pageNumber > 604 || isNaN(pageNumber)) {
      return;
    }

    this.quranService.setCurrentPage(pageNumber);
    this.popoverCtrl.dismiss();
  }

  checkPage(pageNumber: any) {
    pageNumber = +pageNumber;
    if (pageNumber <= 0 || pageNumber > 604 || isNaN(pageNumber)) {
      this.showGoToPageButton = false;
    } else {
      this.showGoToPageButton = true;
    }
  }

  switchMode() {
    // this.settingsService.nightMode = this.nightMode;

    // document.documentElement.style.setProperty(
    //   `--ion-color-primary`,
    //   `black`
    // );
  }

  randomQuranPage() {
    const randomNumber = Math.floor(Math.random() * (604 - 1)) + 1;
    this.quranService.setCurrentPage(randomNumber);
    this.popoverCtrl.dismiss();
  }

}
