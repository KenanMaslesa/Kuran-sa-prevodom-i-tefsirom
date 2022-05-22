import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HifzPlayerComponent } from './components/hifz-player/hifz-player.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PlayerComponent } from './components/player/player.component';
import { HomePopoverComponent } from './components/popovers/home-popover/home-popover.component';
import { QuranPopoverComponent } from './components/popovers/quran-popover/quran-popover.component';
import { TranslationModalComponent } from './components/translation-modal/translation-modal.component';
@NgModule({
  imports: [IonicModule, FormsModule, CommonModule],
  exports: [
    LoaderComponent,
    PlayerComponent,
    IonicModule,
    CommonModule,
    HifzPlayerComponent,
    TranslationModalComponent,
    HomePopoverComponent,
    QuranPopoverComponent
  ],
  declarations: [
    LoaderComponent,
    PlayerComponent,
    HifzPlayerComponent,
    TranslationModalComponent,
    HomePopoverComponent,
    QuranPopoverComponent
  ],
  providers: [],
})
export class SharedModule {}
