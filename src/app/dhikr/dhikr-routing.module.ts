import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DhikrPage } from './dhikr.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: DhikrPage,
    children: [
      {
        path: 'morning-dhikr',
        loadChildren: () =>
          import('./morning-dhikr/morning-dhikr.module').then(
            (m) => m.MorningDhikrPageModule
          ),
      },
      {
        path: 'evening-dhikr',
        loadChildren: () =>
          import('./evening-dhikr/evening-dhikr.module').then(
            (m) => m.EveningDhikrPageModule
          ),
      },
      {
        path: 'dhikr-before-sleeping',
        loadChildren: () =>
          import('./dhikr-before-sleeping/dhikr-before-sleeping.module').then(
            (m) => m.DhikrBeforeSleepingPageModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
      {
        path: 'counter',
        loadChildren: () => import('./counter/counter.module').then( m => m.CounterPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/morning-dhikr',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/dhikr/tabs/morning-dhikr',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DhikrPageRoutingModule {}
