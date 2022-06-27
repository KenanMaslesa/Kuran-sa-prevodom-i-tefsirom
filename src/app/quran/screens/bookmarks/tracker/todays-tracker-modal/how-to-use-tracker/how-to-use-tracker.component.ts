import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-how-to-use-tracker',
  templateUrl: './how-to-use-tracker.component.html',
  styleUrls: ['./how-to-use-tracker.component.scss'],
})
export class HowToUseTrackerComponent implements OnInit {

  constructor(private router: Router, private modalCtr: ModalController) { }

  ngOnInit() {}

  goToSettings() {
    this.router.navigate(['/settings']);
    this.modalCtr.dismiss();
  }

  goToQuran() {
    this.router.navigate(['/tabs/holy-quran', 2]);
    this.modalCtr.dismiss();
  }

}
