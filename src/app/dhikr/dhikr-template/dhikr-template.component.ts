import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { DhikrType, MorningEveningTrackerService } from '../morning-evening-tracker.service';
import { DhikrLocalStoarge, DhikrService } from '../shared/dhikr.service';
import { MediaPlayerService } from '../shared/media-player.service';
import { NotificationsService } from '../shared/notifications.service';
@Component({
  selector: 'app-dhikr-template',
  templateUrl: './dhikr-template.component.html',
  styleUrls: ['./dhikr-template.component.scss'],
})
export class DhikrTemplateComponent implements OnInit {
  @Input() name: string;
  @ViewChild('slides', { static: true }) slides: IonSlides;
  @Input() dhikrs: any;
  @Input() dhikrType: DhikrType;
  currentTime = -0.5;
  startSecond: number;
  endSecond: number;
  sliderLength: number;
  sliderActiveIndex = 0;
  dhikrLocalStoarge = DhikrLocalStoarge;
  activeAudio: any;
  backgroundImage: string;

  constructor(
    public dhikrService: DhikrService,
    public mediaPlayerService: MediaPlayerService,
    private router: Router,
    public notificationsService: NotificationsService,
    private morningEveningTrackerService: MorningEveningTrackerService
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

  goTo() {
    this.router.navigate(['/tasbeeh/tabs/counter']);
  }

  onCounterClick(dhikr){
    dhikr.counter++;

    if(dhikr.counter === dhikr.recitate){
      if(this.dhikrType === DhikrType.morningDhikr) {
        this.morningEveningTrackerService.setTotalCounterForMorningDhikr();
      }
      else if(this.dhikrType === DhikrType.eveningDhikr) {
        this.morningEveningTrackerService.setTotalCounterForEveningDhikr();
      }
      else if(this.dhikrType === DhikrType.dhikrBeforeSleeping) {
        this.morningEveningTrackerService.setTotalCounterForDhikrBeforeSleeping();
      }
    }
    if (dhikr.counter <= dhikr.recitate){
      if(this.dhikrType === DhikrType.morningDhikr) {
        this.morningEveningTrackerService.increaseCounterForMorningDhikr(dhikr);
      }
      else if(this.dhikrType === DhikrType.eveningDhikr) {
        this.morningEveningTrackerService.increaseCounterForEveningDhikr(dhikr);
      }
      else if(this.dhikrType === DhikrType.dhikrBeforeSleeping) {
        this.morningEveningTrackerService.increaseCounterForDhikrBeforeSleeping(dhikr);
      }
      this.notificationsService.vibrate(50);
    }
  }
}
