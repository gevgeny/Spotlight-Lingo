interface SubtitleApi {
  subtitleSelector: string;
  subtitlePopupSelector: string;
  popupOffsetBottom: number;
  pause: () => boolean;
  play: () => void;
}

interface SubtitleApiWithReplace extends SubtitleApi {
  subtitleTransformType: 'replace';
}

interface SubtitleApiWithMask extends SubtitleApi {
  subtitleTransformType: 'mask';
  maskContainerSelector: string;
}

const siteApiMap = {
  'kino.pub': {
    subtitleTransformType: 'replace',
    subtitleSelector: '.jw-captions',
    subtitlePopupSelector: '#player',
    popupOffsetBottom: 4,
    pause() {
      if (document.querySelector<HTMLVideoElement>('video.jw-video')?.paused)
        return false;
      document.querySelector<HTMLVideoElement>('video.jw-video')?.pause();
      return true;
    },
    play() {
      document.querySelector<HTMLVideoElement>('video.jw-video')?.play();
    },
  },
  'www.netflix.com': {
    subtitleTransformType: 'replace',
    subtitleSelector: '.player-timedtext:not(.billboard .player-timedtext)',
    subtitlePopupSelector: '.watch-video',
    popupOffsetBottom: 0,
    pause() {
      if (
        document.querySelector<HTMLButtonElement>('[data-uia^="control-play-pause-play"]')
      )
        return false;
      document
        .querySelector<HTMLButtonElement>('[data-uia^="control-play-pause-pause"]')
        ?.click();
      return true;
    },
    play() {
      document
        .querySelector<HTMLButtonElement>('[data-uia^="control-play-pause-play"]')
        ?.click();
    },
  },
  'www.youtube.com': {
    subtitleTransformType: 'replace',
    subtitleSelector: '#movie_player .ytp-caption-window-container',
    subtitlePopupSelector: '#movie_player',
    popupOffsetBottom: 4,
    pause() {
      if (document.querySelector<HTMLVideoElement>('#movie_player video')?.paused)
        return false;
      document.querySelector<HTMLVideoElement>('#movie_player video')?.pause();
      return true;
    },
    play() {
      document.querySelector<HTMLVideoElement>('#movie_player video')?.play();
    },
  },
  'www.primevideo.com': {
    subtitleTransformType: 'mask',
    subtitleSelector: '.atvwebplayersdk-captions-overlay',
    maskContainerSelector: '.atvwebplayersdk-captions-text',
    subtitlePopupSelector: '.atvwebplayersdk-overlays-container',
    popupOffsetBottom: 4,
    pause() {
      if (document.querySelector<HTMLVideoElement>('#dv-web-player video')?.paused)
        return false;
      document.querySelector<HTMLVideoElement>('#dv-web-player video')?.pause();
      return true;
    },
    play() {
      document.querySelector<HTMLVideoElement>('#dv-web-player video')?.play();
    },
  },
  'npo.nl': {
    subtitleTransformType: 'replace',
    subtitleSelector: '.bmpui-ui-subtitle-overlay .bmpui-container-wrapper',
    subtitlePopupSelector: '.bitmovinplayer-container',
    popupOffsetBottom: 0,
    pause() {
      if (
        document.querySelector<HTMLVideoElement>('.bitmovinplayer-container video')
          ?.paused
      )
        return false;
      document
        .querySelector<HTMLVideoElement>('.bitmovinplayer-container video')
        ?.pause();
      return true;
    },
    play() {
      document.querySelector<HTMLVideoElement>('.bitmovinplayer-container video')?.play();
    },
  },
} satisfies Record<string, SubtitleApiWithReplace | SubtitleApiWithMask>;

type Host = keyof typeof siteApiMap;

function isAllowedHost(host: string): host is Host {
  return host in siteApiMap;
}
export function getSiteSpecificApi(
  host: string,
): SubtitleApiWithReplace | SubtitleApiWithMask {
  if (isAllowedHost(host)) return siteApiMap[host];
  return {
    subtitleTransformType: 'replace',
    subtitleSelector: '',
    subtitlePopupSelector: '',
    popupOffsetBottom: 0,
    pause: () => false,
    play: () => undefined,
  };
}
