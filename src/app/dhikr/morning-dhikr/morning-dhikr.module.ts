import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MorningDhikrPage } from './morning-dhikr.page';
import { DhikrTemplateComponentModule } from '../dhikr-template/dhikr-template.module';

import { MorningDhikrPageRoutingModule } from './morning-dhikr-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DhikrTemplateComponentModule,
    MorningDhikrPageRoutingModule
  ],
  declarations: [MorningDhikrPage]
})
export class MorningDhikrPageModule {}
