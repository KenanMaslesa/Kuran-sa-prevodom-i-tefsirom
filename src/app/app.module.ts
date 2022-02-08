/* eslint-disable no-underscore-dangle */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Drivers } from '@ionic/storage';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB]
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    LocalNotifications,
    NativeGeocoder,
    DeviceOrientation,
    Vibration
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
