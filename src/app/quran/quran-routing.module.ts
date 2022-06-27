import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuranPage } from './quran.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: QuranPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./screens/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'holy-quran',
        loadChildren: () => import('./screens/holy-quran/holy-quran.module').then( m => m.HolyQuranPageModule)
      },
      {
        path: 'holy-quran/:page',
        loadChildren: () => import('./screens/holy-quran/holy-quran.module').then( m => m.HolyQuranPageModule)
      },
      {
        path: 'holy-quran/:page/:ayah',
        loadChildren: () => import('./screens/holy-quran/holy-quran.module').then( m => m.HolyQuranPageModule)
      },
      {
        path: 'tracker',
        loadChildren: () => import('./screens/bookmarks/bookmarks.module').then( m => m.BookmarksPageModule)
      },
      {
        path: 'translation',
        loadChildren: () => import('./screens/translation/translation.module').then( m => m.TranslationPageModule)
      },
      {
        path: 'translation/:page',
        loadChildren: () => import('./screens/translation/translation.module').then( m => m.TranslationPageModule)
      },
      {
        path: 'translation/:page/:ayah',
        loadChildren: () => import('./screens/translation/translation.module').then( m => m.TranslationPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    loadChildren: () => import('./screens/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'audio',
    loadChildren: () => import('./screens/audio/audio.module').then( m => m.AudioPageModule)
  },
  {
    path: 'hifz',
    loadChildren: () => import('./screens/hifz/hifz.module').then( m => m.HifzPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuranPageRoutingModule {}
