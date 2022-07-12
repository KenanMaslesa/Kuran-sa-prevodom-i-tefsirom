import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dhikrs',
        loadChildren: () => import('./dhikrs/dhikrs.module').then( m => m.DhikrsPageModule)
      },
      {
        path: 'counter',
        loadChildren: () => import('./counter/counter.module').then( m => m.CounterPageModule)
      },
      {
        path: 'tracker',
        loadChildren: () => import('./tracker/tracker.module').then( m => m.TrackerPageModule)
      },
      {
        path: '',
        redirectTo: 'tabs/counter',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/counter',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
