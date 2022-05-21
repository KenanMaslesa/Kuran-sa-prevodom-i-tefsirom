import { NgModule } from '@angular/core';
import { HifzPageRoutingModule } from './hifz-routing.module';
import { HifzPage } from './hifz.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    HifzPageRoutingModule,
    SharedModule
  ],
  declarations: [HifzPage]
})
export class HifzPageModule {}
