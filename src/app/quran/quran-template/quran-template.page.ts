import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-quran-template',
  templateUrl: './quran-template.page.html',
  styleUrls: ['./quran-template.page.scss'],
})
export class QuranTemplatePage implements OnInit {
  @ViewChild('slides', { static: true }) slides: IonSlides;
  sura;
  suraTitle = '';
  audio;
  previousAyah;
  suraList;
  showSearchHeader = false;
  currentSuraTitle = '';
  slideOpts = {
    initialSlide: 1,
    speed: 50,
    loop: true,
  };
  constructor(
    public quranService: QuranService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const pageFromParams = +this.route.snapshot.paramMap.get('page');
    if (pageFromParams !== 0) {
      this.quranService.currentPage = pageFromParams;
    }
    this.quranService.getSuraWordsByPage(this.quranService.currentPage);
    this.getSuraList();
  }

  cacheAllQuranPages() {
    let i = 1;
    const self = this;
    const repeater = setInterval(() => {
      if (i > 604) {
        clearInterval(repeater);
      }
      self.quranService.cacheAllQuranPages(i);
      i += 1;
    }, 5000); //repeat every 5s
  }

  onSuraChanged(pageNumber) {
    if (pageNumber === 1) {
      this.slides.lockSwipeToPrev(true);
    } else {
      this.slides.lockSwipeToPrev(false);
    }

    if (pageNumber === 604) {
      this.slides.lockSwipeToNext(true);
    } else {
      this.slides.lockSwipeToNext(false);
    }
    this.quranService.currentPage = pageNumber;
    localStorage.setItem('currentPage', pageNumber);

    this.quranService.getSuraWordsByPage(pageNumber).subscribe((response) => {
      this.quranService.words = response;
      this.quranService.showLoader = false;
    }, error => {
      this.quranService.showLoader = false;
      this.router.navigate(['/quran/tabs/translation']);
    });
    this.setCurrentSuraTitle(this.quranService.currentPage);
    this.quranService.currentPageChanged.next(true);
  }

  getSuraList() {
    this.quranService.getListOfSura().subscribe((response) => {
      this.suraList = response;
      this.setCurrentSuraTitle(this.quranService.currentPage);
    });
  }

  setSuraTitle(title: string) {
    if (title.indexOf('undefined') > -1) {
      return this.suraTitle;
    } else {
      return (this.suraTitle = title);
    }
  }

  slideTo(slideNumber) {
    this.slides.slideTo(slideNumber);
  }

  playWord(url) {
    let audioUrl = 'https://dl.salamquran.com/wbw/';
    audioUrl += url;
    const audio = new Audio(audioUrl);
    audio.play();
  }

  playAyat(url, ayah, ayahID) {
    if (this.audio) {
      if (!this.audio.paused) {
        this.audio.pause();
        this.manageClassesOfAyats(this.previousAyah, 'remove');
      }
    }
    const audio = new Audio(this.quranService.changeQariUrl(url.audio));
    this.audio = audio;
    this.previousAyah = ayah;
    this.removeActiveClasses();
    ayahID = ayahID.replace('-' + '.*', '-' + ayah);
    this.manageClassesOfAyats(ayahID, 'add');
    audio.play();

    const self = this;
    audio.onended = () => {
      self.manageClassesOfAyats(ayahID, 'remove');
      ayah = Number(ayah) + 1;
      ayahID = ayahID.substring(0, ayahID.indexOf('-'));
      ayahID = ayahID + '-' + ayah;
      audio.src = self.getAudioOfAyah(ayahID);
      self.removeActiveClasses();
      self.manageClassesOfAyats(ayahID, 'add');
      audio.play();
    };
  }

  pauseAudio() {
    this.audio.pause();
  }

  resumeAudio() {
    this.audio.play();
  }

  manageClassesOfAyats(ayaId, action) {
    ayaId = ayaId.replace(':', '-');
    const activeAyats = document.querySelectorAll('.aya' + ayaId);
    activeAyats.forEach((aya) => {
      if (action === 'add') {
        aya.classList.add('active');
      } else if (action === 'remove') {
        aya.classList.remove('active');
      } else if (action === 'mouseover') {
        aya.classList.add('hover');
      } else if (action === 'mouseleave') {
        aya.classList.remove('hover');
      }
    });
  }

  removeActiveClasses() {
    const activeAyats = document.querySelectorAll('.ayeLine i');
    activeAyats.forEach((aya) => {
      aya.classList.remove('active');
    });
  }

  getAudioOfAyah(v) {
    let url = '';
    const verse = v.replace('-', ':');
    this.quranService.words.result.forEach((ayah) => {
      if (ayah.word) {
        ayah.word.forEach((element) => {
          if (element.verse_key === verse) {
            url = element.audio;
          }
        });
      }
    });
    return this.quranService.changeQariUrl(url);
  }

  onQariChanged(value) {
    this.quranService.qari = value;
  }

  setCurrentSuraTitle(page) {
    if (this.suraList) {
      this.suraList.forEach((sura, index) => {
        if (
          parseInt(page, 10) >= parseInt(sura.startpage, 10) &&
          parseInt(page, 10) <= parseInt(sura.endpage, 10)
        ) {
          this.currentSuraTitle = `${index + 1}. ${sura.name} - ${sura.tname}`;
        }
      });
    }
  }
}
