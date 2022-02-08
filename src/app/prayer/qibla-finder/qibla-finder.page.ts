/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';
import {
  DeviceOrientation,
  DeviceOrientationCompassHeading,
} from '@ionic-native/device-orientation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@awesome-cordova-plugins/native-geocoder/ngx';
@Component({
  selector: 'app-qibla-finder',
  templateUrl: './qibla-finder.page.html',
  styleUrls: ['./qibla-finder.page.scss'],
})
export class QiblaFinderPage implements OnInit {
  public data: DeviceOrientationCompassHeading = null;
  subscription: any;
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
    countryName: string;
    subAdministrativeArea: string;
    locality: string;
  };

  constructor(
    private deviceOrientation: DeviceOrientation,
    private nativeGeocoder: NativeGeocoder,
    private nativePluginsService: NativePluginsService
  ) {
    // Watch the device compass heading change
     this.subscription = this.deviceOrientation
      .watchHeading()
      .subscribe((res: DeviceOrientationCompassHeading) => {
        this.data = res;
        // Change qiblaLocation when currentLocation is not empty
        if (!!this.currentLocation) {
          const currentQibla = res.magneticHeading - this.getQiblaPosition();
          this.qiblaLocation =
            currentQibla > 360 ? currentQibla % 360 : currentQibla;
        }
      });
  }

  ngOnInit(): void {
    if (this.nativePluginsService.geolocationData == null) {
      this.getCurrentPosition();
    } else {
      this.currentLocation = {
        longitude: this.nativePluginsService.geolocationData.longitude,
        latitude: this.nativePluginsService.geolocationData.latitude,
      };
      this.getLocationNameByCoordinate();
    }
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
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

  getLocationNameByCoordinate() {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };

    this.nativeGeocoder
      .reverseGeocode(
        this.currentLocation.latitude,
        this.currentLocation.longitude,
        options
      )
      .then((result: NativeGeocoderResult[]) => {
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
      })
      .catch((error: any) => console.log(error));

    this.nativeGeocoder
      .forwardGeocode('Jablanica', options)
      .then((result: NativeGeocoderResult[]) =>
        console.log(
          'The coordinates of Jablanica are latitude=' +
            result[0].latitude +
            ' and longitude=' +
            result[0].longitude
        )
      )
      .catch((error: any) => console.log(error));
  }

  radianToDegree(radian: number) {
    return (radian * 180) / Math.PI;
  }

  degreeToRadian(degree: number) {
    return (degree * Math.PI) / 180;
  }
}

