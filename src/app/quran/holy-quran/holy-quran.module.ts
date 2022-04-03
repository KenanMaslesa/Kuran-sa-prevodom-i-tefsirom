import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolyQuranPageRoutingModule } from './holy-quran-routing.module';

import { HolyQuranPage } from './holy-quran.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    HolyQuranPageRoutingModule,
    SharedModule
  ],
  declarations: [HolyQuranPage]
})
export class HolyQuranPageModule {}
