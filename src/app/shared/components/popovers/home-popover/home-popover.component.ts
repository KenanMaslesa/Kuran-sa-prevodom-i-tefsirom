import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';

@Component({
  selector: 'app-home-popover',
  templateUrl: './home-popover.component.html',
  styleUrls: ['./home-popover.component.scss'],
})
export class HomePopoverComponent implements OnInit {
  constructor(
    public nativePluginsService: NativePluginsService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {}

  goToUrl(url) {
    this.router.navigateByUrl(`${url}`, {
      replaceUrl: true,
    });
    this.popoverCtrl.dismiss();
  }
}
