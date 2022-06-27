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
  learnedAyahs: number;
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

export interface Tafsir {
  suraInfo: SuraInfo;
  ayahsPerPages?: ((TafsirAyah)[] | null)[] | null;
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
export interface TafsirAyah {
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

export interface QuranWords {
  ayahs?: (AyahsEntity)[] | null;
  page: number;
}
export interface AyahsEntity {
  words?: (Word)[] | null;
  metaData: MetaData;
}
export interface Word {
  code?: string | null;
  audio?: string | null;
  index?: number | null;
  charType?: string | null;
}

export interface MetaData {
  lineType?: string | null;
  suraName?: string | null;
}

export interface Juz {
  id: number;
  juzNumber: number;
  surahs?: (Surah)[] | null;
  firstAyahId: number;
  lastAyahId: number;
  numberOfAyahs: number;
  startPage: number;
  endPage: number;
}
export interface Surah {
  id: number;
  startAyah: number;
  endAyah: number;
  name: Name;
}

export interface PageInfo {
  page: number;
  wordsNumber: number;
  lettersNumber: number;
}

export interface Ayah {
  index: number;
  sura: number;
  ayaNumber: number;
  aya: string;
  juz: number;
  hizb: number;
  page: number;
}

export class SuraQuranTracker {
  completedPages: number;
  endPage: number;
  index: number;
  name: string;
  pages: PageQuranTracker[];
  startPage: number;
  totalPages: number;
}

export class PageQuranTracker {
  page: number;
  completed: boolean;
  numberOfLetters: number;
  numberOfWords: number;
}
