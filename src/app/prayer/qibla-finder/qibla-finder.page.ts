/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';
import {
  DeviceOrientation,
  DeviceOrientationCompassHeading,
} from '@ionic-native/device-orientation/ngx';
import {
  NativeGeocoderResult,
} from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-qibla-finder',
  templateUrl: './qibla-finder.page.html',
  styleUrls: ['./qibla-finder.page.scss'],
})
export class QiblaFinderPage implements OnInit {
  public data: DeviceOrientationCompassHeading = null;
  subscription = new Subscription();
  public currentLocation: {
    latitude: number;
    longitude: number;
  };
  // Initial Kaaba location that we've got from google maps
  private kaabaLocation: { lat: number; lng: number } = {
    lat: 21.42276,
    lng: 39.8256687,
  };
  // Initial Qibla Location
  public qiblaLocation = 0;
  public locationData: {
    locality: string;
    countryName: string;
    subAdministrativeArea: string;
  };

  constructor(
    private deviceOrientation: DeviceOrientation,
    private nativePluginsService: NativePluginsService
  ) {
    // Watch the device compass heading change
    this.subscription.add(this.deviceOrientation
      .watchHeading()
      .subscribe((res: DeviceOrientationCompassHeading) => {
        this.data = res;
        // Change qiblaLocation when currentLocation is not empty
        if (!!this.currentLocation) {
          const currentQibla = res.magneticHeading - this.getQiblaPosition();
          this.qiblaLocation =
            currentQibla > 360 ? currentQibla % 360 : currentQibla;
        }
      }));
  }

  ngOnInit(): void {
    if (this.nativePluginsService.geolocationData == null) {
      this.getCurrentPosition();
    } else {
      this.currentLocation = {
        longitude: this.nativePluginsService.geolocationData.longitude,
        latitude: this.nativePluginsService.geolocationData.latitude,
      };
      this.getLocationNameByCoordinate(
        this.nativePluginsService.geolocationData.latitude,
        this.nativePluginsService.geolocationData.longitude
      );
    }
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
    console.log('unsubscribe: ', JSON.stringify(this.subscription));
  }

  getCurrentPosition() {
    this.nativePluginsService.getCurrentLocation();
    this.currentLocation = {
      longitude: this.nativePluginsService.geolocationData.longitude,
      latitude: this.nativePluginsService.geolocationData.latitude,
    };
  }

  getQiblaPosition() {
    // Convert all geopoint degree to radian before jump to furmula
    const currentLocationLat = this.degreeToRadian(
      this.currentLocation.latitude
    );
    const currentLocationLng = this.degreeToRadian(
      this.currentLocation.longitude
    );
    const kaabaLocationLat = this.degreeToRadian(this.kaabaLocation.lat);
    const kaabaLocationLng = this.degreeToRadian(this.kaabaLocation.lng);

    // Use Basic Spherical Trigonometric Formula
    return this.radianToDegree(
      Math.atan2(
        Math.sin(kaabaLocationLng - currentLocationLng),
        Math.cos(currentLocationLat) * Math.tan(kaabaLocationLat) -
          Math.sin(currentLocationLat) *
            Math.cos(kaabaLocationLng - currentLocationLng)
      )
    );
  }

  getLocationNameByCoordinate(latitude, longitude) {
    this.nativePluginsService
      .getLocationNameByCoordinate(latitude, longitude)
      .then((result: NativeGeocoderResult[]) => {
        let data;
        if (result) {
          result.forEach((item) => {
            if (item.locality) {
              this.locationData = {
                locality: item.locality,
                countryName: item.countryName,
                subAdministrativeArea: item.subAdministrativeArea,
              };
            }
          });
        }
        return data;
      })
      .catch((error: any) => console.log(error));
  }

  radianToDegree(radian: number) {
    return (radian * 180) / Math.PI;
  }

  degreeToRadian(degree: number) {
    return (degree * Math.PI) / 180;
  }
}
