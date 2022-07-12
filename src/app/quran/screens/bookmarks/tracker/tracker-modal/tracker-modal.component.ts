import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PageInfo, SuraQuranTracker } from 'src/app/quran/shared/quran.models';
import { QuranTrackerService } from '../quran-tracker.service';
import { ArgumentModalComponent } from '../todays-tracker-modal/argument-modal/argument-modal.component';

@Component({
  selector: 'app-tracker-modal',
  templateUrl: './tracker-modal.component.html',
  styleUrls: ['./tracker-modal.component.scss'],
})
export class TrackerModalComponent {
  @Input() sura: SuraQuranTracker;
  pageInfo: PageInfo;
  constructor(
    private quranTrackerService: QuranTrackerService,
    private modalController: ModalController,
    private router: Router
  ) {}

  addOrRemovePage(addPage: boolean, page: number) {
    this.quranTrackerService.addOrRemovePage(addPage, page);
  }

  goToPage(page) {
    this.router.navigate([`quran/tabs/holy-quran/${page}`]);
    this.dismissModal();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  getPercentsFixed(completedPages, totalPages) {
    const num =  (completedPages / totalPages) * 100;
    return num.toFixed(2);
  }
}
