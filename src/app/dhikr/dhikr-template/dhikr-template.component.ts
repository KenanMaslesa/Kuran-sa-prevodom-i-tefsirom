import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { DhikrLocalStoarge, DhikrService } from '../dhikr.service';
@Component({
  selector: 'app-dhikr-template',
  templateUrl: './dhikr-template.component.html',
  styleUrls: ['./dhikr-template.component.scss'],
})
export class DhikrTemplateComponent implements OnInit {
  @Input() name: string;
  @ViewChild('slides', { static: true }) slides: IonSlides;
  @Input() dhikrs: any;
  currentTime = -0.5;
  startSecond: number;
  endSecond: number;
  sliderLength: number;
  sliderActiveIndex = 0;
  dhikrLocalStoarge = DhikrLocalStoarge;
  activeAudio: any;
  constructor(
    public dhikrService: DhikrService,
    public mediaPlayerService: MediaPlayerService
  ) {}

  ngOnInit() {
    this.setSliderLength();
    this.mediaPlayerService.removePlayer();

    this.dhikrService.morningDhikrPageEntered.subscribe(() => {
      this.setSliderLength();
    });

    this.dhikrService.eveningDhikrPageEntered.subscribe(() => {
      this.setSliderLength();
    });
  }

  getSliderActiveIndex() {
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
  }

  slideNext() {
    this.slides.slideNext();
  }

  slidePrev() {
    this.slides.slidePrev();
  }
}
