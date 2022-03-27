import { Component } from '@angular/core';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  colors = [
    {
      color: '#536a9e',
      backgroundColor: 'linear-gradient(to right, rgba(36, 69, 145, 0.8) 0%, rgba(83, 106, 158, 0.8) 100%)'
    },
    {
      color: '#31739d',
      backgroundColor: 'linear-gradient(to right, rgba(39, 70, 133, 0.8) 0%, rgba(61, 179, 197, 0.8) 100%)'
    },
    {
      color: '#04b3ef',
      backgroundColor: 'linear-gradient(to right, rgba(13, 124, 162, 0.8) 0%, rgba(4, 179, 239, 0.8) 100%)'
    },
    {
      color: '#36cbff',
      backgroundColor: 'linear-gradient(to right, rgba(0, 114, 154, 0.8) 0%, rgba(54, 203, 255, 0.8) 100%)'
    },
    {
      color: '#43a9b8',
      backgroundColor: 'linear-gradient(to right, rgba(9, 109, 123, 0.8) 0%, rgba(67, 169, 184, 0.8) 100%)'
    },
    {
      color: '#45c3c3',
      backgroundColor: 'linear-gradient(to right, rgba(12, 123, 123, 0.8) 0%, rgba(69, 195, 195, 0.8) 100%)'
    },
    {
      color: '#e592a1',
      backgroundColor: 'linear-gradient(to right, rgba(160, 59, 77, 0.8) 0%, rgba(229, 146, 161, 0.8) 100%)'
    },
    {
      color: 'pink',
      backgroundColor: 'linear-gradient(to right, rgba(181, 84, 101, 0.8) 0%, rgba(255,192,203, 0.8) 100%)'
    }
  ];
  themeColor: string;

  constructor(public settingsService: SettingsService) {
    const themeColor = localStorage.getItem('theme');
    if (themeColor) {
      this.themeColor = JSON.parse(themeColor);
    }
    else {
      this.themeColor = '#04b3ef';
    }
   }

   onColorChanged(color) {
    const selectedColor = this.colors.filter(item => item.color === color)[0];
    this.themeColor = color;
    localStorage.setItem('theme', JSON.stringify(selectedColor.color));
    document.documentElement.style.setProperty(
      `--ion-color-primary`,
      `${selectedColor.color}`
    );
  }

}
