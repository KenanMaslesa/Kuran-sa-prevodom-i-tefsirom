import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DhikrPageRoutingModule } from './dhikr-routing.module';

import { DhikrPage } from './dhikr.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DhikrPageRoutingModule
  ],
  declarations: [DhikrPage]
})
export class DhikrPageModule {}
