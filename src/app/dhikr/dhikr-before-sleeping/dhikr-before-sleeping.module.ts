import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DhikrBeforeSleepingPageRoutingModule } from './dhikr-before-sleeping-routing.module';

import { DhikrBeforeSleepingPage } from './dhikr-before-sleeping.page';
import { DhikrTemplateComponentModule } from '../dhikr-template/dhikr-template.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DhikrBeforeSleepingPageRoutingModule,
    DhikrTemplateComponentModule
  ],
  declarations: [DhikrBeforeSleepingPage]
})
export class DhikrBeforeSleepingPageModule {}
