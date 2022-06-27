import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HifzPlayerComponent } from './components/hifz-player/hifz-player.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PlayerComponent } from './components/player/player.component';
import { MainPopoverComponent } from './components/popovers/main-popover/main-popover.component';
import { TranslationModalComponent } from '../screens/holy-quran/translation-modal/translation-modal.component';
@NgModule({
  imports: [IonicModule, FormsModule, CommonModule],
  exports: [
    LoaderComponent,
    PlayerComponent,
    IonicModule,
    CommonModule,
    HifzPlayerComponent,
    TranslationModalComponent,
    MainPopoverComponent
  ],
  declarations: [
    LoaderComponent,
    PlayerComponent,
    HifzPlayerComponent,
    TranslationModalComponent,
    MainPopoverComponent
  ],
  providers: [],
})
export class SharedModule {}
