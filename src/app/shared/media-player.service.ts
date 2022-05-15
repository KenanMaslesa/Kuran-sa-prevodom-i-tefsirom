import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Howl } from 'howler';
import { Subscription } from 'rxjs';
import { QuranService } from '../quran/quran.service';

export enum PlayerSpeedOptions {
  slow1 = 0.3,
  slow2 = 0.4,
  slow3 = 0.5,
  slow4 = 0.6,
  slow5 = 0.7,
  slow6 = 0.8,
  slow7 = 0.9,
  normal = 1,
  fast1 = 1.1,
  fast2 = 1.2,
  fast3 = 1.3,
  fast4 = 1.4,
  fast5 = 1.5,
  fast6 = 1.6,
  fast7 = 1.7,
  fast8 = 1.8,
  fast9 = 1.9,
  fast10 = 2,
  fast11 = 2.5,
  fast12 = 3,
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
  playingBismillahEnded: EventEmitter<any> = new EventEmitter();
  switchSlide: EventEmitter<any> = new EventEmitter();
  slideSwitched: EventEmitter<any> = new EventEmitter();
  scrollIntoPlayingAyah: EventEmitter<number> = new EventEmitter();

  speedOptions = [
    {
      value: PlayerSpeedOptions.slow1,
    },
    {
      value: PlayerSpeedOptions.slow2,
    },
    {
      value: PlayerSpeedOptions.slow3,
    },
    {
      value: PlayerSpeedOptions.slow4,
    },
    {
      value: PlayerSpeedOptions.slow5,
    },
    {
      value: PlayerSpeedOptions.slow6,
    },
    {
      value: PlayerSpeedOptions.slow7,
    },
    {
      value: PlayerSpeedOptions.normal,
    },
    {
      value: PlayerSpeedOptions.fast1,
    },
    {
      value: PlayerSpeedOptions.fast2,
    },
    {
      value: PlayerSpeedOptions.fast3,
    },
    {
      value: PlayerSpeedOptions.fast4,
    },
    {
      value: PlayerSpeedOptions.fast5,
    },
    {
      value: PlayerSpeedOptions.fast6,
    },
    {
      value: PlayerSpeedOptions.fast7,
    },
    {
      value: PlayerSpeedOptions.fast8,
    },
    {
      value: PlayerSpeedOptions.fast9,
    },
    {
      value: PlayerSpeedOptions.fast10,
    },
    {
      value: PlayerSpeedOptions.fast11,
    },
    {
      value: PlayerSpeedOptions.fast12,
    },
  ];

  selectedSpeedOption = PlayerSpeedOptions.normal;
  selectedRepeatOption = PlayerRepeatOptions.default;

  hifzRepeatEveryAyah = 0;
  hifzRepeatGroupOfAyahs = 0;
  hifzPlayFromAyah: number;
  showHifzPlayer = false;
  subs: Subscription = new Subscription();
  constructor(private quranService: QuranService) {}

  unsubscribe(){
    alert('MediaPlayerService unsubscribe');
    this.subs.unsubscribe();
  }

