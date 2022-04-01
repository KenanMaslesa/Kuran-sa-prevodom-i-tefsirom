import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuranPage } from './quran.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: QuranPage,
    children: [
      {
        path: 'quran-template',
        loadChildren: () =>
          import('./quran-template/quran-template.module').then(
            (m) => m.QuranTemplatePageModule
          ),
      },
      {
        path: 'translation',
        loadChildren: () =>
          import('./translation/translation.module').then(
            (m) => m.TranslationPageModule
          ),
      },

      {
        path: 'audio',
        loadChildren: () =>
          import('./audio/audio.module').then((m) => m.AudioPageModule),
      },
      {
        path: 'bookmarks',
        loadChildren: () => import('./bookmarks/bookmarks.module').then( m => m.BookmarksPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'tracker',
        loadChildren: () => import('./tracker/tracker.module').then( m => m.TrackerPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuranPageRoutingModule {}
