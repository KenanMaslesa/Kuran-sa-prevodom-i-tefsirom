import { Injectable } from '@angular/core';
import {Howl} from 'howler';
@Injectable({
  providedIn: 'root'
})
export class MediaPlayerService { //https://howlerjs.com/
  player: Howl = null;
  isPlaying = false;
  currentTime = -1;
  watchCurrentTimeInterval;
  isPaused = false;
  constructor() { }

  playAudio(audioUrl){
    if(this.player){
      this.stopAudio();
    }
    this.player = new Howl({
      html5: true,
      src: [audioUrl],
      onplay: () => {
        this.isPlaying = true;
      },
      onend: () => {
        this.isPlaying = false;
        this.clearWatchCurrentTimeInterval();
      }
    });
    this.player.play();
    this.watchCurrentTime();
    this.isPlaying = true;
  }

  stopAudio() {
    this.player.stop();
    this.isPlaying = false;
    this.clearWatchCurrentTimeInterval();
  }

  pauseAudio(){
    this.player.pause();
    this.isPaused = true;
  }

  continueAudio(){
    if(!this.player.playing()){
      this.player.play();
      this.isPaused = false;
    }
  }

  getAudioCurrentTime() {
    return this.player.seek();
  }

  setAudioCurrentTime(time, audioUrl?){
    if(!this.player){
      this.player = new Howl({
        html5: true,
        src: [audioUrl],
        onplay: () => {
          this.isPlaying = true;
        },
        onend: () => {
          this.isPlaying = false;
          this.clearWatchCurrentTimeInterval();
        }
      });
    }
    this.stopAudio();
    this.player.seek(time);
    this.player.play();
    this.watchCurrentTime();
  }

  watchCurrentTime(){
    this.watchCurrentTimeInterval = setInterval(()=> {
      this.currentTime = this.getAudioCurrentTime();
      console.log('watching interval');
    }, 100);
  }

  clearWatchCurrentTimeInterval(){
    clearInterval(this.watchCurrentTimeInterval);
    this.currentTime = -1;
  }

  getPlayerDuration() {
    return this.player.duration();
  }

  removePlayer() {
    if(this.player){
      this.stopAudio();
      this.player = null;
    }
  }
}
