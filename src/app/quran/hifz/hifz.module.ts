import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

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
