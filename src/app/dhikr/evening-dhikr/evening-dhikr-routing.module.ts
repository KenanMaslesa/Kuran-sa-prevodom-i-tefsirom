import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EveningDhikrPage } from './evening-dhikr.page';

const routes: Routes = [
  {
    path: '',
    component: EveningDhikrPage,
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
export class EveningDhikrPageRoutingModule {}
