import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PopoverController } from '@ionic/angular';
import { PageInfo } from '../quran/quran.models';
import { QuranService } from '../quran/quran.service';
import { SettingsService } from '../quran/settings/settings.service';
import { NativePluginsService } from './native-plugins.service';

export enum PopoverTypes {
  homepage = 'homepage',
  quranPage = 'quranPage',
}
@Component({
  template: `
    <ion-list *ngIf="popoverType === popoverTypes.homepage">
      <!-- <ion-item (click)="goToUrl('/tabs/settings')">
        <ion-label>O aplikaciji</ion-label>
        <ion-icon slot="end" name="information-circle-outline"></ion-icon>
      </ion-item> -->

      <ion-item button (click)="nativePluginsService.shareApp()">
        <ion-label>Podijelite sa drugima</ion-label>
        <ion-icon slot="end" name="share-social-outline"></ion-icon>
      </ion-item>

      <ion-item button (click)="nativePluginsService.rateApp()">
        <ion-label>Ocijenite aplikaciju</ion-label>
        <ion-icon slot="end" name="star-outline"></ion-icon>
      </ion-item>

      <ion-item button (click)="nativePluginsService.donate()">
        <ion-label>Podržite naš rad</ion-label>
        <ion-icon slot="end" name="gift-outline"></ion-icon>
      </ion-item>

      <ion-item button (click)="nativePluginsService.allAps()">
        <ion-label>Druge aplikacije</ion-label>
        <ion-icon slot="end" name="layers-outline"></ion-icon>
      </ion-item>

      <div>
        <hr>
      </div>

      <ion-item button (click)="goToUrl('/audio')">
        <ion-label>Kur'an audio</ion-label>
        <ion-icon slot="end" name="headset-outline"></ion-icon>
      </ion-item>

      <!-- <ion-item button (click)="goToUrl('/hifz')">
        <ion-label>Hifz</ion-label>
        <ion-icon slot="end" name="bulb-outline"></ion-icon>
      </ion-item> -->

      <ion-item button (click)="goToUrl('/settings')">
        <ion-label>Postavke</ion-label>
        <ion-icon slot="end" name="settings-outline"></ion-icon>
      </ion-item>
    </ion-list>

    <ion-list *ngIf="popoverType === popoverTypes.quranPage">
      <!--go to page -->
      <ion-item>
        <ion-label>Idi na</ion-label>
        <ion-input
          style="text-align: center;"
          dir="ltr"
          type="number"
          min="1"
          max="604"
          #currentPage
          (ionChange)="checkPage(currentPage.value)"
          placeholder="broj stranice"
        ></ion-input>
        <ion-icon *ngIf="!showGoToPageButton" name="search-outline"></ion-icon>
        <ion-button
          *ngIf="showGoToPageButton"
          color="primary"
          (click)="goToQuranPage(currentPage.value)"
          >OK</ion-button
        >
      </ion-item>

      <ion-item button (click)="randomQuranPage()">
        <ion-label>Random stranica</ion-label>
        <ion-icon slot="end" name="shuffle-outline"></ion-icon>
      </ion-item>
      <!--go to page end -->

      <!--night mode -->
      <!-- <ion-item>
        <ion-label>Noćni način</ion-label>
        <ion-toggle
          [(ngModel)]="nightMode"
          (ngModelChange)="switchMode()"
          color="primary"
        ></ion-toggle>
      </ion-item> -->
      <!--night mode end -->

      <ion-item>
        <ion-label>Prikaži prijevod</ion-label>
        <ion-checkbox (click)="popoverCtrl.dismiss()" color="primary" [(ngModel)]="quranService.showTranslationModal"></ion-checkbox>
      </ion-item>

      <div>
        <hr>
      </div>

      <ion-item button (click)="goToUrl('/audio')">
        <ion-label>Kur'an audio</ion-label>
        <ion-icon slot="end" name="headset-outline"></ion-icon>
      </ion-item>

      <ion-item button (click)="goToUrl('/settings')">
        <ion-label>Postavke</ion-label>
        <ion-icon slot="end" name="settings-outline"></ion-icon>
      </ion-item>

      <!-- <div class="page-info" style="text-align: center;font-size: 13px;padding: 5px;">
        <p style="margin-bottom: 0;">Informacije o trenutnoj stranici</p>
        <div>Broj riječi: <strong>{{pageInfo.wordsNumber}}</strong></div>
        <div>Broj harfova: <strong>{{pageInfo.lettersNumber}}</strong></div>
      </div> -->
    </ion-list>
  `,
})
export class PopoverPage implements OnInit {
  @Input() popoverType: PopoverTypes;
  public readonly popoverTypes = PopoverTypes;
  public showGoToPageButton = false;
  public nightMode = false;
  public pageInfo: PageInfo;

  constructor(
    public popoverCtrl: PopoverController,
    private router: Router,
    public nativePluginsService: NativePluginsService,
    public quranService: QuranService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    // this.pageInfo = this.quranService.getNumberOfWordsAndLettersPerPage(this.quranService.currentPage);
  }

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
    this.settingsService.nightMode = this.nightMode;

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
