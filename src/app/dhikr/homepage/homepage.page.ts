import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {
  cards = [
    {
      title: 'Jutarnji zikr',
      url: '/dhikr/morning-dhikr',
      icon: 'sunny-outline',
    },
    {
      title: 'Večernji zikr',
      url: '/dhikr/evening-dhikr',
      icon: 'moon-outline',
    },
    {
      title: 'Zikr prije spavanja',
      url: '/dhikr/dhikr-before-sleeping',
      icon: 'bed-outline',
    },
    {
      title: 'Zikrilo',
      url: '/dhikr/tasbeeh',
      icon: 'finger-print-outline',
    },
    {
      title: 'Postavke',
      url: '/dhikr/settings',
      icon: 'settings-outline',
    },
  ];

  ayahs = [
    {
      ayah: '“Sjećajte se vi Mene, i Ja ću se vas sjetiti, i zahvaljujte Mi, i na blagodatima Mojim nezahvalni nemojte biti."',
      source: '(El-Bekara, 152)'
    },
    {
      ayah: '“Pa hvaljen neka je Allah, kad god omrknete i kad god osvanete.”',
      source: '(Rum, 17)'
    },
    {
      ayah: '“I veličaj Gospodara svoga  i zahvaljuj Mu prije sunčeva izlaska i prije zalaska.”',
      source: '(Kaf, 39)'
    },
    {
      ayah: '„O vi koji vjerujete, Allaha mnogo spominjite“',
      source: '(El-Ahzab, 41)'
    },
    {
      ayah: '„I muškarcima koji mnogo spominju Allaha i ženama koje mnogo spominju Allaha, Allah je, doista, za sve njih oprost i veliku nagradu pripremio“',
      source: '(El-Ahzab, 35)'
    },
    {
      ayah: '“O, vjernici, neka vas imanja vaša i djeca vaša ne zabave od sjećanja na Allaha. Oni koji to dopuste, bit će izgubljeni.”',
      source: '(El-Munafikun, 9)'
    },
    {
      ayah: '“O vjernici, često Allaha spominjite i hvalite i ujutro i naveče ga veličajte.”',
      source: '(Ahzab, 41)'
    },
    {
      ayah: '“I spominji Gospodara svoga ujutro i naveče u sebi, ponizno i sa strahopoštovanjem i ne podižući jako glas, i ne budi nemaran.”',
      source: '(El-Araf, 205)'
    },
    {
      ayah: '„A kad se molitva obavi, onda se po zemlji raziđite i Allahovu blagodat tražite i Allaha mnogo spominjite, da biste postigli što želite.“',
      source: '(El- Džumu’a, 10)'
    },
    {
      ayah: '„One koji vjeruju i čija se srca, kad se Allah spomene, smiruju – a srca se doista, kad se Allah spomene smiruju!”',
      source: '(Er- Ra’ad, 28)'
    }
  ];
  randomAyah: {ayah: string; source: string};
  appUrl = 'https://play.google.com/store/apps/details?id=com.keno.zikr';

  constructor(private socialSharing: SocialSharing) {}

  ngOnInit() {
    this.randomAyah = this.ayahs[this.randomNum()];
  }
  ionViewWillEnter() {
    this.randomAyah = this.ayahs[this.randomNum()];
  }

  randomNum() {
    return Math.floor(Math.random() * (this.ayahs.length - 0)) + 0; // You can remove the Math.floor if you don't want it to be an integer
  }

  shareApp() {
    this.socialSharing.share('','','',this.appUrl);
  }
}
