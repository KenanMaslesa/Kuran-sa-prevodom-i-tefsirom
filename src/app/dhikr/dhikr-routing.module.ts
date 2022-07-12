import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./homepage/homepage.module').then( m => m.HomepagePageModule)
  },
  {
    path: 'morning-dhikr',
    loadChildren: () =>
      import('../dhikr/morning-dhikr/morning-dhikr.module').then(
        (m) => m.MorningDhikrPageModule
      ),
  },
  {
    path: 'evening-dhikr',
    loadChildren: () =>
      import('../dhikr/evening-dhikr/evening-dhikr.module').then(
        (m) => m.EveningDhikrPageModule
      ),
  },
  {
    path: 'dhikr-before-sleeping',
    loadChildren: () =>
      import('../dhikr/dhikr-before-sleeping/dhikr-before-sleeping.module').then(
        (m) => m.DhikrBeforeSleepingPageModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../dhikr/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: 'counter',
    loadChildren: () => import('../dhikr/tasbeeh/counter/counter.module').then( m => m.CounterPageModule)
  },
  {
    path: 'tasbeeh',
    loadChildren: () => import('../dhikr/tasbeeh/tabs.module').then( m => m.TabsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DhikrPageRoutingModule {}
