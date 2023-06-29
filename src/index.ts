import { wrapSentenceWords, updateWordsToHide } from './textProcessing/wrapSentenceWords';
import addMouseEnterLeaveEventListeners from './addMouseEnterLeaveEventListeners';
import { translate, cancelTranslate } from './translate';
import { insertTranslationPopup, insertTranslationResult, hideTranslationPopup } from './translationPopup';
import { defaultPrefs, Prefs } from './preferencePopup/prefs';
import {
  subWordClassName,
  subContainerClassName,
  getTranslationHTML,
  subWordReveal,
  getSubtitlesWordHTML,
  getSubtitlesHiddenWordHTML, subPopupWrapperClassName,
} from './markup';
import startTextMutationObserver from './startTextMutationObserver';
import { getSiteSpecificApi } from './siteApi';
import { logPrefix } from './utils';


const siteApi = getSiteSpecificApi();
let sourceLang: string = defaultPrefs.sourceLang;
let targetLang: string = defaultPrefs.targetLang;

/**
 * Wraps words in the target text in separate tags.
 * */
function processSubtitlesElement(textNode: Text): void {
  const parentElClassList = textNode.parentElement?.classList;
  if (parentElClassList?.contains?.(subWordClassName) || parentElClassList?.contains?.(subContainerClassName)) return;

  const processedText = wrapSentenceWords(
    textNode.textContent!, getSubtitlesWordHTML, getSubtitlesHiddenWordHTML,
  ).text;
  const span = document.createElement('span');

  span.className = subContainerClassName;
  span.innerHTML = processedText;
  textNode.parentElement!.replaceChild(span, textNode);
}

console.log(logPrefix, 'initialized');
var selectOtherWord = false;

// Observe subtitles change on a page and replace text nodes with hidden words
// or with just custom nodes to make translation on mouseover easier
startTextMutationObserver({
  getTargetElement: siteApi.getSubtitleElement,
  onTextAppear: processSubtitlesElement
});

// Toggle the popup with translation on mouseenter/mouseleave a word in the subtitles.
addMouseEnterLeaveEventListeners({
  targetElClassName: subWordClassName,
  ignoreElClassName: subPopupWrapperClassName,

  // Translate hovered word and show translation popup
  onEnter: (subWordEl: HTMLElement) => {
    subWordEl.classList.add(subWordReveal);
    const containerEl = siteApi.getSubtitlePopupMountTarget();
    const popupEl = insertTranslationPopup(subWordEl, containerEl);

    selectOtherWord = true
    siteApi.pause();

    translate(subWordEl.innerText, sourceLang, targetLang).then((translation) => {
      const html = getTranslationHTML(translation, sourceLang, targetLang);
      insertTranslationResult(popupEl, html);
    }).catch(error => {
      if (error.name !== 'AbortError') {
        throw error;
      }
    });
  },

  // Hide translation popup
  onLeave: (subWordEl: HTMLElement) => {
    selectOtherWord = false
    hideTranslationPopup();
    subWordEl.classList.remove(subWordReveal);
    cancelTranslate();
    new Promise(r => setTimeout(r, 500))
      .then(() => {
        if (!selectOtherWord)
            siteApi.play();
      })
  },
});

// Listen to changes in preferences and update lang and word settings.
document.addEventListener('prefs', (event: CustomEvent<Prefs>) => {
  const prefs = event.detail;
  updateWordsToHide(
    prefs.hideWords, prefs.wordCount, prefs.contractions, prefs.informal, prefs.hideType
  );
  sourceLang = prefs.sourceLang;
  targetLang = prefs.targetLang;
});