import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';
import { DhikrService } from '../dhikr.service';
@Component({
  selector: 'app-dhikr-template',
  templateUrl: './dhikr-template.component.html',
  styleUrls: ['./dhikr-template.component.scss'],
})
export class DhikrTemplateComponent implements OnInit {
  @Input() name: string;
  @ViewChild('slides', {static: true}) slides: IonSlides;
  @Input() dhikrs: any;
  showBosnianDhikr = true;
  showArabicDhikr = true;
  showDhikrTranslation = false;
  currentTime = -0.5;
  startSecond: number;
  endSecond: number;
  sliderLength: number;
  sliderActiveIndex = 0;
  constructor(private dhikrService: DhikrService, private nativePluginsService: NativePluginsService) { }

  ngOnInit() {
    this.setSliderLength();

    this.dhikrService.morningDhikrPageEntered.subscribe(() => {
      this.setSliderLength();
    });

    this.dhikrService.eveningDhikrPageEntered.subscribe(() => {
      this.setSliderLength();
    });
  }

  setAudio(audio, startSecond){
    this.startSecond = startSecond;
    audio.currentTime = startSecond;
    audio.play();
  }

  updateCurrentTime(audio){
    this.currentTime = audio.currentTime;
    if(this.currentTime >= this.endSecond){
      this.setAudio(audio, this.startSecond);
    }
  }

  pauseAudio(audio){
    audio.pause();
  }

  stopAudio(audio){
     audio.currentTime = 0;
  }

  getSliderActiveIndex(){
    this.slides.getActiveIndex().then((index: number) => {
      this.sliderActiveIndex = index;
    });
  }

  setSliderLength() {
    this.slides.length().then((index: number) => {
      this.sliderLength = index;
    });
  }

  slideChanged() {
    this.getSliderActiveIndex();
    this.nativePluginsService.vibrate(100);
  }

  slideNext() {
    this.slides.slideNext();
  }

  slidePrev() {
    this.slides.slidePrev();
  }
}