  playOneAyah(ayahIndexInHolyQuran) {
    this.audioUrl = `https://cdn.islamic.network/quran/audio/${this.quranService.qari.value}/${ayahIndexInHolyQuran}.mp3`;
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
      },
    });
    this.player.rate(this.selectedSpeedOption);
    this.player.play();
    this.watchCurrentTime();
  }

  playAudio(
    ayahIndexInHolyQuran,
    ordinalNumberOfAyahOnPage,
    currentPage,
    numberOfAyahsOnCurrentPage
  ) {
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
        if (
          this.selectedRepeatOption === PlayerRepeatOptions.default ||
          this.repeatAyahCounter >= this.selectedRepeatOption
        ) {
          this.repeatAyahCounter = 1;
          ayahIndexInHolyQuran = ayahIndexInHolyQuran + 1;
          ordinalNumberOfAyahOnPage = ordinalNumberOfAyahOnPage + 1;

          if (ordinalNumberOfAyahOnPage > numberOfAyahsOnCurrentPage) {
            currentPage++;

            if (ayahIndexInHolyQuran > 6236 || currentPage > 604) {
              alert('Zadnji ajet proučen');
              this.removePlayer();
              return;
            }
            this.quranService.setCurrentPage(++this.quranService.currentPage);
            ordinalNumberOfAyahOnPage = 1;

            this.quranService
              .getNumberOfAyahsByPage(currentPage)
              .subscribe((numberOfAyahs) => {
                numberOfAyahsOnCurrentPage = numberOfAyahs;
                this.switchSlide.emit(true);
                this.slideSwitched.subscribe(() => {
                  this.playNextAyah(
                    ayahIndexInHolyQuran,
                    ordinalNumberOfAyahOnPage,
                    currentPage,
                    numberOfAyahsOnCurrentPage
                  );
                });
              });
          } else {
            this.playNextAyah(
              ayahIndexInHolyQuran,
              ordinalNumberOfAyahOnPage,
              currentPage,
              numberOfAyahsOnCurrentPage
            );
          }
        } else {
          this.repeatAyahCounter++;
          this.playAudio(
            ayahIndexInHolyQuran,
            ordinalNumberOfAyahOnPage,
            currentPage,
            numberOfAyahsOnCurrentPage
          );
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

  play(audioUrl) {
    if (this.player) {
      this.stopAudio();
      this.removePlayer();
    }
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
    });
    this.player.rate(this.selectedSpeedOption);
    this.player.play();
    this.watchCurrentTime();
  }

  playBismillah() {
    if (this.player) {
      this.stopAudio();
      this.removePlayer();
    }
    this.player = new Howl({
      html5: true,
      src: [
        `https://cdn.islamic.network/quran/audio/${this.quranService.qari.value}/1.mp3`,
      ],
      onplay: () => {
        this.isPlaying = true;
        this.isPaused = false;
        this.isLoading = false;
        this.playingBismillahEnded.emit(false);
        this.playingCurrentAyah = this.playingCurrentAyah + 1;
        this.scrollIntoPlayingAyah.emit(this.playingCurrentAyah);
      },
      onend: () => {
        this.isPlaying = false;
        this.clearWatchCurrentTimeInterval();
        this.playingBismillahEnded.emit(true);
      },
    });
    this.player.rate(this.selectedSpeedOption);
    this.player.play();
    this.watchCurrentTime();
  }

  playNextAyah(
    ayahIndexInHolyQuran,
    ordinalNumberOfAyahOnPage,
    currentPage,
    numberOfAyahsOnCurrentPage
  ) {
    if (this.quranService.playBismillahBeforeAyah(ayahIndexInHolyQuran)) {
      this.playBismillah();
      this.subs.add(this.playingBismillahEnded.subscribe((ended) => {
        if (ended) {
          this.playAudio(
            ayahIndexInHolyQuran,
            ordinalNumberOfAyahOnPage,
            currentPage,
            numberOfAyahsOnCurrentPage
          );
        }
      }));
    } else {
      this.playAudio(
        ayahIndexInHolyQuran,
        ordinalNumberOfAyahOnPage,
        currentPage,
        numberOfAyahsOnCurrentPage
      );
    }
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

  playHifzPlayer(fromAyah: number, fromAyahStatic: number, toAyah: number, repeatGroupOfAyahs: number = 3, repeatEveryAyah: number = 1) {
    this.subs.add(
      this.quranService.getAyatDetailsByAyahIndex(fromAyah).subscribe(ayah => {
        if(this.quranService.currentPage !== ayah[0].page) {
          this.quranService.setCurrentPage(ayah[0].page);
        }
      })
    );
    this.audioUrl = `https://cdn.islamic.network/quran/audio/${this.quranService.qari.value}/${fromAyah}.mp3`;
    this.playingCurrentAyah = fromAyah;
    this.hifzRepeatEveryAyah++;
    this.hifzPlayFromAyah = fromAyahStatic;
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
        if(this.hifzRepeatEveryAyah >= repeatEveryAyah) {
          fromAyah = fromAyah + 1;
          this.hifzRepeatEveryAyah = 0;
        }
          if(fromAyah <= toAyah) {
            this.playHifzPlayer(
              fromAyah,
              fromAyahStatic,
              toAyah,
            );
          }
          else {
            this.hifzRepeatGroupOfAyahs++;
            fromAyah = this.hifzPlayFromAyah;
            if(this.hifzRepeatGroupOfAyahs >= repeatGroupOfAyahs) {
              this.removePlayer();
            }
            else {
              this.playHifzPlayer(
                fromAyah,
                fromAyahStatic,
                toAyah,
              );
            }
          }
      },
      onloaderror: () => {
        this.isLoading = false;
        this.isPlaying = false;
        this.removePlayer();
      },
      onplayerror: (error) => {
        this.isLoading = false;
        this.isPlaying = false;
        this.removePlayer();
      },
    });
    this.player.rate(this.selectedSpeedOption);
    this.player.play();
    this.watchCurrentTime();
  }
}
