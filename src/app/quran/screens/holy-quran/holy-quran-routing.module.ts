import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HolyQuranPage } from './holy-quran.page';

const routes: Routes = [
  {
    path: '',
    component: HolyQuranPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolyQuranPageRoutingModule {}
