import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { QuranTrackerService } from './quran-tracker.service';
import { TodaysTrackerModalComponent } from './todays-tracker-modal/todays-tracker-modal.component';
import { TrackerModalComponent } from './tracker-modal/tracker-modal.component';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage {
  constructor(
    public quranTrackerService: QuranTrackerService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  getPercents(completedPages, totalPages) {
    return Math.floor((completedPages / totalPages) * 100);
  }

  getPercentsFixed(completedPages, totalPages) {
    const num = (completedPages / totalPages) * 100;
    return num.toFixed(2);
  }

  getPercentsForJuzFixed(completedPages, totalPages) {
    const num = completedPages / totalPages;
    return num.toFixed(1);
  }

  async presentModal(sura) {
    const modal = await this.modalController.create({
      component: TrackerModalComponent,
      initialBreakpoint: 0.7,
      componentProps: {
        sura,
      },
    });
    return await modal.present();
  }

  async showTodaysTrackerModal() {
    const modal = await this.modalController.create({
      component: TodaysTrackerModalComponent,
      initialBreakpoint: 0.93,
    });
    return await modal.present();
  }

  async resetTracker() {
    const alert = await this.alertController.create({
      header: 'Resetovanje trackera',
      message: 'Svi podaci će biti izbrisani. Želite li nastaviti?',
      buttons: [
        {
          text: 'NE',
          role: 'cancel',
        },
        {
          text: 'Da',
          handler: () => {
            this.quranTrackerService.resetTracker();
          },
        },
      ],
    });

    await alert.present();
  }
}
