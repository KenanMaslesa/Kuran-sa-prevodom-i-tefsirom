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
  suraInfo: SuraInfo;
  ayahsPerPages?: ((AyahsPerPagesEntity)[] | null)[] | null;
}
export interface SuraInfo {
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
export interface AyahsPerPagesEntity {
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

//quran words
export interface QuranWords {
  words?: (WordsEntity)[] | null;
  page: number;
}
export interface WordsEntity {
  suraName?: string | null;
  words?: (Word)[] | null;
}
export interface Word {
  code: string;
  index: number;
  audio?: string | null;
  charType: string;
}
