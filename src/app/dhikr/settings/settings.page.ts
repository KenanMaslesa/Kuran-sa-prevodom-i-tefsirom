import { Component, OnInit } from '@angular/core';
import { DhikrLocalStoarge, DhikrService } from '../dhikr.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  dhikrLocalStoarge = DhikrLocalStoarge;
  constructor(public dhikrService: DhikrService) { }

  ngOnInit() {
  }

}
