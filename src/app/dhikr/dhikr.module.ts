import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from './shared/shared.module';
import { DhikrPageRoutingModule } from './dhikr-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DhikrPageRoutingModule,
    SharedModule
  ],
})
export class DhikrModule {}
