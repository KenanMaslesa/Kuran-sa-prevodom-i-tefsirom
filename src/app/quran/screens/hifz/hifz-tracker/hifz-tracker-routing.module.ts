import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HifzTrackerPage } from './hifz-tracker.page';

const routes: Routes = [
  {
    path: '',
    component: HifzTrackerPage
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HifzTrackerPageRoutingModule {}
