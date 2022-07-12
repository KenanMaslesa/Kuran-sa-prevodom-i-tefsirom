import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DhikrsPage } from './dhikrs.page';

const routes: Routes = [
  {
    path: '',
    component: DhikrsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DhikrsPageRoutingModule {}
