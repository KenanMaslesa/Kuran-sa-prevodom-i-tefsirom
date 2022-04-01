//sura
export interface Sura {
  index: number;
  numberOfAyas: number;
  startAyaIndex: number;
  name: Name;
  aboutSura: AboutSura;
  type: string;
  orderInPublishing: number;
  numberOfWords: number;
  numberOfLetters: number;
  startJuz: number;
  endJuz: number;
  startPage: number;
  endPage: number;
  totalPages: number;
}
export interface Name {
  arabic: string;
  english: string;
  englishTranscription: string;
  bosnian: string;
  bosnianTranscription: string;
}
export interface AboutSura {
  bosnian: string;
}

//juz
export interface Juz {
  id: number;
  juzNumber: number;
  surahs?: (SurahsEntity)[] | null;
  firstAyahId: number;
  lastAyahId: number;
  numberOfAyahs: number;
  startPage: number;
  endPage: number;
}
export interface SurahsEntity {
  id: number;
  startAyah: number;
  endAyah: number;
}


//tafsir
export interface Tafsir {
  index: number;
  sura: number;
  ayaNumber: number;
  aya: string;
  juz: number;
  hizb: number;
  page: number;
  korkutsTranslation: string;
  tafsir: string;
}
