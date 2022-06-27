import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HifzTrackerPageRoutingModule } from './hifz-tracker-routing.module';

import { HifzTrackerPage } from './hifz-tracker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HifzTrackerPageRoutingModule
  ],
  declarations: [HifzTrackerPage]
})
export class HifzTrackerPageModule {}
