import {
  GoogleTranslateResponse,
  Language,
  MyMemoryTranslationResponse,
  Translation,
  YaTranslateResponse,
} from '../types';
import { getCulturalContext } from '../culturalContext';

let abortController: AbortController;

function fetchTranslationFromMyMemoryResponse(
  text: string,
  response: MyMemoryTranslationResponse,
) {
  return [
    {
      pos: '',
      transcription: '',
      text,
      values: response.matches
        .filter(
          (match) =>
            (match['created-by'] === 'MateCat' || match['created-by'] === 'Wikipedia') &&
            match.quality !== '0',
        )
        .map((matches) => matches.translation),
    },
  ];
}

async function myMemoryTranslate(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<Translation[]> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${sourceLang}|${targetLang}`;
    const response = await fetch(url, { signal: abortController.signal });
    if (!response.ok) throw new Error('Failed to fetch translation');
    return fetchTranslationFromMyMemoryResponse(text, await response.json());
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    return [];
  }
}

function fetchTranslationFromYaTranslateResponse(
  sourceLang: string,
  targetLang: string,
  response: YaTranslateResponse,
): Translation[] {
  return response?.[`${sourceLang}-${targetLang}`]?.regular.map((item) => ({
    text: item.text,
    pos: item.pos?.text,
    transcription: item.ts,
    values: item.tr.map((tr) => tr.text),
  }));
}

async function yaTranslate(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<Translation[]> {
  try {
    const url = `https://dictionary.yandex.net/dicservice.json/lookupMultiple?text=${text}&dict=${sourceLang}.syn%2Cen.ant%2Cen.deriv%2C${sourceLang}-${targetLang}.regular&flags=103`;
    const response = await fetch(url, { signal: abortController.signal });
    if (!response.ok) throw new Error('Failed to yandex translate');

    return fetchTranslationFromYaTranslateResponse(
      sourceLang,
      targetLang,
      await response.json(),
    );
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    return [];
  }
}

function fetchTranslationFromGoogleTranslateResponse(
  response: GoogleTranslateResponse,
): Translation[] {
  const fromSentences =
    response.sentences?.map((sentence) => ({
      text: sentence.orig,
      pos: '',
      transcription: '',
      values: [sentence.trans],
    })) ?? [];

  const fromDict =
    response.dict?.map((translation) => ({
      text: translation.base_form,
      pos: translation.pos,
      transcription: '',
      values: translation.terms,
    })) ?? [];

  return [...fromSentences, ...fromDict];
}

async function googleTranslate(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<Translation[]> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&dt=t&dt=bd&dj=1&q=${text}&tl=${targetLang}`;
    const response = await fetch(url, { signal: abortController.signal });
    if (!response.ok) throw new Error('Failed to google translate');

    return fetchTranslationFromGoogleTranslateResponse(await response.json());
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    return [];
  }
}

export async function translate(
  text: string,
  sourceLang: Language,
  targetLang: Language,
): Promise<Translation[]> {
  let translations: Translation[];

  abortController = new AbortController();
  const [translate1, translate2] =
    sourceLang === 'ru' || targetLang === 'ru'
      ? [yaTranslate, googleTranslate]
      : [googleTranslate, yaTranslate];

  translations = await translate1(text, sourceLang, targetLang);

  if (!translations?.length) {
    translations = await translate2(text, sourceLang, targetLang);
  }

  if (!translations?.length) {
    translations = await myMemoryTranslate(text, sourceLang, targetLang);
  }

  if (sourceLang === 'ko' || targetLang === 'ko') {
    const context = getCulturalContext(text);
    if (context) {
      translations.push({
        text,
        pos: '',
        transcription: '',
        values: [],
        context,
      });
    }
  }

  return translations;
}

export function cancelTranslate(): void {
  abortController?.abort();
}
