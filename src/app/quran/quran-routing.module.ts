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
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'holy-quran',
        loadChildren: () => import('./holy-quran/holy-quran.module').then( m => m.HolyQuranPageModule)
      },
      {
        path: 'holy-quran/:page',
        loadChildren: () => import('./holy-quran/holy-quran.module').then( m => m.HolyQuranPageModule)
      },
      {
        path: 'holy-quran/:page/:ayah',
        loadChildren: () => import('./holy-quran/holy-quran.module').then( m => m.HolyQuranPageModule)
      },
      {
        path: 'bookmarks',
        loadChildren: () => import('./bookmarks/bookmarks.module').then( m => m.BookmarksPageModule)
      },
      {
        path: 'translation',
        loadChildren: () => import('./translation/translation.module').then( m => m.TranslationPageModule)
      },
      {
        path: 'translation/:page',
        loadChildren: () => import('./translation/translation.module').then( m => m.TranslationPageModule)
      },
      {
        path: 'translation/:page/:ayah',
        loadChildren: () => import('./translation/translation.module').then( m => m.TranslationPageModule)
      },
      {
        path: 'audio',
        loadChildren: () => import('./audio/audio.module').then( m => m.AudioPageModule)
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
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuranPageRoutingModule {}
