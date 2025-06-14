import { Translation } from './types';
import { WordMask } from './textProcessing/wrapNodeWords';

export const popupWidth = 220;
export const popupHeight = 140;
export const popupVerticalOffset = 0;
export const subContainerClassName = 'sub-tr-text';
export const subWordClassName = 'sub-tr-word';
export const subWordMaskClassName = 'sub-tr-mask';
export const subWordMaskHiddenClassName = 'sub-tr-mask-hidden';
export const subWordHiddenClassName = 'sub-tr-word-hidden';
export const subPopupWrapperClassName = 'sub-tr-popup-wrapper';
export const subPopupClassName = 'sub-tr-popup';
export const subWordReveal = 'sub-tr-reveal';
export const subLoadingClassName = 'sub-tr-loading';
const spinnerHTML = '<div class="loader"></div>';

export function getSubtitlesWordHTML(word: string) {
  return `<span class="${subWordClassName}">${word}</span>`;
}

export function getSubtitlesHiddenWordHTML(word: string) {
  return `<span class="${subWordClassName} ${subWordHiddenClassName}">${word}</span>`;
}

export function getPopupHTML(offsetBottom: number) {
  return `
    <div class="${subPopupClassName}" style="width: ${popupWidth}px; height: ${popupHeight}px;">
      ${settingsIconSVG()}
      ${closeIconSVG()}
      <div class="sub-tr-popup-container" style="height: ${popupHeight - offsetBottom}px">
        <div class="${subLoadingClassName}">
          ${spinnerHTML}
        </div>
      </div>
    </div>
  `;
}

function closeIconSVG() {
  return `
    <svg class="sub-tr-icon sub-tr-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M61.44,0A61.44,61.44,0,1,1,0,61.44,61.44,61.44,0,0,1,61.44,0ZM74.58,36.8c1.74-1.77,2.83-3.18,5-1l7,7.13c2.29,2.26,2.17,3.58,0,5.69L73.33,61.83,86.08,74.58c1.77,1.74,3.18,2.83,1,5l-7.13,7c-2.26,2.29-3.58,2.17-5.68,0L61.44,73.72,48.63,86.53c-2.1,2.15-3.42,2.27-5.68,0l-7.13-7c-2.2-2.15-.79-3.24,1-5l12.73-12.7L36.35,48.64c-2.15-2.11-2.27-3.43,0-5.69l7-7.13c2.15-2.2,3.24-.79,5,1L61.44,49.94,74.58,36.8Z"/></svg>
  `;
}

function settingsIconSVG() {
  return `
    <svg class="sub-tr-icon sub-tr-settings-icon" fill="#000000" viewBox="0 0 489.802 489.802"><g><path d="M20.701,281.901l32.1,0.2c4.8,24.7,14.3,48.7,28.7,70.5l-22.8,22.6c-8.2,8.1-8.2,21.2-0.2,29.4l24.6,24.9   c8.1,8.2,21.2,8.2,29.4,0.2l22.8-22.6c21.6,14.6,45.5,24.5,70.2,29.5l-0.2,32.1c-0.1,11.5,9.2,20.8,20.7,20.9l35,0.2   c11.5,0.1,20.8-9.2,20.9-20.7l0.2-32.1c24.7-4.8,48.7-14.3,70.5-28.7l22.6,22.8c8.1,8.2,21.2,8.2,29.4,0.2l24.9-24.6   c8.2-8.1,8.2-21.2,0.2-29.4l-22.6-22.8c14.6-21.6,24.5-45.5,29.5-70.2l32.1,0.2c11.5,0.1,20.8-9.2,20.9-20.7l0.2-35   c0.1-11.5-9.2-20.8-20.7-20.9l-32.1-0.2c-4.8-24.7-14.3-48.7-28.7-70.5l22.8-22.6c8.2-8.1,8.2-21.2,0.2-29.4l-24.6-24.9   c-8.1-8.2-21.2-8.2-29.4-0.2l-22.8,22.6c-21.6-14.6-45.5-24.5-70.2-29.5l0.2-32.1c0.1-11.5-9.2-20.8-20.7-20.9l-35-0.2   c-11.5-0.1-20.8,9.2-20.9,20.7l-0.3,32.1c-24.8,4.8-48.8,14.3-70.5,28.7l-22.6-22.8c-8.1-8.2-21.2-8.2-29.4-0.2l-24.8,24.6   c-8.2,8.1-8.2,21.2-0.2,29.4l22.6,22.8c-14.6,21.6-24.5,45.5-29.5,70.2l-32.1-0.2c-11.5-0.1-20.8,9.2-20.9,20.7l-0.2,35   C-0.099,272.401,9.201,281.801,20.701,281.901z M179.301,178.601c36.6-36.2,95.5-35.9,131.7,0.7s35.9,95.5-0.7,131.7   s-95.5,35.9-131.7-0.7S142.701,214.801,179.301,178.601z"/></g></svg>
  `;
}

export function getTranslationHTML(translations: Translation[]) {
  // prettier-ignore
  return `
    <div class="sub-tr-popup-content">
      <div class="sub-tr-dict">
        ${translations.map((translation) => `
          <div class="sub-tr-dict-item">
            <div class="sub-tr-dict-item-title">
              <span class="sub-tr-dict-item-text">${translation.text ?? ''}</span>
              <span class="sub-tr-dict-item-ts">${translation.transcription ? `[${translation.transcription}]` : ''}</span>
              <span class="sub-tr-dict-item-pos">${translation.pos ?? ''}</span>
            </div>
            <ol class="sub-tr-dict-meaning">
              ${(translation.values ?? []).map((value) => `
                <li class="sub-tr-dict-meaning-item">${value ?? ''}</li>
              `).join('')}
            </ol>
            ${translation.context ? `<div class="sub-tr-context">${translation.context}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function getWordMaskHTML(targetElementRect: DOMRect, wordMask: WordMask) {
  const { rect, word, isHidden } = wordMask;

  return `
    <div
      class="${subWordMaskClassName} ${isHidden ? subWordMaskHiddenClassName : ''}"
      data-word="${word}" 
      style=" 
        top: ${rect.top - targetElementRect.top + 2}px;
        left: ${rect.left - targetElementRect.left}px;  
        width: ${rect.width}px; 
        height: ${rect.height - 2}px;
      "/>
  `;
}

export function getWordWrapperHTML(word: string) {
  return `
    <span class="${subContainerClassName}">${word}</span>
  `;
}
