import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookmarksItem, BookmarksService } from '../bookmarks/bookmarks.service';
import { QuranService } from '../quran.service';
import { TrackerService } from '../tracker/tracker.service';

@Component({
  selector: 'app-quran-template',
  templateUrl: './quran-template.page.html',
  styleUrls: ['./quran-template.page.scss'],
})
export class QuranTemplatePage implements OnInit {
  audio;
  previousAyah;
  suraList;
  suraTitle;
  showSearchHeader = false;
  currentSuraTitle = '';
  constructor(
    public quranService: QuranService,
    public bookmarksService: BookmarksService,
    private route: ActivatedRoute,
    public trackerService: TrackerService,
  ) {}

  ngOnInit(): void {
    this.suraList = this.quranService.suraList;
    this.setCurrentSuraTitle(this.quranService.currentPage);

    if(this.quranService.currentPageForCaching < 604){
      this.cacheAllQuranPages();
      this.quranService.getListOfSura().subscribe();
      this.quranService.getJuzs().subscribe();
    }
  }

  markPage(value){
    if(value.currentTarget.checked){
      this.trackerService.addQuranPageToComplated(+this.quranService.currentPage);
    }
    else {
      this.trackerService.removeQuranPageFromComplated(+this.quranService.currentPage);
    }
  }

  cacheAllQuranPages(){
    for(let i = 0; i<30; i++){
      this.quranService.cacheAllQuranPages();
    }
  }
  ionViewWillLeave() {
    this.stopAudio();
  }

  ionViewWillEnter() {
    const pageFromParams = +this.route.snapshot.paramMap.get('page');
    if (pageFromParams !== 0) {
      this.quranService.currentPage = pageFromParams;
    }
    this.quranService.words = [];
    this.quranService.getSuraWordsByPage(this.quranService.currentPage).subscribe((response) => {
      this.quranService.words = response;
      this.quranService.showLoader = false;
    }, error => {
      this.quranService.showLoader = false;
    });
  }

  onSuraChanged(pageNumber) {
    if (pageNumber < 1) {
      return;
    }
    if (pageNumber > 604) {
      return;
    }
    this.quranService.currentPage = pageNumber;
    localStorage.setItem('currentPage', pageNumber);

    this.quranService.getSuraWordsByPage(pageNumber).subscribe((response) => {
      this.quranService.words = response;
      this.quranService.showLoader = false;
    }, error => {
      this.quranService.showLoader = false;
    });
    this.setCurrentSuraTitle(this.quranService.currentPage);
    this.quranService.currentPageChanged.next(true);
  }

  setSuraTitle(title: string) {
    if (title.indexOf('undefined') > -1) {
      return this.suraTitle;
    } else {
      return (this.suraTitle = title);
    }
  }

  setCurrentSuraTitle(page) {
    if (this.suraList) {
      this.suraList.forEach((sura, index) => {
        if (
          parseInt(page, 10) >= parseInt(sura.startpage, 10) &&
          parseInt(page, 10) <= parseInt(sura.endpage, 10)
        ) {
          this.currentSuraTitle = `${index + 1}. ${sura.tname}`;
        }
      });
    }
  }

  addBookmark(pageNumber){
    const sura = this.quranService.suraList.filter(surah => pageNumber >= surah.startpage && pageNumber <= surah.endpage)[0];
    const item: BookmarksItem = {
      pageNumber: +pageNumber,
      sura,
      date: new Date().toLocaleDateString()
    };
    this.bookmarksService.addBookmark(item);
  }

  deleteBookmark(pageNumber){
    const item: BookmarksItem = {
      pageNumber: +pageNumber,
    };
    this.bookmarksService.deleteBookmark(item);
  }

  //AUDIO
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

    const audio = new Audio(`https://cdn.islamic.network/quran/audio/${this.quranService.qari}/${url.index}.mp3`);
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
      audio.src = `https://cdn.islamic.network/quran/audio/${this.quranService.qari}/${++url.index}.mp3`;;
      self.removeActiveClasses();
      self.manageClassesOfAyats(ayahID, 'add');
      audio.play();
    };
  }

  pauseAudio() {
    this.audio.pause();
  }

  stopAudio() {
    this.pauseAudio();
    this.audio = null;
    const activeWords = document.querySelectorAll('.ayeLine i.active');
    activeWords.forEach(word => {
      word.classList.remove('active');
    });
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
      } // else if (action === 'mouseover') {
      //   aya.classList.add('hover');
      // } else if (action === 'mouseleave') {
      //   aya.classList.remove('hover');
      // }
    });
  }

  removeActiveClasses() {
    const activeAyats = document.querySelectorAll('.ayeLine i');
    activeAyats.forEach((aya) => {
      aya.classList.remove('active');
    });
  }
  //AUDIO END
}
