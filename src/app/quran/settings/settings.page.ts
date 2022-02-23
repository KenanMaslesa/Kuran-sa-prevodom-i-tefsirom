import { Component, OnInit } from '@angular/core';
import { QuranService } from '../quran.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(public quranService: QuranService, public settingsService: SettingsService) { }

  ngOnInit() {
  }

}
