import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonInfiniteScroll, IonSlides, PopoverController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QuranPopoverComponent } from 'src/app/shared/components/popovers/quran-popover/quran-popover.component';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { NativePluginsService } from 'src/app/shared/native-plugins.service';
import { PlatformService } from 'src/app/shared/platform.service';
import { StorageService } from 'src/app/shared/storage.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Juz, Sura, TafsirAyah } from '../quran.models';
import { QuranService } from '../quran.service';
import { SettingsService } from '../settings/settings.service';
@Component({
  selector: 'app-translation',
  templateUrl: './translation.page.html',
  styleUrls: ['./translation.page.scss'],
})
export class TranslationPage implements AfterViewInit {
  @ViewChild(IonContent) ionContent: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSlides) slides: IonSlides;

  dataStream$: Observable<any>;
  subs: Subscription = new Subscription();
  loadMoreIndex = 0;
  ayahList = [];
  ayahListLazyLoaded = [];
  numberOfLoadedPagesOnSlide = 1;
  sura$: Observable<Sura[]>;
  juz$: Observable<Juz>;
  showLoader = false;
  routePageId: number;
  routeAyahIndex: number;
  sliderActiveIndex: number;
  isCurrentPageInBookmarks = false;
  moreInfoAboutSura = false;
  slideOpts = {
    loop: true,
    initialSlide: 1,
  };
  surahsPurposes = [
    'Obraćanje i usmjeravanje ka Allahu kroz obožavanje jedino Njega.',
    'Pripremanje umeta za uspostavu života na Zemlji i uspostavljanje Allahove vjere, zatim pojašnjenje vrsta i kategorija ljudi. U ovoj suri su objašnjeni temelji imana i opći principi šerijata.',
    'Ustrajnost na islamu nakon njegovog upotpunjenja i objašnjenja, i odgovor na sumnje sljedbenika Knjige, posebno kršćana.',
    'Uređenje muslimanskog društva iznutra kroz čuvanje socijalno-ekonomskih prava, i uklanjanje ostataka paganizma, koncetrišući se na prava žena i slabih.',
    'Poštovanje ugovora, pridržavanje zakona i upotpunjenje vjere.',
    'U ovoj se suri nalazi potvrda monoteizma uz razumske dokaze i pobijanje višebožačkih uvjerenja.',
    'Objašnjenje zakona borbe između vjere i nevjere i konačnica te borbe kroz navođenje događaja između vjerovjesnika i njihovih naroda.',
    'Objašnjavanje propisa borbe i uzroka pobjede i poraza kroz kazivanje o bici na Bedru.',
    'Ova sura otkriva stanje raznih kategorija ljudi i govori o odnosu spram njih, pa govori o odnosu prema nevjernicima, razotkriva dvoličanjake i karakterizira vjernike.',
    'Suprotstavljanje onima koji poriču Objavu, putem dokaza i argumeneta i pozivanje u vjerovanje metodom poticanja i zastrašivanja.',
    'Pojašnjenje metodologije poslanika spram njihovih naroda koji su poricali istinu.',
    'Allahovo obećanje da će dati vlast na Zemlji nakon jasnog iskušenja, što je ustvari učvršćivanje i obećanje Muhammedu, sallallahu \'alejhi ve sellem, i vjernicima.',
    'Objašnjenje suštine božanske snage i moći i vidova njene manifestacije, potvrda obećanja i prijetnje i objašnjenje Allahovih zakona u konstantnom mijenjanju i promjeni.',
    'Ova sura govori o ulozi Allahovih poslanika i njihovom nastojanju da ljude izvedu iz tmina višeboštva na svjetlo monoteizma, iako su im se njihovi narodi suprotstavljali, kako bi srce Muhammeda, sallallahu \'alejhi ve sellem, ostalo čvrsto i postojano, i kako bi dodatno zaprijetio nepravednicima.',
    'Predočavajući prizore stradanja nekih ljudi, ova sura upozorava poricatelje na kaznu koja ih čeka, te donosi radosne vijesti onima koji vjeruju.',
    'Podsjeća na blagodati, koje, opet, upućuju na Onog Koji ih je dao. One nas obavezuju na poslušnost Allahu i upozoravaju na opasnost njihovog negiranja.',
    'Ova sura govori o savršenstvu poslanstva Muhammedova, sallallahu alejhi ve sellem. Ona sadrži radosne vijesti koje su se već dogodile i one koje će se dogoditi.',
    'Ova sura sadrži uputstva kako se treba ponašati u smutnjama i navodi primjere s tim u vezi.',
    'Ova sura sadrži pokazatelje Allahove milosti prema iskrenim robovima, evlijama, te pokazatelje davanja blagodati, kao što je npr. blagodat djeteta. U njoj je Gospodar objasnio da je daleko od toga da ima dijete i pomagače. Time je pobio mišljenje onih koji to Gospodaru pripisuju.',
    'Ova je sura podrška Vjerovjesniku, sallallahu alejhi ve sellem, da bude strpljiv u dostavljanju poslanice.',
    'Ova sura govori o tome da su svi poslanici imali jedan cilj, a to je pozivanje u Allahovu jednoću.',
    'Ova sura govori o Allahovoj veličini i tome da On sve može učiniti, iz čega slijedi da ga ljudi veličaju i Njemu se povinuju.',
    'Ova se sura bavi suštinom vjerovanja, njegovim plodovima i posljedicama njegova neprihvatanja, kao što se u njoj kude oni koji ne vjeruju. Zbog toga se na samom njenom početku nalazi obavijest da će vjernici uspjeti, iz čega proizlazi da će krivovjerni nastradati.',
    'U ovoj se suri naglašava se važnost kreposti, sakrivanja tuđih mahana, čistote muslimanskog društva i njegova čuvanja od svega što vodi u razvrat. Ona se bavi i spletkama koje kuju dvoličnjaci kako bi širili poroke.',
    'U ovoj se suri govori o tome da će, uprkos napadima višebožaca, Poslanik, sallallahu alejhi ve sellem, biti pobjednik.',
    'U ovoj se suri pobijaju oni koji su ustrajni u poricanju Poslanika, sallallahu alejhi ve sellem, i u napadanju na njega kao poslanika, kao što se u njoj stavlja na znanje da su oni beznačajni.',
    'U ovoj suri govori se o najvećoj blagodati (Časnom Kur’anu) koja je ukazana Vjerovjesniku, sallallahu alejhi ve sellem, o neophodnosti zahvaljivanja na njoj i strpljivosti prilikom dostavljanja Objave ljudima.',
    'U ovoj suri govori se o tome šta je mjerodavna snaga, i to kroz isticanje Allahove moći da ukaže pomoć potlačenima, a uništi ohole silnike, što je ujedno i Božiji zakon u svemiru.',
    'Ova sura govori o postojanosti u vjeri i trpeljivom podnošenju iskušenja tokom smutnji, te govori o rezultatima toga.',
    'Ova sura govori o velikoj kosmičkoj istini, a to je da svime što postoji i svim događajima samo Allah upravlja, upravo kao što je rekao: “... samo Allahu pripada odluka i prije i poslije...”',
    'U ovoj se suri ističe mudrost, koja je u skladu sa šerijatom, te se Lukman navodi kao primjer te mudrosti.',
    'Ova sura sadrži neke znakove koji ukazuju na istinu. Jedan od tih znakova jest stvaranje čovjeka i stanja kroz koja prolazi.',
    'U ovoj se suri govori o velikoj Allahovoj pažnji i čuvanju Poslanika islama i njegove porodice.',
    'U ovoj se suri govori o Allahovoj moći kroz promjenu prilika, kao i o prilikama kroz koje prolaze zahvalni i nezahvalni ljudi.',
    'Ova se sura bavi predivnim Allahovim stvaranjem, koje ukazuje na Njegovu moć. U njoj se govori i o onom što potiče čovjeka na veličanje Uzvišenog Allaha, strahopoštovanje prema Njemu i iskreno vjerovanje u Njega. Ona podsjeća i na Njegove blagodati.',
    'Ova se sura bavi dokazivanjem oživljenja na Sudnjem danu i dokazivanjem poslanice.',
    'U ovoj se suri negira ono što mnogobošci pripisuju Allahu i pobija njihovo vjerovanje glede meleka i džina.',
    'Ova sura govori o branjenju istine i posljedicama toga.',
    'Ova sura sadrži poziv u tevhid i iskreno obožavanje Allaha, te odbacivanje širka. Također govori i o ahiretskim posljedicama tog dvoga.',
    'Ova se sura bavi onima koji raspravljaju u Allahovim ajetima, njima se obraća i poziva ih da se vrate istini.',
    'Ova sura upućuje na to kako se treba odnositi prema onima koji okreću leđa Objavi, govori o tome da je časna Knjiga istina i bavi se posljedicama otuđivanja od Boga.',
    'Sura pojašnjava stvarnost i suštinu poslanice Muhammeda, sallallahu alejhi ve sellem, kao i to da je ona samo nastavak Objave koja je dolazila ranijim vjerovjesnicima.',
    'Pojašnjavanje ispravnih kur\'anskih principa i pobijanje lažnih džahilijetskih predodžbi i zaključaka.',
    'Upozorenje na dolazeću kaznu kroz zastrašivanje njenih poricatelja kaznom i na ovome i na onome svijetu.',
    'Razmatranje problema onih oholnika koji slijede prohtjeve i odbijaju istinu kroz navođenje ajeta i znamenja i podsjećanje na onaj svijet.',
    'U ovoj se suri govori o uspostavljanju dokaza protiv poricatelja. U njoj se oni nekoliko puta opominju na kaznu. ',
    'Ova sura potiče vjernike na borbu i osnažuje ih, a slabi one koji ne vjeruju.',
    'Ova sura sadrži Božije obećanje da će dati pobjedu i vlast Svom Poslaniku, sallallahu alejhi ve sellem, kao i iskrenim vjernicima koji se bore za vjeru.',
    'U ovoj se suri govori o tome kako se muslimansko društvo treba ponašati i od kakvog se ponašanja treba sustezati.',
    'Pomoću ove sure Gospodar budi nemarna srca i potiče ih da spoznaju suštinu sadržajnih dokaza o proživljenju na Ahiretu i poglanju računa.',
    'Allah u ovoj suri stavlja ljudima na znanje da On daje nafaku, da bi kod Njega našli utočište i robovali Mu.',
    'Otklanjanje sumnji i nejasnoća koje su imali poricatelji istine, kroz navođenje jasnih dokaza i argumenata, kako bi ih prihvatili i pokorili se.',
    'Ukazivanje na istinitost Objave i uzvišenost njenog izvora, kao vid potvrđivanja tevhida (jednoće Allaha) i negiranja širka.',
    'Podsjećanje ajetima i upozorenjima, pojašnjavanje kakva konačnica čeka poricatelja, i upravo zbog toga ponavljaju se riječi u kojima Allah Uzvišeni kaže: \'A Mi smo Kur’an olakšali kao opomenu, pa ima li koga ko bi se prisjetio?\'',
    'Kazivanje o Allahovim vidljivim blagodatima, i tragovima Njegove milosti koja se ispoljava i na ovome i na onome svijetu, s ciljem da se vjernicima omili vjerovanje, i da se upozori na opasnost negiranja i poricanja.',
    'Zastrašivanje Sudnjim danom, potvrđivanje njegova dešavanja i pojašnjavanje vrsta ljudi spram tog Dana, te kazne ili nagrade svake od tih kategorija.',
    'Sticanje snage, imanske i materijalne, koja je potrebna za pozivanje Allahu i borbu na Njegovom putu, te čišćenje duše od svih negativnosti i svega onoga što čovjeka odvraća od dobra, što se vidi kroz učestalo spominjanje udjeljivanja imetka i vjerovanja.',
    'Ukazivanje na poptuno i sveobuhvatno Allahovo znanje, kako bi ljudi bili svjesni da ih On nadgleda i kako bi se upozorili svi oni koji Mu se suprotstavljaju.',
    'Ispoljavanje Allahove moći i snage koja se ogleda u ponižavanju i slabljenju Jevreja i licemjera, ukazivanje na njihovu razjedinjenost nasuprot muslimanskog jedinstva.',
    'Čišćenje vjerničkih srca od prijateljevanja i ljubavi prema drugim vjerama mimo Allahove.',
    'Stimulisanje vjernika na pomaganje Allahove vjere i borbu na Njegovom putu.',
    'Pojašnjavanje Allahove blagodati ovom ummetu kojeg je posebno odlikovao uputom i slanjem Poslanika, sallallahu alejhi ve sellem, nakon što je bio u zabludi, zaduživanje pokornošću njemu i upozorenje na opasnost poistovjećivanja sa Jevrejima.',
    'Otkrivanje svojstava licemjera i pojašnjavanje njihovog stava naspram islama i muslimana, te upozorenje na opasnost poistovjećivanja s njima.',
    'Spominjanje samoobmane nevjernika i njihove propasti na Sudnjem danu, kao vid upozorenja na nevjerstvo i nevjernike.',
    'Davanje važnosti pitanjima razvoda braka i njegovim odredbama, te pojašnjenje konačnice onih koji se Allaha boje i onih koji Njegove granice prelaze.',
    'Odgajanje vjerovjesničke kuće, kako bi porodica i društvo imali uzor u njoj.',
    'Ukazivanje na savršenost Allahove vlasti moći, s ciljem podsticanja na strah od Njega i čuvanja od Njegove kazne.',
    'Ukazivanje na Poslanikovo, sallallahu alejhi ve sellem, znanje i njegovo lijepo ponašanje, kao vid podrške nakon što su ga mušrici napali.',
    'Potvrđivanje tačnosti dolaska Sudnjeg dana, kao vid potvrde istinitosti Kur\'ana, kako bi se vjernici radovali, a negatori istine opomenuli kaznom i propašću.',
    'Potvrda da će se dogoditi kazna nad nevjernicima i da će iskreni vjernici na Sudnjem danu imati blagodati i uživati.',
    'Strpljivost islamskih misionara i njihova borba i trud na polju širenja pozitivnih vrijednosti, što se zaključuje iz kazivanja o Nuhu, kako bi se vjernici učvrstili, a poricatelji opomenuli.',
    'Potvrda objavljivanja Kur\'ana, kao i toga da je on od Allaha, kroz kazivanje o vjerovanju džinna u njega, te poništavanje tvrdnji mušrika vezanih za njih.',
    'Spominjanje duševne ospkrbe za islamske misionare (daije) potrebne za suočavanje sa životnim nevoljama, kao vid učvršćivanja Poslanika, sallallahu alejhi ve sellem, i opomene onima koji ga poriču.',
    'Naredba da se bude aktivan i da se aktivira radi pozivanja u islam i opomena onim koji je poriču.',
    'Ispoljavanje Allahove moći da stvori i oživi sva stvorenja.',
    'Podsjećanje čovjeka na njegovu osnovu, mudrost stvaranja i krajnji povratak i mjesto, te ispoljavanje džennetskih blagodati, kako bi se vjernici učvrstili, a nevjernici pozvali.',
    'Potvrđivanje istinitosti Sudnjeg dana kroz iznošenje dokaza onima koji poriču, a nakon toga kroz prijetnje i upozorenja.',
    'Potvrđivanje istinitosti proživljenje nakon smrti, kao i nagrade i kazne, kroz jasne dokaze i argumente.',
    'Zastrašivanje i pokretanje srca koja poriču proživljenje, nagradu i kaznu, kroz spominjanje događaja poput smrti, proživljenja, okupljanja, i Sudnjeg dana.',
    'Suština kur\'anskog poziva, počast onome ko se njime koristi i poniženje onome ko se od njega okrene.',
    'Slikoviti opis Smaka svijeta, kada će se kosmos raspasti i labav postati, nakon što je bio precizno uređen.',
    'Prikaz Sudnjeg dana kada će precizno uređena stvorenja postati po svuda raspršena, kada će njihovo stanje i kretanje biti promijenjeno.',
    'Sura se usmjerava na pojašnjenje stanja ljudi po pitanju mjerenja, ahiretskih položaja, prijeteći onima koji na vagi zakidaju i koji poriču i smirujući osjećaje vjernika i slabih.',
    'Prikaz dešavanja Smaka svijeta, kroz potčinjenost kosmosa naredbama Gospodara, iz čega proističe obaveznost pokoravanja i pogubnost odbijanja pokornosti.',
    'Ispoljavanje Allahove snage i Njegove sveobuhvatne moći, kao i Njegove prijetnje strašnom kaznom onima koji vjernicima ne žele dobro i uznemiravaju ih.',
    'Iskazivanje činjenice da Allahu ništa ne promiče, kao i ukazivanje na Njegovu apsolutnu moć.',
    'Podsjećanje ljudi da blagodati Uzvišenog Allaha prema njima, podsticanje da se vežu za onaj svijet i da se riješe ovisnosti o dunjaluku.',
    'Podsjećanje ljudi na božansku moć, kako u davanju blagodati, tako i u kažnjavanju, kroz prisutne dokaze i znakove, kako bi se ljudska srca ispunila željom za nagradom, i strahom od kazne.',
    'Prikaz stanja u kojima se ogleda Allahova moć u kosmosu kao i u samom čovjeku, te pojašnjenje konačnice onih koji su obmanuti.',
    'Spominjanje stanja čovjeka na oba svijeta, bilo da je vezano za nevjerovanje i kažnjavanje, ili za vjerovanje i postizanje velikih položaja i milosti.',
    'Sura usmjerava pažnju ka Allahovovim znamenjima u kosmosu, a i u nama samima, te na stanja ljudskih duša, kako bi se one očistile i od grijeha udaljile.',
    'Pojašenje razlike između znamenja, ljudi i njihovih postupaka, kako bi se ispoljila razlika između vjernika i nevjernika.',
    'U ovoj suri spominje se pažnja Allahova prema Poslaniku, sallallahu alejhi ve sellem, Njegova blagodat prema njemu u vidu Objave, te trajnost te blagodati, s ciljem da se udovolji njegovim osjećajima i da se vjernici podsjete na zahvalnost.',
    'Spominjanje potpune Allahove blagodati prema Njegovom Poslaniku, sallallahu alejhi ve sellem, koja se ogleda u uklanjanju brige i poteškoće od njega, kao i onoga što do toga dovodi.',
    'Spominjanje vrijednosti čovjeka koji je u vjeri, kao i njegove bezvrijednosti kada tu vjeru izgubi. Zbog toga se Allah kune mjestima spuštanja Objave.',
    'Pojašnjenje da čovjek biva potpun putem znanja i Objave koja ga vezuju s njegovim Gospodarom i čini ga Njemu poniznim, a da, suprotstavljajući se tome, umanjuje svoju vrijednost.',
    'Pojašnjavanje vrijednosti noći Kadr, njene veličanstvenosti kao i onoga što je u njoj spušteno.',
    'Ukazivanje na položaj poslanice Muhammeda, sallallahu alejhi ve sellem, na njenu jasnoću i potpunost.',
    'Buđenje nemarnih srca s ciljem da povjeruju u obračun i precizno svođenje računa na Sudnjem danu.',
    'Pojašnjenje osobina čovjeka u pogledu njegove brige za dunjalukom, kao vid podsjećanja na povratak i način da popravi svoje stanje i pravac kojim ide.',
    'Buđenje srca kroz prikaz strahota Smaka svijeta.',
    'Podsjećanje na smrt i obračun onih koji su zauzeti dunjalukom.',
    'Pojašnjenje šta je to stvarna dobit i propast u životu i napomena na važnost vremena kojeg čovjek provodi.',
    'Prijetnja onima koji se uzdižu i ismijavaju sa vjerom i vjernicima.',
    'Iskazivanje Allahove moći da štiti svoj sveti hram, kao vid opomene i blagodati.',
    'Blagodat darovana Kurejšijama i obaveze naspram toga.',
    'Pojašnjenje ponašanja onih koji poriču Sudnji dan, kao vid upozorenja vjernicima i sramoćenja nevjernika.',
    'Blagodat Allaha prema Poslaniku, sallallahu alejhi ve sellem, i prekidanje svih puteva onima koji ga mrze.',
    'Potvrđivanje tevhida i vjerovanja da se samo Allahu čini ibadet, negiranje širka i potpuno odvajanja islama od širka.',
    'Ukazivanje na krajnji rezultat islama, koji će biti pomoć i pobjeda, kao i na to šta je propisano kada se desi pobjeda islama. Također, sura ukazuje i na blizinu odlaska Poslanika, sallallahu alejhi ve sellem, s ovoga svijeta.',
    'Porijeklo i položaj ne koriste, ako je čovjek nevjernik u Allaha.',
    'Potvrđivanje da je Allah jedinstven u svome savršenstvu, božanstvenosti i čistoći od mahana',
    'Traženje zaštite kod Allaha od vidljivog zla.',
    'Zaštita kod Allaha od zla šejtana i njegovih došaptavanja i od skrivenog zla.'
  ];
  showGoToPageButton = false;
  constructor(
    private route: ActivatedRoute,
    public quranService: QuranService,
    public bookmarkService: BookmarksService,
    public mediaPlayerService: MediaPlayerService,
    public storage: StorageService,
    private nativePluginsService: NativePluginsService,
    public platformService: PlatformService,
    public settingsService: SettingsService,
    private popoverCtrl: PopoverController
  ) {
    this.routeAyahIndex = +this.route.snapshot.params.ayah;
    this.routePageId = +this.route.snapshot.params.page;
    if (this.routePageId) {
      this.quranService.setCurrentPage(this.routePageId - 1);
    }

    //scroll into playing ayah
    this.subs.add(
      this.mediaPlayerService.scrollIntoPlayingAyah.subscribe(
        (activeAyahId) => {
          this.scroll(activeAyahId);
        }
      )
    );

  //page is changed
   this.subs.add(
    this.quranService.currentPageChanged.subscribe(() => {
      this.ayahList = [];
      this.setStream();

      this.slides.slideTo(1, 50, false).then(()=> {
        this.showGoToPageButton = false;
      });
    })
  );
  }
  ngAfterViewInit(): void {
    if (this.routeAyahIndex) {
      setTimeout(() => {
        this.quranService.showLoader = true;
      }, 200);
      setTimeout(() => {
        this.scroll(this.routeAyahIndex);
      this.quranService.showLoader = false;
      }, 1000);
    }
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
    this.quranService.showHeaderAndTabs = true;
  }

  ionViewWillEnter() {
    this.quranService.showLoader = false;
    this.setStream();
  }

  ionViewDidEnter() {
    if(this.mediaPlayerService.player) {
        setTimeout(() => {
        this.scroll(this.mediaPlayerService.playingCurrentAyah);
      }, 500);
      }
  }

  getSuraByPageNumber(page) {
    this.sura$ = this.quranService.getSuraByPageNumber(page);
  }
  getJuzByPageNumber(page) {
    this.juz$ = this.quranService.getJuzByPageNumber(page);
  }

  slideTo(page) {
    this.slides.slideTo(page);
    this.showLoader = false;
  }

  scroll(id) {
    const ayah = document.getElementById(id);
    if (ayah) {
      ayah.scrollIntoView({
        behavior: 'smooth',
      });
    } else {
      console.log('Nema ajeta sa ID: ' + id);
    }
  }

  loadNext() {
    if (this.quranService.currentPage !== 1) {
      this.slides.lockSwipeToPrev(false);
    }
    this.ayahList = [];
    this.quranService.setCurrentPage(this.quranService.currentPage + 1);
    this.setStream();
    this.slides.slideTo(1, 50, false);
  }

  loadPrev() {
    if (this.quranService.currentPage === 1) {
      this.slides.lockSwipeToPrev(true);
    }

    this.ayahList = [];
    this.quranService.setCurrentPage(this.quranService.currentPage - 1);
    this.setStream();

    this.slides.slideTo(1, 50, false);
  }

  setStream() {
    this.getSuraByPageNumber(this.quranService.currentPage);
    this.getJuzByPageNumber(this.quranService.currentPage);

    this.ayahList = [];
    this.dataStream$ = this.quranService
      .getTafsirAndTranslationForPage(this.quranService.currentPage)
      .pipe(
        tap((response) => {
          this.ayahList.push(response);
        })
      );
  }

  playAyah(ayahIndex) {
    this.mediaPlayerService.playAudio(
      ayahIndex,
    );
  }

  loadMorePages() {
    let counter = 0;
    for (
      let i = this.loadMoreIndex * this.numberOfLoadedPagesOnSlide;
      i < this.ayahList.length;
      i++
    ) {
      this.ayahListLazyLoaded.push(this.ayahList[i]);
      counter++;

      if (counter >= this.numberOfLoadedPagesOnSlide) {
        this.loadMoreIndex++;
        return;
      }
    }
  }

  displayCityBySuraType(type) {
    if (type === 'Meccan') {
      return 'Mekki';
    } else if (type === 'Medinan') {
      return 'Medini';
    }
  }

  checkIsPageInBookmarks() {
    return this.bookmarkService.checkIsInTafsirBookmark(
      this.quranService.currentPage
    );
  }

  addTafsirBookmark(sura: Sura[]) {
    let bookmarkSuraName = '';
    const names = sura.map(
      (item) => item.name.arabic && item.name.bosnianTranscription
    );
    names.forEach((name, index) => {
      if (index + 1 < names.length) {
        bookmarkSuraName += name + ', ';
      } else {
        bookmarkSuraName += name;
      }
    });
    this.bookmarkService.addTafsirBookmark({
      sura: bookmarkSuraName,
      pageNumber: this.quranService.currentPage,
      date: new Date(),
    });
  }

  deleteTafsirBookmark() {
    this.bookmarkService.deleteTafsirBookmark(this.quranService.currentPage);
  }

  shareAyah(suraTitle: any, ayah: TafsirAyah) {
    this.nativePluginsService.shareAyah(suraTitle.bosnianTranscription, ayah);
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: QuranPopoverComponent,
      event,
    });
    await popover.present();
  }
}
