import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./homepage/homepage.module').then( m => m.HomepagePageModule)
  },
  {
    path: 'dhikr',
    loadChildren: () => import('./dhikr/dhikr.module').then(m => m.DhikrPageModule)
  },
  {
    path: 'prayer',
    loadChildren: () => import('./prayer/prayer.module').then( m => m.PrayerPageModule)
  },
  {
    path: 'quran',
    loadChildren: () => import('./quran/quran.module').then( m => m.QuranPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
