import uniq from 'lodash-es/uniq';
import { fetchTextNodes, logPrefix } from './utils';

let isObserving = false;
let observer: MutationObserver | null = null;
let observingElement: Element | null = null;

const textNodes = new Map<Text, string>();

interface Params {
  containerSelector: string;
  onTextAdded: (text: Text) => void;
  onTextRemoved?: (text: Text) => void;
  onTextChanged?: (text: Text) => void;
}

/**
 * Starts to observe text mutation under the target element.
 * Restarts every time when target element is available again.
 * */
export default function startTextMutationObserver({
  containerSelector,
  onTextAdded,
  onTextRemoved,
  onTextChanged,
}: Params): void {
  const targetEl = document.querySelector<HTMLElement>(containerSelector);
  if (!observer) {
    observer = createTextMutationObserver(onTextAdded);
  }

  textNodes.forEach((nodeText, node) => {
    // Remove node if it was removed from the DOM
    if (!targetEl?.contains(node)) {
      textNodes.delete(node);
      onTextRemoved?.(node);
    } else if (nodeText !== node.textContent) {
      // Update node if its text was changed.
      textNodes.set(node, node.textContent ?? '');
      onTextChanged?.(node);
    }
  });

  if (targetEl && !isObserving) {
    console.log(logPrefix, 'start observing text');
    observingElement = targetEl;
    observer.observe(observingElement, { childList: true, subtree: true });
    isObserving = true;
  } else if (!targetEl && isObserving) {
    console.log(logPrefix, 'stop observing text');
    observer?.disconnect();
    isObserving = false;
  } else if (targetEl && targetEl !== observingElement) {
    console.log(logPrefix, 'restart observing text');
    observer.disconnect();
    observingElement = targetEl;
    observer.observe(observingElement, { childList: true, subtree: true });
  }

  // Restart observer if not started yet.
  // It is necessary if user changed a page with video and then came back
  setTimeout(() => {
    startTextMutationObserver({
      containerSelector,
      onTextAdded,
      onTextRemoved,
      onTextChanged,
    });
  }, 50);
}

function createTextMutationObserver(onTextAdded: (text: Text) => void): MutationObserver {
  return new MutationObserver((mutationsList: MutationRecord[]) => {
    const addedTextNodes = mutationsList
      .filter((m) => m.type === 'childList' && m.addedNodes.length)
      .map((m) => Array.from(m.addedNodes).map(fetchTextNodes));

    const uniqTextNodes = uniq(addedTextNodes.flat(2));

    uniqTextNodes.forEach((node) => {
      textNodes.set(node, node.textContent ?? '');
      onTextAdded(node);
    });
  });
}
