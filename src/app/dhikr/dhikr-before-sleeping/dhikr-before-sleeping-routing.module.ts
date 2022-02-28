import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DhikrBeforeSleepingPage } from './dhikr-before-sleeping.page';

const routes: Routes = [
  {
    path: '',
    component: DhikrBeforeSleepingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DhikrBeforeSleepingPageRoutingModule {}
