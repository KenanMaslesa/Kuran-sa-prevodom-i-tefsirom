import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuranPageRoutingModule } from './quran-routing.module';

import { QuranPage } from './quran.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuranPageRoutingModule,
    SharedModule
  ],
  declarations: [QuranPage]
})
export class QuranPageModule {}
