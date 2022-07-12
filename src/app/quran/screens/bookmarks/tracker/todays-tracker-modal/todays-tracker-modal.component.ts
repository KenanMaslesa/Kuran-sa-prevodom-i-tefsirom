import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PageInfo } from 'src/app/quran/shared/quran.models';
import { QuranService } from 'src/app/quran/shared/services/quran.service';
import { SettingsService } from 'src/app/quran/screens/settings/settings.service';
import { TimeTrackingService } from 'src/app/quran/shared/services/time-tracking.service';
import { QuranTrackerService } from '../quran-tracker.service';
import { ArgumentModalComponent } from './argument-modal/argument-modal.component';
import { HowToUseTrackerComponent } from './how-to-use-tracker/how-to-use-tracker.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todays-tracker-modal',
  templateUrl: './todays-tracker-modal.component.html',
  styleUrls: ['./todays-tracker-modal.component.scss'],
})
export class TodaysTrackerModalComponent implements OnInit {
  todaysData: PageInfo[] = [];
  lettersCounter = 0;
  constructor(
    private quranTrackerService: QuranTrackerService,
    private quranService: QuranService,
    private modalController: ModalController,
    public timeTrackingService: TimeTrackingService,
    public settingsService: SettingsService,
    private router: Router
  ) {}
  ngOnInit() {
    this.quranTrackerService.todaysCompletedPages.forEach((page) => {
      const pageObj = this.quranService.getNumberOfWordsAndLettersPerPage(page);
      this.lettersCounter += pageObj.lettersNumber;
      this.todaysData.push({
        page,
        lettersNumber: pageObj.lettersNumber,
        wordsNumber: pageObj.wordsNumber,
      });
    });
  }

  async presentArgumentModal() {
    const modal = await this.modalController.create({
      component: ArgumentModalComponent,
      initialBreakpoint: 0.7,
    });
    return await modal.present();
  }

  async presentHowtoUseModal() {
    const modal = await this.modalController.create({
      component: HowToUseTrackerComponent,
      initialBreakpoint: 0.7,
    });
    return await modal.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  goToPage(page) {
    this.router.navigate([`quran/tabs/holy-quran/${page}`]);
  }

  getPercentsFixed(completedPages, totalPages) {
    const num =  (completedPages / totalPages) * 100;
    return num.toFixed(2);
  }

  getPercentsForJuzFixed(completedPages, totalPages) {
    const num = completedPages / totalPages;
    return num.toFixed(1);
  }

  getTodaysDate() {
    const date = new Date();
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
  }
}
