import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HifzTestPageRoutingModule } from './hifz-test-routing.module';

import { HifzTestPage } from './hifz-test.page';
import { HifzSharedModule } from '../hifz-shared.module';

@NgModule({
  imports: [
    HifzSharedModule,
    HifzTestPageRoutingModule
  ],
  declarations: [HifzTestPage]
})
export class HifzTestPageModule {}
