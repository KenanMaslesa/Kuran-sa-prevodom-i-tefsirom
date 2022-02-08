import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MorningDhikrPage } from './morning-dhikr.page';

const routes: Routes = [
  {
    path: '',
    component: MorningDhikrPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MorningDhikrPageRoutingModule {}
