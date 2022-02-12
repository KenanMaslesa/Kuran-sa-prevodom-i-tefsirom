import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslationPageRoutingModule } from './translation-routing.module';

import { TranslationPage } from './translation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslationPageRoutingModule
  ],
  declarations: [TranslationPage]
})
export class TranslationPageModule {}
