import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HifzPageRoutingModule } from './hifz-routing.module';
import { HifzPage } from './hifz.page';

@NgModule({
  imports: [
    HifzPageRoutingModule,
    SharedModule
  ],
  declarations: [HifzPage]
})
export class HifzPageModule {}
