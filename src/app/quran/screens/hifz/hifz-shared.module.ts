import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HifzAyahByAyahTestPage } from './hifz-test/hifz-ayah-by-ayah-test/hifz-ayah-by-ayah-test.page';
import { HifzRandomAyahsTestPage } from './hifz-test/hifz-random-ayahs-test/hifz-random-ayahs-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [HifzAyahByAyahTestPage, HifzRandomAyahsTestPage],
  exports: [CommonModule, FormsModule, IonicModule, HifzAyahByAyahTestPage, HifzRandomAyahsTestPage]
})
export class HifzSharedModule {}
