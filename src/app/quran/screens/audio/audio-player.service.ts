import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { Sura } from '../../shared/quran.models';
import { QuranService } from '../../shared/services/quran.service';

export enum PlayerRepeatOptions {
  repeat = 'REPEAT',
  order = 'ORDER',
}
@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  player: Howl = null;
  isPlaying = false;
  currentTime = 0;
  watchCurrentTimeInterval;
  isPaused = false;
  selectedSuraIndex = 1;
  isPlayerMinimized = true;
  audioUrl: string;
  qari: string;
  selectedRepeatOption = PlayerRepeatOptions.order;
  listOfQari = [
    {
      name: 'Abdur-Rahman as-Sudais',
      value: 'abdurrahmaan_as-sudays',
    },
    {
      name: 'Ahmed ibn Ali al-Ajmy',
      value: 'ahmed_ibn_3ali_al-3ajamy',
    },
    {
      name: 'Abdullah Awad al-Juhani',
      value: 'abdullaah_3awwaad_al-juhaynee',
    },
    {
      name: 'Abdullah Basfar',
      value: 'abdullaah_basfar',
    },
    {
      name: 'Ali Abdur-Rahman al-Huthaify',
      value: 'huthayfi',
    },
    {
      name: 'AbdulMuhsin al-Qasim',
      value: 'abdul_muhsin_alqasim',
    },
    {
      name: 'AbdulBari ath-Thubaity',
      value: 'thubaity',
    },
    {
      name: 'AbdulAzeez al-Ahmad',
      value: 'abdulazeez_al-ahmad',
    },
    {
      name: 'AbdulBaset AbdulSamad [Murattal]',
      value: 'abdul_basit_murattal',
    },
    {
      name: 'AbdulWadud Haneef',
      value: 'abdulwadood_haneef',
    },
    {
      name: 'Aziz Alili',
      value: 'aziz_alili',
    },
    {
      name: 'AbdulBaset AbdulSamad [Mujawwad]',
      value: 'abdulbaset_mujawwad',
    },
    {
      name: 'Al-Hussayni Al-Azazy (with Children)',
      value: 'alhusaynee_al3azazee_with_children',
    },
    {
      name: 'Abdur-Razaq bin Abtan al-Dulaimi [Mujawwad]',
      value: 'abdulrazaq_bin_abtan_al_dulaimi',
    },
    {
      name: 'Abdullah Khayat',
      value: 'khayat',
    },
    {
      name: 'Adel Kalbani',
      value: 'adel_kalbani',
    },
    {
      name: 'AbdulKareem Al Hazmi',
      value: 'abdulkareem_al_hazmi',
    },
    {
      name: 'Abdul-Munim Abdul-Mubdi',
      value: 'abdulmun3im_abdulmubdi2',
    },
    {
      name: 'Abdur-Rashid Sufi',
      value: 'abdurrashid_sufi',
    },
    {
      name: 'Ahmad al-Huthaify',
      value: 'ahmad_alhuthayfi',
    },
    {
      name: 'Abu Bakr al-Shatri [Taraweeh]',
      value: 'abu_bakr_ash-shatri_tarawee7',
    },
    {
      name: 'Abdullah Matroud',
      value: 'abdullah_matroud',
    },
    {
      name: 'AbdulWadood Haneef',
      value: 'abdul_wadood_haneef_rare',
    },
    {
      name: 'Ahmad Nauina',
      value: 'ahmad_nauina',
    },
    {
      name: 'Akram Al-Alaqmi',
      value: 'akram_al_alaqmi',
    },
    {
      name: 'Ali Hajjaj Alsouasi',
      value: 'ali_hajjaj_alsouasi',
    },
    {
      name: 'Asim Abdul Aleem',
      value: 'asim_abdulaleem',
    },
    {
      name: 'Abdallah Abdal',
      value: 'abdallah_abdal',
    },
    {
      name: 'Abdullah Ali Jabir',
      value: 'ali_jaber',
    },
    {
      name: 'Bandar Baleela',
      value: 'bandar_baleela',
    },
    {
      name: 'Fares Abbad',
      value: 'fares',
    },
    {
      name: 'Fatih Seferagic',
      value: 'fatih_seferagic',
    },
    {
      name: 'Hani ar-Rifai',
      value: 'rifai',
    },
    {
      name: 'Hamad Sinan',
      value: 'hamad_sinan',
    },
    {
      name: 'Idrees Abkar',
      value: 'idrees_akbar',
    },
    {
      name: 'Ibrahim Al-Jibrin',
      value: 'jibreen',
    },
    {
      name: 'Imad Zuhair Hafez',
      value: 'imad_zuhair_hafez',
    },
    {
      name: 'Ibrahim Al Akhdar',
      value: 'ibrahim_al_akhdar',
    },
    {
      name: 'Khalid al-Qahtani',
      value: 'khaalid_al-qahtaanee',
    },
    {
      name: 'Khalifah Taniji',
      value: 'khalifah_taniji',
    },
    {
      name: 'Mishari Rashid al-`Afasy',
      value: 'mishaari_raashid_al_3afaasee',
    },
    {
      name: 'Muhammad al-Luhaidan',
      value: 'muhammad_alhaidan',
    },
    {
      name: 'Muhammad Siddiq al-Minshawi',
      value: 'muhammad_siddeeq_al-minshaawee',
    },
    {
      name: 'Muhammad al-Mehysni',
      value: 'mehysni',
    },
    {
      name: 'Muhammad Abdul-Kareem',
      value: 'muhammad_abdulkareem',
    },
    {
      name: 'Mustafa al-`Azawi',
      value: 'mustafa_al3azzawi',
    },
    {
      name: 'Muhammad Hassan',
      value: 'mu7ammad_7assan',
    },
    {
      name: 'Mostafa Ismaeel',
      value: 'mostafa_ismaeel',
    },
    {
      name: 'Muhammad Sulaiman Patel',
      value: 'muhammad_patel',
    },
    {
      name: 'Mohammad Al-Tablawi',
      value: 'mohammad_altablawi',
    },
    {
      name: 'Mohammad Ismaeel Al-Muqaddim',
      value: 'mohammad_ismaeel_almuqaddim',
    },
    {
      name: 'Muhammad Ayyoob [Taraweeh]',
      value: 'muhammad_ayyoob_hq',
    },
    {
      name: 'Muhammad Khaleel',
      value: 'muhammad_khaleel',
    },
    {
      name: 'Al-Husary',
      value: 'mahmood_khaleel_al-husaree_iza3a',
    },
    {
      name: 'Mahmood Ali Al-Bana',
      value: 'mahmood_ali_albana',
    },
    {
      name: 'Nasser Al Qatami',
      value: 'nasser_bin_ali_alqatami',
    },
    {
      name: 'Nabil ar-Rifai',
      value: 'nabil_rifa3i',
    },
    {
      name: 'Sa`ud ash-Shuraym',
      value: 'sa3ood_al-shuraym',
    },
    {
      name: 'Saad al-Ghamdi',
      value: 'sa3d_al-ghaamidi/complete',
    },
    {
      name: 'Sahl Yasin',
      value: 'sahl_yaaseen',
    },
    {
      name: 'Salah Bukhatir',
      value: 'salaah_bukhaatir',
    },
    {
      name: 'Sudais and Shuraym',
      value: 'sodais_and_shuraim',
    },
    {
      name: 'Salah al-Budair',
      value: 'salahbudair',
    },
    {
      name: 'Sadaqat `Ali',
      value: 'sadaqat_ali',
    },
    {
      name: 'Salah Al-Hashim',
      value: 'salah_alhashim',
    },
    {
      name: 'Tawfeeq ibn Sa`id as-Sawaigh',
      value: 'tawfeeq_bin_saeed-as-sawaaigh',
    },
    {
      name: 'Yasser ad-Dussary',
      value: 'yasser_ad-dussary',
    },
    {
      name: 'Wadee Hammadi Al Yamani',
      value: 'wadee_hammadi_al-yamani',
    },
  ];
  selectedQari: string;
  selectedSura: Sura;
  isShuffleSelected = false;
  constructor(private quranService: QuranService) {
    this.getSuraByIndex(this.selectedSuraIndex);

    const qariFromStorage = localStorage.getItem('audioQuranQari');
    if (qariFromStorage) {
      this.qari = qariFromStorage;
    } else {
      this.qari = 'idrees_akbar';
    }
    this.setSelectedQari();
  }

  setSelectedQari() {
    this.selectedQari = this.listOfQari
      .filter((qari) => qari.value === this.qari)
      .map((item) => item.name)[0];
  }

  changeQari(qari) {
    localStorage.setItem('audioQuranQari', qari);
    this.setSelectedQari();
    if(this.player) {
      this.stopAudio();
      this.play(this.qari, this.selectedSuraIndex);
    }
  }

  play(qari, selectedSura) {
    this.getSuraByIndex(selectedSura);

    this.selectedSuraIndex = selectedSura;
    this.qari = qari;
    this.currentTime = -1;
    this.audioUrl = `https://download.quranicaudio.com/quran/${
      this.qari
    }/${this.convertSuraNumber(selectedSura)}.mp3`;
    if (this.player) {
      this.stopAudio();
      this.removePlayer();
    }
    this.player = new Howl({
      html5: true,
      src: [this.audioUrl],
      preload: true,
      onplay: () => {
        this.isPlaying = true;
        this.isPaused = false;
      },
      onend: () => {
        this.isPlaying = false;
        this.clearWatchCurrentTimeInterval();
        if (this.selectedRepeatOption === PlayerRepeatOptions.order) {
          if (!this.isShuffleSelected) {
            if (this.selectedSuraIndex >= 1 && this.selectedSuraIndex < 114) {
              this.selectedSuraIndex++;
              this.play(this.qari, this.selectedSuraIndex);
            }
            if (this.selectedSuraIndex >= 114) {
              this.selectedSuraIndex = 1;
              this.play(this.qari, this.selectedSuraIndex);
            }
          } else {
            this.selectedSuraIndex = this.randomNumberInRange(1, 114);
            this.play(this.qari, this.selectedSuraIndex);
          }
        } else if (this.selectedRepeatOption === PlayerRepeatOptions.repeat) {
          this.play(this.qari, this.selectedSuraIndex);
        }
      },
      onloaderror: () => {
        this.isPlaying = false;
        this.removePlayer();
      },
      onplayerror: () => {
        this.isPlaying = false;
        this.removePlayer();
      },
    });
    this.player.play();
    this.watchCurrentTime();
  }

  stopAudio() {
    this.player.stop();
    this.isPlaying = false;
    this.clearWatchCurrentTimeInterval();
  }

  pauseAudio() {
    this.player.pause();
    this.isPaused = true;
    this.isPlaying = false;
  }

  continueAudio() {
    if (!this.player.playing()) {
      this.player.play();
      this.isPaused = false;
      this.isPlaying = true;
    }
  }

  getAudioCurrentTime() {
    return this.player.seek();
  }

  setAudioCurrentTime(time) {
    this.player.seek(time);
    this.player.play();
  }

  watchCurrentTime() {
    this.watchCurrentTimeInterval = setInterval(() => {
      if (this.isPlaying) {
        this.currentTime = this.getAudioCurrentTime();
      }
    }, 100);
  }

  clearWatchCurrentTimeInterval() {
    clearInterval(this.watchCurrentTimeInterval);
    this.currentTime = -1;
  }

  getPlayerDuration() {
    return this.player.duration();
  }

  getPlayerDurationAsString() {
    const playerDurationInSeconds = this.player.duration();
    return new Date(playerDurationInSeconds * 1000).toISOString().slice(11, 19);
  }

  getCurrentPlayerTimeAsString() {
    return new Date(this.currentTime * 1000).toISOString().slice(11, 19);
  }

  removePlayer() {
    if (this.player) {
      this.stopAudio();
      this.player = null;
      this.isPlaying = false;
      this.isPaused = false;
    }
  }

  toggleRepeatOption() {
    this.selectedRepeatOption =
      this.selectedRepeatOption === PlayerRepeatOptions.repeat
        ? PlayerRepeatOptions.order
        : PlayerRepeatOptions.repeat;
  }

  toggleShuffleOption() {
    this.isShuffleSelected = !this.isShuffleSelected;
    if(this.isShuffleSelected) {
      if(this.player) {
        this.stopAudio();
        this.play(this.qari, this.randomNumberInRange(1, 114));
      }
    }
  }

  getSuraByIndex(index) {
    this.quranService.getSuraByIndex(index).subscribe(sura => {
      this.selectedSura = sura;
    });
  }

  //helpers
  convertSuraNumber(suraIndex) {
    const numberIndex = +suraIndex;
    let stringIndex;
    if (numberIndex < 10) {
      stringIndex = '00' + numberIndex.toString();
    } else if (numberIndex > 10 && numberIndex < 100) {
      stringIndex = '0' + numberIndex.toString();
    } else {
      stringIndex = numberIndex.toString();
    }
    return stringIndex;
  }

  randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getPlayerDurationInPercents() {
    return (this.currentTime / this.player.duration()) * 100;
  }
}
