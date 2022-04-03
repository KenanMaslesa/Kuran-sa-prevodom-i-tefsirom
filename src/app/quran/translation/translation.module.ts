import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslationPageRoutingModule } from './translation-routing.module';

import { TranslationPage } from './translation.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    TranslationPageRoutingModule,
    SharedModule
  ],
  declarations: [TranslationPage]
})
export class TranslationPageModule {}
