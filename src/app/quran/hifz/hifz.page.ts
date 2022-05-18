import { Component, OnInit } from '@angular/core';
import { MediaPlayerService } from 'src/app/shared/media-player.service';

@Component({
  selector: 'app-hifz',
  templateUrl: './hifz.page.html',
  styleUrls: ['./hifz.page.scss'],
})
export class HifzPage implements OnInit {

  constructor(public mediaPlayerService: MediaPlayerService) { }

  ngOnInit() {
  }

}
