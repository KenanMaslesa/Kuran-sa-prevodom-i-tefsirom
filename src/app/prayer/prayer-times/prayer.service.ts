import { Injectable } from '@angular/core';
const adhan = require('adhan');

@Injectable({providedIn: 'root'})
export class PrayerService {
  constructor() { }

  public qiblaDirectionsInDegreesFromNorth(latitude, longitude) {
    const coordinates = new adhan.Coordinates(latitude, longitude);
    const qiblaDirection = adhan.Qibla(coordinates);
    return qiblaDirection;
  }
}
