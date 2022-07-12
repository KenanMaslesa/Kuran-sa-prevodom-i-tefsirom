import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DhikrsPageRoutingModule } from './dhikrs-routing.module';

import { DhikrsPage } from './dhikrs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DhikrsPageRoutingModule
  ],
  declarations: [DhikrsPage]
})
export class DhikrsPageModule {}
