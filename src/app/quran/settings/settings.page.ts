import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NativePluginsService, SCREEN_ORIENTATIONS } from 'src/app/shared/native-plugins.service';
import { QuranService } from '../quran.service';
import { SettingsService } from './settings.service';

export enum LocalStorageKeysSettings {
  theme = 'theme',
  fontSize = 'fontSize',
  lineHeight = 'lineHeight',
  fontSizeLandscape = 'fontSizeLandscape',
  lineHeightLandscape = 'lineHeightLandscape',
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  colors = [
    {
      color: '#536a9e',
      backgroundColor:
        'linear-gradient(to right, rgba(36, 69, 145, 0.8) 0%, rgba(83, 106, 158, 0.8) 100%)',
    },
    {
      color: '#31739d',
      backgroundColor:
        'linear-gradient(to right, rgba(39, 70, 133, 0.8) 0%, rgba(61, 179, 197, 0.8) 100%)',
    },
    {
      color: '#04b3ef',
      backgroundColor:
        'linear-gradient(to right, rgba(13, 124, 162, 0.8) 0%, rgba(4, 179, 239, 0.8) 100%)',
    },
    {
      color: '#36cbff',
      backgroundColor:
        'linear-gradient(to right, rgba(0, 114, 154, 0.8) 0%, rgba(54, 203, 255, 0.8) 100%)',
    },
    {
      color: '#43a9b8',
      backgroundColor:
        'linear-gradient(to right, rgba(9, 109, 123, 0.8) 0%, rgba(67, 169, 184, 0.8) 100%)',
    },
    {
      color: '#45c3c3',
      backgroundColor:
        'linear-gradient(to right, rgba(12, 123, 123, 0.8) 0%, rgba(69, 195, 195, 0.8) 100%)',
    },
    {
      color: '#e592a1',
      backgroundColor:
        'linear-gradient(to right, rgba(160, 59, 77, 0.8) 0%, rgba(229, 146, 161, 0.8) 100%)',
    },
    {
      color: 'pink',
      backgroundColor:
        'linear-gradient(to right, rgba(181, 84, 101, 0.8) 0%, rgba(255,192,203, 0.8) 100%)',
    },
  ];
  public screenOrientation$: Observable<any>;
  showSegments = false;
  themeColor: string;
  fontSize = 22;
  lineHeight = 30;
  fontSizeLandscape = 45;
  lineHeightLandscape = 60;

  page6 = [
    [
      '&#xfb51;',
      '&#xfb52;',
      '&#xfb53;',
      '&#xfb54;',
      '&#xfb55;',
      '&#xfb56;',
      '&#xfb57;',
      '&#xfb58;',
      '&#xfb59;',
      '&#xfb5a;',
    ],
    [
      '&#xfb5b;',
      '&#xfb5c;',
      '&#xfb5d;',
      '&#xfb5e;',
      '&#xfb5f;',
      '&#xfb60;',
      '&#xfb61;',
      '&#xfb62;',
      '&#xfb63;',
    ],
    [
      '&#xfb64;',
      '&#xfb65;',
      '&#xfb66;',
      '&#xfb67;',
      '&#xfb68;',
      '&#xfb69;',
      '&#xfb6a;',
      '&#xfb6b;',
      '&#xfb6c;',
      '&#xfb6d;',
      '&#xfb6e;',
    ],
    [
      '&#xfb6f;',
      '&#xfb70;',
      '&#xfb71;',
      '&#xfb72;',
      '&#xfb73;',
      '&#xfb74;',
      '&#xfb75;',
      '&#xfb76;',
      '&#xfb77;',
    ],
    [
      '&#xfb78;',
      '&#xfb79;',
      '&#xfb7a;',
      '&#xfb7b;',
      '&#xfb7c;',
      '&#xfb7d;',
      '&#xfb7e;',
      '&#xfb7f;',
      '&#xfb80;',
    ],
    [
      '&#xfb81;',
      '&#xfb82;',
      '&#xfb83;',
      '&#xfb84;',
      '&#xfb85;',
      '&#xfb86;',
      '&#xfb87;',
      '&#xfb88;',
      '&#xfb89;',
      '&#xfb8a;',
      '&#xfb8b;',
      '&#xfb8c;',
    ],
    [
      '&#xfb8d;',
      '&#xfb8e;',
      '&#xfb8f;',
      '&#xfb90;',
      '&#xfb91;',
      '&#xfb92;',
      '&#xfb93;',
      '&#xfb94;',
      '&#xfb95;',
      '&#xfb96;',
    ],
    [
      '&#xfb97;',
      '&#xfb98;',
      '&#xfb99;',
      '&#xfb9a;',
      '&#xfb9b;',
      '&#xfb9c;',
      '&#xfb9d;',
      '&#xfb9e;',
      '&#xfb9f;',
      '&#xfba0;',
    ],
    [
      '&#xfba1;',
      '&#xfba2;',
      '&#xfba3;',
      '&#xfba4;',
      '&#xfba5;',
      '&#xfba6;',
      '&#xfba7;',
      '&#xfba8;',
      '&#xfba9;',
    ],
    [
      '&#xfbaa;',
      '&#xfbab;',
      '&#xfbac;',
      '&#xfbad;',
      '&#xfbae;',
      '&#xfbaf;',
      '&#xfbb0;',
      '&#xfbb1;',
      '&#xfbd3;',
    ],
    [
      '&#xfbd4;',
      '&#xfbd5;',
      '&#xfbd6;',
      '&#xfbd7;',
      '&#xfbd8;',
      '&#xfbd9;',
      '&#xfbda;',
      '&#xfbdb;',
      '&#xfbdc;',
      '&#xfbdd;',
    ],
    [
      '&#xfbde;',
      '&#xfbdf;',
      '&#xfbe0;',
      '&#xfbe1;',
      '&#xfbe2;',
      '&#xfbe3;',
      '&#xfbe4;',
      '&#xfbe5;',
      '&#xfbe6;',
      '&#xfbe7;',
    ],
    [
      '&#xfbe8;',
      '&#xfbe9;',
      '&#xfbea;',
      '&#xfbeb;',
      '&#xfbec;',
      '&#xfbed;',
      '&#xfbee;',
      '&#xfbef;',
      '&#xfbf0;',
      '&#xfbf1;',
    ],
    [
      '&#xfbf2;',
      '&#xfbf3;',
      '&#xfbf4;',
      '&#xfbf5;',
      '&#xfbf6;',
      '&#xfbf7;',
      '&#xfbf8;',
      '&#xfbf9;',
      '&#xfbfa;',
      '&#xfbfb;',
      '&#xfbfc;',
      '&#xfbfd;',
    ],
    [
      '&#xfbfe;',
      '&#xfbff;',
      '&#xfc00;',
      '&#xfc01;',
      '&#xfc02;',
      '&#xfc03;',
      '&#xfc04;',
      '&#xfc05;',
      '&#xfc06;',
      '&#xfc07;',
      '&#xfc08;',
      '&#xfc09;',
      '&#xfc0a;',
    ],
  ];

