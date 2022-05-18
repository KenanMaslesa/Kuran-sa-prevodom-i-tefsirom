import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HifzPlayerComponent } from './components/hifz-player/hifz-player.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PlayerComponent } from './components/player/player.component';
import { TranslationModalComponent } from './components/translation-modal/translation-modal.component';
import { PopoverPage } from './popover';
@NgModule({
  imports: [IonicModule, FormsModule, CommonModule],
  exports: [LoaderComponent, PlayerComponent, IonicModule, CommonModule, HifzPlayerComponent, TranslationModalComponent],
  declarations: [LoaderComponent, PlayerComponent, PopoverPage, HifzPlayerComponent, TranslationModalComponent],
  providers: [],
})
export class SharedModule { }
