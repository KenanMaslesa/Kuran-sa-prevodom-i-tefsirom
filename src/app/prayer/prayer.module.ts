import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrayerPageRoutingModule } from './prayer-routing.module';

import { PrayerPage } from './prayer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayerPageRoutingModule
  ],
  declarations: [PrayerPage]
})
export class PrayerPageModule {}
