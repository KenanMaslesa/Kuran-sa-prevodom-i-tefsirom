import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NotificationsService } from '../../shared/notifications.service';
import { TasbeehService } from '../tasbeeh.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.page.html',
  styleUrls: ['./counter.page.scss'],
})
export class CounterPage implements OnInit {
  vibrate = true;
  constructor(
    private notificationsService: NotificationsService,
    public tasbeehService: TasbeehService,
    private alertController: AlertController
  ) {
    const vibrate = localStorage.getItem('vibrate');
    if (vibrate) {
      this.vibrate = JSON.parse(vibrate);
    }
  }

  ngOnInit() {}

  increaseCounter() {
    this.tasbeehService.increaseCounter();
    if (
      this.tasbeehService.selectedDhikr.counter === 33 ||
      this.tasbeehService.selectedDhikr.counter === 66 ||
      this.tasbeehService.selectedDhikr.counter === 100
    ) {
      if (this.vibrate) {
        this.notificationsService.vibrate(250);
      }
    } else {
      if (this.vibrate) {
        this.notificationsService.vibrate(50);
      }
    }
  }

  resetCounter() {
    this.presentAlertConfirm();
  }

  toggleVibrate() {
    this.vibrate = !this.vibrate;
    localStorage.setItem('vibrate', JSON.stringify(this.vibrate));
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'reset-alert',
      header: 'Resetovanje brojača',
      message: 'Jeste li sigurni da želite resetovati brojač?',
      buttons: [
        {
          text: 'NE',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Da',
          handler: () => {
            if (this.vibrate) {
              this.notificationsService.vibrate(500);
            }
            this.tasbeehService.resetCounter();
          },
        },
      ],
    });

    await alert.present();
  }
}
