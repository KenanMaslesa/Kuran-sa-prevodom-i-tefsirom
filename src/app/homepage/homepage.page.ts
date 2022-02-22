import { Component } from '@angular/core';
import { MediaPlayerService } from '../shared/media-player.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage{

  constructor(private mediaPlayerService: MediaPlayerService) { }

  ionViewDidEnter() {
    this.mediaPlayerService.removePlayer();
  }

}
