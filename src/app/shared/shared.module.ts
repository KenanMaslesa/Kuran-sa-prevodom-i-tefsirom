import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoaderComponent } from './components/loader/loader.component';
import { PlayerComponent } from './components/player/player.component';
@NgModule({
  imports: [IonicModule, FormsModule, CommonModule],
  exports: [LoaderComponent, PlayerComponent, IonicModule, CommonModule,],
  declarations: [LoaderComponent, PlayerComponent],
  providers: [],
})
export class SharedModule { }
