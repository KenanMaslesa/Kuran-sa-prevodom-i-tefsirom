import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookmarksPageRoutingModule } from './bookmarks-routing.module';

import { BookmarksPage } from './bookmarks.page';
import { TrackerPage } from './tracker/tracker.page';
import { TrackerModalComponent } from './tracker/tracker-modal/tracker-modal.component';
import { TodaysTrackerModalComponent } from './tracker/todays-tracker-modal/todays-tracker-modal.component';
import { HowToUseTrackerComponent } from './tracker/todays-tracker-modal/how-to-use-tracker/how-to-use-tracker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookmarksPageRoutingModule,
  ],
  declarations: [BookmarksPage, TrackerPage, TrackerModalComponent, TodaysTrackerModalComponent, HowToUseTrackerComponent]
})
export class BookmarksPageModule {}
