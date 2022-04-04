import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TafsirAyah } from '../../quran.models';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage {
  @Input() ayah: TafsirAyah;
  constructor(public modalController: ModalController) { }

clicked() {
  this.modalController.dismiss();
}
}
