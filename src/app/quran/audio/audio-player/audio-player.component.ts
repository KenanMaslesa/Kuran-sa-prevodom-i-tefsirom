import { Component, OnInit } from '@angular/core';
import { AudioPlayerService, PlayerRepeatOptions } from '../audio-player.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  public readonly playerRepeatOptions = PlayerRepeatOptions;
  constructor(public audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {}

  playNextSura() {
    this.audioPlayerService.currentTime = -1;
    let suraNumber;

    if(this.audioPlayerService.isShuffleSelected) {
      suraNumber = this.audioPlayerService.randomNumberInRange(1, 114);
    }
    else {
      if (this.audioPlayerService.selectedSuraIndex >= 114) {
        suraNumber = 1;
      } else {
        suraNumber = this.audioPlayerService.selectedSuraIndex + 1;
      }
    }
    this.audioPlayerService.play(this.audioPlayerService.qari, suraNumber);
  }

  playPrevSura() {
    this.audioPlayerService.currentTime = -1;

    let suraNumber;
    if (this.audioPlayerService.selectedSuraIndex <= 1) {
      suraNumber = 114;
    } else {
      suraNumber = this.audioPlayerService.selectedSuraIndex - 1;
    }
    this.audioPlayerService.play(this.audioPlayerService.qari, suraNumber);
  }

  playAudio() {
    if(this.audioPlayerService.player) {
      this.audioPlayerService.continueAudio();
    }
    else {
      this.playSura();
    }
  }

  playSura(selectedSura = 1) {
    this.audioPlayerService.isPlayerMinimized = false;
    this.audioPlayerService.currentTime = -1;
    this.audioPlayerService.play(this.audioPlayerService.qari, +selectedSura);
  }


}
