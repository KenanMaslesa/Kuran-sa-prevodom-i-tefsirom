import { EventEmitter, Injectable } from '@angular/core';
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
  fast11 = 2.1,
  fast12 = 2.2,
  fast13 = 2.3,
  fast14 = 2.4,
  fast15 = 2.5,
  fast16 = 2.6,
  fast17 = 2.7,
  fast18 = 2.8,
  fast19 = 2.9,
  fast20 = 3,
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
  subs: Subscription = new Subscription();
  audioUrl: string;
  repeatAyahCounter = 1;
  playingCurrentPage: any;
  playingCurrentAyah: any;
  playingBismillahEnded: EventEmitter<any> = new EventEmitter();
  scrollIntoPlayingAyah: EventEmitter<number> = new EventEmitter();
  playingCurrentAyahChanged: EventEmitter<boolean> = new EventEmitter();
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
    {
      value: PlayerSpeedOptions.fast13,
    },
    {
      value: PlayerSpeedOptions.fast14,
    },
    {
      value: PlayerSpeedOptions.fast15,
    },
    {
      value: PlayerSpeedOptions.fast16,
    },
    {
      value: PlayerSpeedOptions.fast17,
    },
    {
      value: PlayerSpeedOptions.fast18,
    },
    {
      value: PlayerSpeedOptions.fast19,
    },
    {
      value: PlayerSpeedOptions.fast20,
    },
  ];

  selectedSpeedOption = PlayerSpeedOptions.normal;
  selectedRepeatOption = PlayerRepeatOptions.default;

  //hifz
  hifzRepeatEveryAyahCounter = 0;
  hifzRepeatGroupOfAyahsCounter = 0;
  hifzRepeatEveryAyah = 1;
  hifzRepeatGroupOfAyahs = 1;
  hifzDelayBetweenAyahs = 0;
  hifzDelayBetweenGroupOfAyahs = 0;
  hifzPlayFromAyah: number;
  showHifzPlayer = false;
  hifzIsPlaying = false;
  currentHifzDelayTime = -1;
  watchHifzDelayInterval;
  selectedHifzSpeedOption = PlayerSpeedOptions.normal;
  hifzPlayerEnded: EventEmitter<boolean> = new EventEmitter();

  constructor(private quranService: QuranService) {}

  unsubscribe() {
    console.log('MediaPlayerService unsubscribe');
    this.subs.unsubscribe();
  }

  playOneAyah(ayahIndexInHolyQuran) {
    this.subs.add(
      this.quranService
        .getAyatDetailsByAyahIndex(ayahIndexInHolyQuran)
        .subscribe((ayah) => {
          const response = ayah[0];
          this.audioUrl = `https://www.everyayah.com/data/${this.quranService.qari.value}/${this.formatNumberForAudioUrl(
            response.sura,
            response.ayaNumber
          )}.mp3`;
        })
    );
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

  changeQuranPageIfNeeded(ayahIndexInHolyQuran) {
    this.subs.add(
      this.quranService
        .getAyatDetailsByAyahIndex(ayahIndexInHolyQuran)
        .subscribe((ayah) => {
          const response = ayah[0];
          if (this.quranService.currentPage !== response.page) {
            this.quranService.setCurrentPage(response.page);
          }
          this.audioUrl = `https://www.everyayah.com/data/${this.quranService.qari.value}/${this.formatNumberForAudioUrl(
            response.sura,
            response.ayaNumber
          )}.mp3`;
        })
    );
  }

  playAudio(ayahIndexInHolyQuran) {
    // this.audioUrl = `https://cdn.islamic.network/quran/audio/${this.quranService.qari.value}/${ayahIndexInHolyQuran}.mp3`;
    this.changeQuranPageIfNeeded(ayahIndexInHolyQuran);
    this.playingCurrentAyah = ayahIndexInHolyQuran;
    this.quranService.markedAyah = ayahIndexInHolyQuran;
    this.isLoading = true;

    this.quranService.qariChanged.subscribe(() => {
      this.playAudio(ayahIndexInHolyQuran);
    });

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
        this.playingCurrentAyahChanged.emit(true);
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

          if (ayahIndexInHolyQuran > 6236) {
            alert('Zadnji ajet proučen');
            this.removePlayer();
            return;
          }
          //play next ayah or bismillah START
          if (this.quranService.playBismillahBeforeAyah(ayahIndexInHolyQuran)) {
            this.changeQuranPageIfNeeded(ayahIndexInHolyQuran);
            this.playBismillah();
            this.subs.add(
              this.playingBismillahEnded.subscribe((ended) => {
                if (ended) {
                  this.playAudio(ayahIndexInHolyQuran);
                }
              })
            );
          } else {
            this.playAudio(ayahIndexInHolyQuran);
          }
          //play next ayah or bismillah END
        } else {
          this.repeatAyahCounter++;
          this.playAudio(ayahIndexInHolyQuran);
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
    this.player.rate(this.selectedSpeedOption);
    this.player.play();
    this.watchCurrentTime();
  }

  formatNumberForAudioUrl(suraNumber, ayahNumber) {
    const sura = this.formatSuraAndAyahNumber(suraNumber);
    const ayah = this.formatSuraAndAyahNumber(ayahNumber);
    const result = sura + ayah;
    return result;
  }

  formatSuraAndAyahNumber(suraNumber) {
    let tempNumber;
    if (suraNumber >= 100) {
      tempNumber = suraNumber;
    } else if (suraNumber >= 10 && suraNumber < 100) {
      tempNumber = '0' + suraNumber;
    } else if (suraNumber < 10) {
      tempNumber = '00' + suraNumber;
    }
    return tempNumber;
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
        `https://www.everyayah.com/data/${this.quranService.qari.value}/001001.mp3`,
      ],
      onplay: () => {
        this.isPlaying = true;
        this.isPaused = false;
        this.isLoading = false;
        this.playingBismillahEnded.emit(false);
        this.playingCurrentAyah = this.playingCurrentAyah + 1;
        this.quranService.markedAyah = this.playingCurrentAyah;
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

  stopAudio() {
    this.player.stop();
    this.isPlaying = false;
    this.clearWatchCurrentTimeInterval();
  }

  pauseAudio() {
    this.player.pause();
    this.isPaused = true;
    this.isPlaying = false;
    this.clearWatchCurrentTimeInterval();
  }

  continueAudio() {
    if (!this.player.playing()) {
      this.player.play();
      this.isPaused = false;
      this.isPlaying = true;
      this.watchCurrentTime();
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

  //hifz
  playHifzPlayer(
    fromAyah: number,
    fromAyahStatic: number,
    toAyah: number
  ) {
    this.changeQuranPageIfNeeded(fromAyah);
    // this.audioUrl = `https://cdn.islamic.network/quran/audio/${this.quranService.qari.value}/${fromAyah}.mp3`;
    this.playingCurrentAyah = fromAyah;
    this.quranService.markedAyah = this.playingCurrentAyah;
    this.hifzRepeatEveryAyahCounter++;
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
        this.hifzIsPlaying = true;
        this.isPlaying = true;
        this.isPaused = false;
        this.isLoading = false;
        this.hifzPlayerEnded.emit(false);
        this.playingCurrentAyahChanged.emit(true);
      },
      onload: () => {
        this.scrollIntoPlayingAyah.emit(this.playingCurrentAyah);
      },
      onend: () => {
        this.isPlaying = false;
        this.hifzIsPlaying = false;
        this.clearWatchCurrentTimeInterval();
        if (this.hifzRepeatEveryAyahCounter >= this.hifzRepeatEveryAyah) {
          fromAyah = fromAyah + 1;
          this.hifzRepeatEveryAyahCounter = 0;
        }
        if (fromAyah <= toAyah) {
          this.isPlaying = true;
          this.hifzIsPlaying = true;
          if(this.hifzDelayBetweenAyahs !== 0) {
            this.countdownHizfDelay(this.hifzDelayBetweenAyahs*1000);
          }
          setTimeout(() => {
            this.playHifzPlayer(fromAyah, fromAyahStatic, toAyah);
          }, this.hifzDelayBetweenAyahs*1000);
        } else {
          this.hifzRepeatGroupOfAyahsCounter++;
          fromAyah = this.hifzPlayFromAyah;
          if (this.hifzRepeatGroupOfAyahsCounter >= this.hifzRepeatGroupOfAyahs) {
            this.hifzIsPlaying = false;
            this.hifzRepeatGroupOfAyahsCounter = 0;
            this.hifzPlayerEnded.emit(true);
            this.playingCurrentAyah = null;
          } else {
            this.isPlaying = true;
            this.hifzIsPlaying = true;
            if(this.hifzDelayBetweenGroupOfAyahs !== 0) {
              this.countdownHizfDelay(this.hifzDelayBetweenGroupOfAyahs*1000);
            }
            setTimeout(() => {
              this.playHifzPlayer(fromAyah, fromAyahStatic, toAyah);
            }, this.hifzDelayBetweenGroupOfAyahs*1000);
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
    this.player.rate(this.selectedHifzSpeedOption);
    this.player.play();
    this.watchCurrentTime();
  }

  countdownHizfDelay(time) {
    this.currentHifzDelayTime = time;
    this.watchHifzDelayInterval = setInterval(() => {
      this.currentHifzDelayTime -= 100;
      if(this.currentHifzDelayTime <= 0) {
        this.clearWatchHizfDelayInterval();
      }
      console.log('countdownHizfDelay watching interval');
    }, 100);
  }

  clearWatchHizfDelayInterval() {
    clearInterval(this.watchHifzDelayInterval);
    this.currentHifzDelayTime = -1;
  }
}
