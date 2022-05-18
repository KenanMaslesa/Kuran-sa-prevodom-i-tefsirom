import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HifzPage } from './hifz.page';

const routes: Routes = [
  {
    path: '',
    component: HifzPage
  },
  {
    path: 'hifz-test',
    loadChildren: () => import('./hifz-test/hifz-test.module').then( m => m.HifzTestPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HifzPageRoutingModule {}
