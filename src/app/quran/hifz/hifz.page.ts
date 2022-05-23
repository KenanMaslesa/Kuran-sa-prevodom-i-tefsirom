import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MainPopoverComponent } from 'src/app/shared/components/popovers/main-popover/main-popover.component';
import { MediaPlayerService } from 'src/app/shared/media-player.service';

@Component({
  selector: 'app-hifz',
  templateUrl: './hifz.page.html',
  styleUrls: ['./hifz.page.scss'],
})
export class HifzPage implements OnInit {

  constructor(public mediaPlayerService: MediaPlayerService, private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: MainPopoverComponent,
      event,
      componentProps: {
        showExternalLinks: true
      }
    });
    await popover.present();
  }

}
