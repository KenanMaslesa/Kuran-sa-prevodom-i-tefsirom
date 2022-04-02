import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolyQuranPageRoutingModule } from './holy-quran-routing.module';

import { HolyQuranPage } from './holy-quran.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolyQuranPageRoutingModule
  ],
  declarations: [HolyQuranPage]
})
export class HolyQuranPageModule {}
