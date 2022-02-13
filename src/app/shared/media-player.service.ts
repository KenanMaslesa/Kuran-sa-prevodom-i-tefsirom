import { Injectable } from '@angular/core';
import {Howl} from 'howler';
@Injectable({
  providedIn: 'root'
})
export class MediaPlayerService {
  player: Howl = null;
  isPlaying = false;
  currentTime = -1;
  watchCurrentTimeInterval;
  constructor() { }

  playAudio(audioUrl){
    if(this.player){
      this.stopAudio();
    }
    this.player = new Howl({
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
  }

  stopAudio() {
    this.player.stop();
    this.isPlaying = false;
    this.clearWatchCurrentTimeInterval();
  }

  getAudioCurrentTime() {
    return this.player.seek();
  }

  setAudioCurrentTime(time, audioUrl){
    if(!this.player){
      this.player = new Howl({
        src: [audioUrl]
      });
    }
    this.stopAudio();
    this.player.seek(time);
    this.player.play();
    this.isPlaying = true;
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
