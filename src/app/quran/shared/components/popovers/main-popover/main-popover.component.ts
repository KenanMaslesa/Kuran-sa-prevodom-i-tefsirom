import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { QuranService } from 'src/app/quran/shared/services/quran.service';
import { NativePluginsService } from 'src/app/quran/shared/services/native-plugins.service';

@Component({
  selector: 'app-main-popover',
  templateUrl: './main-popover.component.html',
  styleUrls: ['./main-popover.component.scss'],
})
export class MainPopoverComponent implements OnInit {
  @Input() showExternalLinks: boolean;
  @Input() showTranslationToggle: boolean;
  showGoToPageButton: boolean;
  constructor(
    public nativePluginsService: NativePluginsService,
    private router: Router,
    public popoverCtrl: PopoverController,
    public quranService: QuranService
  ) {}

  ngOnInit() {}

  goToUrl(url) {
    this.router.navigateByUrl(`${url}`, {
      replaceUrl: true,
    });
    this.popoverCtrl.dismiss();
  }

  randomQuranPage() {
    const randomNumber = Math.floor(Math.random() * (604 - 1)) + 1;
    this.quranService.setCurrentPage(randomNumber);
    if(this.showExternalLinks) {
      this.router.navigate(['/tabs/holy-quran']);
    }
    this.popoverCtrl.dismiss();
  }


  goToQuranPage(pageNumber: any) {
    pageNumber = +pageNumber;
    if (pageNumber <= 0 || pageNumber > 604 || isNaN(pageNumber)) {
      return;
    }

    this.quranService.setCurrentPage(pageNumber);
    if(this.showExternalLinks) {
      this.router.navigate(['/tabs/holy-quran']);
    }
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
}
