import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MorningDhikrPage } from './morning-dhikr.page';

const routes: Routes = [
  {
    path: '',
    component: MorningDhikrPage,
  },
  {
    path: 'tracker',
    loadChildren: () => import('./tracker/tracker.module').then( m => m.TrackerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MorningDhikrPageRoutingModule {}
