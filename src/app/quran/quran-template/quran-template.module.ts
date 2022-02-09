import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuranTemplatePageRoutingModule } from './quran-template-routing.module';

import { QuranTemplatePage } from './quran-template.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuranTemplatePageRoutingModule,
    SharedModule
  ],
  declarations: [QuranTemplatePage]
})
export class QuranTemplatePageModule {}
