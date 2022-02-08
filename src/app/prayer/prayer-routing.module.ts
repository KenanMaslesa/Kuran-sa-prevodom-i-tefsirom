import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrayerPage } from './prayer.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: PrayerPage,
    children: [
      {
        path: 'prayer-times',
        loadChildren: () => import('./prayer-times/prayer-times.module').then( m => m.PrayerTimesPageModule)
      },
      {
        path: 'qibla-finder',
        loadChildren: () => import('./qibla-finder/qibla-finder.module').then( m => m.QiblaFinderPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/prayer-times',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/prayer/tabs/prayer-times',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrayerPageRoutingModule {}
