import { Component } from '@angular/core';
import { QuranService } from 'src/app/quran/quran.service';
import { MediaPlayerService } from '../../media-player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {

  constructor(public mediaPlayerService: MediaPlayerService, public quranService: QuranService) { }

}
