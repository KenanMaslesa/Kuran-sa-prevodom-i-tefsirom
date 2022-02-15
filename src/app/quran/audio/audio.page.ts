import { Component, OnInit } from '@angular/core';
import { MediaPlayerService } from 'src/app/shared/media-player.service';
import { QuranService } from '../quran.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit {
  suraList;
  qari;
  listOfQari = [
    {
      name: 'Wadee Hammadi Al Yamani',
      value: 'wadee_hammadi_al-yamani'
    },
    {
      name: 'Abdur-Rahman as-Sudais',
      value: 'abdurrahmaan_as-sudays'
    },
    {
      name: 'Ahmed ibn Ali al-Ajmy',
      value: 'ahmed_ibn_3ali_al-3ajamy'
    },
    {
      name: 'Idrees Abkar',
      value: 'idrees_akbar'
    },
    {
      name: 'Nasser Al Qatami',
      value: 'nasser_bin_ali_alqatami'
    },
    {
      name: 'Muhammad al-Luhaidan',
      value: 'muhammad_alhaidan'
    }
  ];
  constructor(
    private quranService: QuranService,
    public mediaPlayerService: MediaPlayerService
  ) {
    const qariFromStorage = localStorage.getItem('audioQuranQari');
    if(qariFromStorage){
      this.qari = qariFromStorage;
    }
    else {
      this.qari = 'idrees_akbar';
    }
  }

  ngOnInit() {
    this.getSuraList();
  }

  changeQari(qari){
    localStorage.setItem('audioQuranQari', qari);
  }

  getSuraList() {
    this.quranService.getListOfSura().subscribe((response) => {
      this.suraList = response;
    });
  }
  playSura(index = 1) {
    const numberIndex = +index;
    let stringIndex;
    if(numberIndex < 10){
      stringIndex = '00'+numberIndex.toString();
    }
    else if(numberIndex > 10 && numberIndex <100){
      stringIndex = '0'+numberIndex.toString();
    }
    else {
      stringIndex = numberIndex.toString();
    }
    this.mediaPlayerService.playAudio(`https://download.quranicaudio.com/quran/${this.qari}/${stringIndex}.mp3`);
  }
}