  constructor(
    public settingsService: SettingsService,
    private quranService: QuranService,
    public nativePluginsService: NativePluginsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.quranService.showLoader = false;

    const themeColor = localStorage.getItem(LocalStorageKeysSettings.theme);
    const fontSize = localStorage.getItem(LocalStorageKeysSettings.fontSize);
    const fontSizeLandscape = localStorage.getItem(
      LocalStorageKeysSettings.fontSizeLandscape
    );
    const lineHeight = localStorage.getItem(
      LocalStorageKeysSettings.lineHeight
    );
    const lineHeightLandscape = localStorage.getItem(
      LocalStorageKeysSettings.lineHeightLandscape
    );
    if (themeColor) {
      this.themeColor = JSON.parse(themeColor);
    } else {
      this.themeColor = '#04b3ef';
    }

    if (fontSize) {
      this.fontSize = JSON.parse(fontSize);
    }
    if (lineHeight) {
      this.lineHeight = JSON.parse(lineHeight);
    }
    if (fontSizeLandscape) {
      this.fontSizeLandscape = JSON.parse(fontSizeLandscape);
    }
    if (lineHeightLandscape) {
      this.lineHeightLandscape = JSON.parse(lineHeightLandscape);
    }

    this.screenOrientation$ = this.nativePluginsService.screenOrientation.onChange().pipe(
      tap(() => {
        this.nativePluginsService.currentScreenOrientation = this.nativePluginsService.screenOrientation.type;
        this.changeDetectorRef.detectChanges();
      })
   );
  }

  ionViewWillLeave() {
    this.saveData();
  }

  onColorChanged(color) {
    const selectedColor = this.colors.filter((item) => item.color === color)[0];
    this.themeColor = color;
    localStorage.setItem(
      LocalStorageKeysSettings.theme,
      JSON.stringify(selectedColor.color)
    );
    document.documentElement.style.setProperty(
      `--ion-color-primary`,
      `${selectedColor.color}`
    );
  }

  onFontChange(fontSize) {
    this.fontSize = fontSize;
    document.documentElement.style.setProperty(
      `--quran-font-size`,
      `${fontSize}px`
    );
  }

  onLineHeightChange(lineHeight) {
    this.lineHeight = lineHeight;
    document.documentElement.style.setProperty(
      `--quran-line-height`,
      `${lineHeight}px`
    );
  }

  onLandscapeFontChange(fontSize) {
    this.fontSizeLandscape = fontSize;
    document.documentElement.style.setProperty(
      `--quran-landscape-font-size`,
      `${fontSize}px`
    );
  }

  onLandscapeLineHeightChange(lineHeight) {
    this.lineHeightLandscape = lineHeight;
    document.documentElement.style.setProperty(
      `--quran-landscape-line-height`,
      `${lineHeight}px`
    );
  }


  saveData() {
    //Portrait
    localStorage.setItem(
      LocalStorageKeysSettings.fontSize,
      JSON.stringify(this.fontSize)
    );

    localStorage.setItem(
      LocalStorageKeysSettings.lineHeight,
      JSON.stringify(this.lineHeight)
    );

    //Landscape
    localStorage.setItem(
      LocalStorageKeysSettings.fontSizeLandscape,
      JSON.stringify(this.fontSizeLandscape)
    );

    localStorage.setItem(
      LocalStorageKeysSettings.lineHeightLandscape,
      JSON.stringify(this.lineHeightLandscape)
    );
  }
}
