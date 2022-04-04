import { EventEmitter, Injectable } from '@angular/core';
import { Howl } from 'howler';
import { QuranService } from '../quran/quran.service';

export enum PlayerSpeedOptions {
  slow1 = 0.50,
  slow2 = 0.75,
  normal = 1,
  fast1 = 1.25,
  fast2 = 1.50,
  fast3 = 1.75,
  fast4 = 2,
}

export enum PlayerRepeatOptions {
  default = 1,
}

export enum PlayerOptions {
  repeat = 'REPEAT',
  order = 'ORDER',
}
@Injectable({
  providedIn: 'root',
})
export class MediaPlayerService {
  //https://howlerjs.com/
  player: Howl = null;
  isPlaying = false;
  currentTime = -1;
  watchCurrentTimeInterval;
  isPaused = false;
  isLoading = false;
  audioUrl: string;
  repeatAyahCounter = 1;
  playingCurrentPage: any;
  playingCurrentAyah: any;
  switchSlide: EventEmitter<any> = new EventEmitter();
  slideSwitched: EventEmitter<any> = new EventEmitter();
  scrollIntoPlayingAyah: EventEmitter<number> = new EventEmitter();

  speedOptions = [
    {
      value: PlayerSpeedOptions.slow1
    },
    {
      value: PlayerSpeedOptions.slow2
    },
    {
      value: PlayerSpeedOptions.normal
    },
    {
      value: PlayerSpeedOptions.fast1
    },
    {
      value: PlayerSpeedOptions.fast2
    },
    {
      value: PlayerSpeedOptions.fast3
    },
    {
      value: PlayerSpeedOptions.fast4
    }
  ];

  selectedSpeedOption = PlayerSpeedOptions.normal;
  selectedRepeatOption =  PlayerRepeatOptions.default;
  constructor(private quranService: QuranService) {}

  playAudio(ayahIndexInHolyQuran, ordinalNumberOfAyahOnPage, currentPage, numberOfAyahsOnCurrentPage) {
    this.audioUrl = `https://cdn.islamic.network/quran/audio/${this.quranService.qari.value}/${ayahIndexInHolyQuran}.mp3`;
    this.playingCurrentAyah = ayahIndexInHolyQuran;
    this.isLoading = true;
    if (this.player) {
      this.stopAudio();
      this.removePlayer();
    }
    this.player = new Howl({
      html5: true,
      src: [this.audioUrl],
      onplay: () => {
        this.isPlaying = true;
        this.isPaused = false;
        this.isLoading = false;
      },
      onload: () => {
          this.scrollIntoPlayingAyah.emit(this.playingCurrentAyah);
      },
      onend: () => {
        this.isPlaying = false;
        this.clearWatchCurrentTimeInterval();
        if(this.selectedRepeatOption === PlayerRepeatOptions.default || this.repeatAyahCounter >= this.selectedRepeatOption) {
          this.repeatAyahCounter = 1;
        ayahIndexInHolyQuran = ayahIndexInHolyQuran + 1;
        ordinalNumberOfAyahOnPage = ordinalNumberOfAyahOnPage + 1;

          if(ordinalNumberOfAyahOnPage > numberOfAyahsOnCurrentPage) {
            currentPage++;

            if(ayahIndexInHolyQuran > 6236 || currentPage > 604) {
              alert('Zadnji ajet proučen');
              this.removePlayer();
              return;
            }
            this.quranService.setCurrentPage(++this.quranService.currentPage);
            ordinalNumberOfAyahOnPage = 1;

            this.quranService.getNumberOfAyahsByPage(currentPage).subscribe(numberOfAyahs => {
              numberOfAyahsOnCurrentPage = numberOfAyahs;
              this.switchSlide.emit(true);
              this.slideSwitched.subscribe(()=> {
                this.playAudio(ayahIndexInHolyQuran, ordinalNumberOfAyahOnPage, currentPage, numberOfAyahsOnCurrentPage);
              });
            });
          }
          else {
            this.playAudio(ayahIndexInHolyQuran, ordinalNumberOfAyahOnPage, currentPage, numberOfAyahsOnCurrentPage);
          }
        }
        else {
          this.repeatAyahCounter++;
            this.playAudio(ayahIndexInHolyQuran, ordinalNumberOfAyahOnPage, currentPage, numberOfAyahsOnCurrentPage);
        }

      },
      onloaderror: (id, error) => {
        this.isLoading = false;
        this.isPlaying = false;
        this.removePlayer();
        // alert('onloaderror:' + error);
      },
      onplayerror: (id, error) => {
        this.isLoading = false;
        this.isPlaying = false;
        this.removePlayer();
        alert('onplayerror:' + error);
      },
    });
    this.player.rate(this.selectedSpeedOption);
    this.player.play();
    this.watchCurrentTime();
  }

  stopAudio() {
    this.player.stop();
    this.isPlaying = false;
    this.clearWatchCurrentTimeInterval();
  }

  pauseAudio() {
    this.player.pause();
    this.isPaused = true;
    this.isPlaying = false;
  }

  continueAudio() {
    if (!this.player.playing()) {
      this.player.play();
      this.isPaused = false;
      this.isPlaying = true;
    }
  }

  getAudioCurrentTime() {
    return this.player.seek();
  }

  setAudioCurrentTime(time, audioUrl?) {
    this.isLoading = true;
    if (!this.player) {
      this.player = new Howl({
        html5: true,
        src: [audioUrl],
        onplay: () => {
          this.isPlaying = true;
          this.isPaused = false;
          this.isLoading = false;
        },
        onend: () => {
          this.isPlaying = false;
          this.clearWatchCurrentTimeInterval();
        },
        onloaderror: (id, error) => {
          this.isLoading = false;
          this.isPlaying = false;
          alert('onloaderror setAudioCurrentTime:' + error);
        },
        onplayerror: (id, error) => {
          this.isLoading = false;
          this.isPlaying = false;
          alert('onplayerror setAudioCurrentTime:' + error);
        },
      });
    }
    this.stopAudio();
    this.player.seek(time);
    this.player.play();
    this.watchCurrentTime();
  }

  watchCurrentTime() {
    this.watchCurrentTimeInterval = setInterval(() => {
      this.currentTime = this.getAudioCurrentTime();
      console.log('watching interval');
    }, 100);
  }

  clearWatchCurrentTimeInterval() {
    clearInterval(this.watchCurrentTimeInterval);
    this.currentTime = -1;
  }

  getPlayerDuration() {
    return this.player.duration();
  }

  removePlayer() {
    if (this.player) {
      this.stopAudio();
      this.player = null;
      this.isPlaying = false;
      this.isPaused = false;
    }
  }
}
