import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EveningDhikrPage } from './evening-dhikr.page';
import { DhikrTemplateComponentModule } from '../dhikr-template/dhikr-template.module';

import { EveningDhikrPageRoutingModule } from './evening-dhikr-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DhikrTemplateComponentModule,
    EveningDhikrPageRoutingModule
  ],
  declarations: [EveningDhikrPage]
})
export class EveningDhikrPageModule {}
