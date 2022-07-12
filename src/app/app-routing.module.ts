import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'quran',
    loadChildren: () => import('./quran/quran.module').then( m => m.QuranPageModule)
  },
  {
    path: 'dhikr',
    loadChildren: () => import('./dhikr/dhikr.module').then( m => m.DhikrModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
