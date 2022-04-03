import { EventEmitter, Injectable } from '@angular/core';
import { Howl } from 'howler';
import { QuranService } from '../quran/quran.service';

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
  playingCurrentPage: any;
  playingCurrentAyah: any;
  switchSlide: EventEmitter<any> = new EventEmitter();
  slideSwitched: EventEmitter<any> = new EventEmitter();
  scrollIntoPlayingAyah: EventEmitter<number> = new EventEmitter();

  playOptions = [
    {
      value: PlayerOptions.order,
      name: 'Ajet po ajet'
    },
    {
      value: PlayerOptions.repeat,
      name: 'Ponavljaj ajet'
    }
  ];
  selectedPlayOption = PlayerOptions.order;
  constructor(private quranService: QuranService) {}

  playAudio(ayahIndexInHolyQuran, ordinalNumberOfAyahOnPage, currentPage, numberOfAyahsOnCurrentPage) {
    if(ayahIndexInHolyQuran > 6236 || currentPage > 604) {
      alert('Zadnji ajet proučen');
      return;
    }
    this.audioUrl = `https://cdn.islamic.network/quran/audio/${this.quranService.qari}/${ayahIndexInHolyQuran}.mp3`;
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
        if(this.selectedPlayOption !== PlayerOptions.repeat) {
          this.scrollIntoPlayingAyah.emit(this.playingCurrentAyah);
        }
      },
      onend: () => {
        this.isPlaying = false;
        this.clearWatchCurrentTimeInterval();
        ayahIndexInHolyQuran = ayahIndexInHolyQuran + 1;
        ordinalNumberOfAyahOnPage = ordinalNumberOfAyahOnPage + 1;

          if(ordinalNumberOfAyahOnPage > numberOfAyahsOnCurrentPage) {
            this.quranService.setCurrentPage(++this.quranService.currentPage);
            ordinalNumberOfAyahOnPage = 1;
            currentPage++;
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

      },
      onloaderror: (id, error) => {
        this.isLoading = false;
        this.isPlaying = false;
        this.removePlayer();
        alert('onloaderror:' + error);
      },
      onplayerror: (id, error) => {
        this.isLoading = false;
        this.isPlaying = false;
        this.removePlayer();
        alert('onplayerror:' + error);
      },
    });
    this.player.rate(5);
    this.player.play();
    this.watchCurrentTime();
  }

  playAudioForTranslationPage(ayahIndexInHolyQuran, ayahIdOnPage, numberOfAyahsPerPages?, currentPage?, ayahOrderNumberOnPage?) {
    let numberOfAyahsOnCurrentPage;
    if(this.selectedPlayOption !== PlayerOptions.repeat) {
       numberOfAyahsOnCurrentPage = numberOfAyahsPerPages[0].length;
    }
    this.audioUrl = `https://cdn.islamic.network/quran/audio/${this.quranService.qari}/${ayahIndexInHolyQuran}.mp3`;
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
        if(this.selectedPlayOption !== PlayerOptions.repeat) {
          this.scrollIntoPlayingAyah.emit(ayahIndexInHolyQuran);
        }
      },
      onend: () => {
        this.isPlaying = false;
        this.clearWatchCurrentTimeInterval();
        if(this.selectedPlayOption === PlayerOptions.repeat) {
          this.playAudioForTranslationPage(ayahIndexInHolyQuran, ayahIdOnPage, numberOfAyahsPerPages, currentPage, ayahOrderNumberOnPage);
        }
        else {
          ayahIndexInHolyQuran = ayahIndexInHolyQuran + 1;
          ayahIdOnPage = ayahIdOnPage + 1;
          if(ayahOrderNumberOnPage >= numberOfAyahsOnCurrentPage) {
            currentPage = currentPage + 1;
            if(currentPage >= 604) {
              alert('Proucen je zadnji ajet zadnje sure');
              return;
            }
            this.switchSlide.emit(true);
            ayahOrderNumberOnPage = 1;
            this.slideSwitched.subscribe(()=> {
              this.playAudioForTranslationPage(ayahIndexInHolyQuran, ayahIdOnPage, numberOfAyahsPerPages, currentPage, ayahOrderNumberOnPage);
            });
          }
          else {
            ayahOrderNumberOnPage = ayahOrderNumberOnPage + 1;
            this.playAudioForTranslationPage(ayahIndexInHolyQuran, ayahIdOnPage, numberOfAyahsPerPages, currentPage, ayahOrderNumberOnPage);
          }
        }

      },
      onloaderror: (id, error) => {
        this.isLoading = false;
        this.isPlaying = false;
        this.removePlayer();
        alert('onloaderror:' + error);
      },
      onplayerror: (id, error) => {
        this.isLoading = false;
        this.isPlaying = false;
        this.removePlayer();
        alert('onplayerror:' + error);
      },
    });
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
