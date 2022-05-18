import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HifzTestPage } from './hifz-test.page';

const routes: Routes = [
  {
    path: '',
    component: HifzTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HifzTestPageRoutingModule {}
