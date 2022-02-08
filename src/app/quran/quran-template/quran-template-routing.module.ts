import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuranTemplatePage } from './quran-template.page';

const routes: Routes = [
  {
    path: '',
    component: QuranTemplatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuranTemplatePageRoutingModule {}
