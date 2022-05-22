import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PageInfo, SuraQuranTracker } from 'src/app/quran/quran.models';
import { QuranService } from 'src/app/quran/quran.service';
import { QuranTrackerService } from '../quran-tracker.service';
import { ArgumentModalComponent } from './argument-modal/argument-modal.component';

@Component({
  selector: 'app-tracker-modal',
  templateUrl: './tracker-modal.component.html',
  styleUrls: ['./tracker-modal.component.scss'],
})
export class TrackerModalComponent implements OnInit {
  @Input() sura: SuraQuranTracker;
  pageInfo: PageInfo;
  lettersCounter = 0;
  constructor(
    private quranService: QuranService,
    private quranTrackerService: QuranTrackerService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initStream();
  }

  initStream() {
    this.sura.pages.forEach((item) => {
      const obj = this.quranService.getNumberOfWordsAndLettersPerPage(
        item.page
      );
      item.numberOfLetters = obj.lettersNumber;
      item.numberOfWords = obj.wordsNumber;
      this.lettersCounter += item.completed ? item.numberOfLetters : 0;
    });
  }

  addOrRemovePage(addPage: boolean, page: number) {
    this.quranTrackerService.addOrRemovePage(addPage, page);
    this.initStream();
  }

  goToPage(page) {
    this.router.navigate([`/tabs/holy-quran/${page}`]);
    this.dismissModal();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async presentArgumentModal() {
    const modal = await this.modalController.create({
      component: ArgumentModalComponent,
      initialBreakpoint: 0.7,
    });
    return await modal.present();
  }

  getPercentsFixed(completedPages, totalPages) {
    const num =  (completedPages / totalPages) * 100;
    return num.toFixed(2);
  }
}
