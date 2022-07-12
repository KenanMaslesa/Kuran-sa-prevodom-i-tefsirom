import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DhikrBeforeSleepingPage } from './dhikr-before-sleeping.page';

const routes: Routes = [
  {
    path: '',
    component: DhikrBeforeSleepingPage
  },
  {
    path: 'tracker',
    loadChildren: () => import('./tracker/tracker.module').then( m => m.TrackerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DhikrBeforeSleepingPageRoutingModule {}
