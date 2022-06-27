import { NgModule } from '@angular/core';

import { HolyQuranPageRoutingModule } from './holy-quran-routing.module';
import { HolyQuranPage } from './holy-quran.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    HolyQuranPageRoutingModule,
    SharedModule
  ],
  declarations: [HolyQuranPage]
})
export class HolyQuranPageModule {}
