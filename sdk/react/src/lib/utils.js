// @flow

import { VALUES } from '../constants';
import * as Log from './log';

export const shouldShowLandscape = (width, height) => {
  if (Number.isNaN(width) || Number.isNaN(height) || width === null || height === null || width < 0 || height < 0) {
    return false;
  }

  return width > height;
};

export const formattedPlaybackSpeedRate = (selectedPlaybackSpeedRate) => {
  const selectedPlaybackSpeedRateFloat = parseFloat(parseFloat(String(selectedPlaybackSpeedRate)).toFixed(2));
  const selectedPlaybackSpeedRateString = selectedPlaybackSpeedRateFloat.toString();

  return selectedPlaybackSpeedRateString.concat('x');
};

export const getTimerLabel = (timer) => {
  let timerLabel = '';

  if (timer < 10) {
    timerLabel = `00:0${(timer || '0').toString()}`;
  } else if (timer < 60) {
    timerLabel = `00:${(timer || '0').toString()}`;
  } else if (timer < 600) {
    timerLabel = `0${(timer / 60).toString()}:${(timer % 60).toString()}`;
  } else {
    timerLabel = `${(timer / 60).toString()}:${(timer % 60).toString()}`;
  }

  return timerLabel;
};

export const secondsToString = (inputSeconds) => {
  let minus = '';
  let seconds = inputSeconds;

  if (seconds < 0) {
    minus = '-';
    seconds = -seconds;
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  let mm = date.getUTCMinutes();
  let ss = date.getSeconds();

  if (ss < 10) {
    ss = `0${ss}`;
  }

  if (mm === 0) {
    mm = '00';
  } else if (mm < 10) {
    mm = `0${mm}`;
  }

  let t = `${mm}:${ss}`;

  if (hh > 0) {
    t = `${hh}:${t}`;
  }

  return minus + t;
};

export const localizedString = (preferredLocale, stringId, localizableStrings) => {
  if (typeof stringId !== 'string') {
    return null;
  }

  let locale = preferredLocale;
  let strings = localizableStrings;

  if (typeof locale !== 'string') {
    locale = undefined;
  }

  if (typeof strings !== 'object' || strings === null) {
    strings = {};
  }

  Log.verbose(`preferredLocale: ${locale}, stringId: ${stringId}, localizableStrings:`);

  const defaultLocale = strings.defaultLanguage || 'en';

  if (locale && strings[locale] && strings[locale][stringId]) {
    return strings[locale][stringId];
  }

  if (strings[defaultLocale] && strings[defaultLocale][stringId]) {
    return strings[defaultLocale][stringId];
  }

  return stringId;
};

export const stringForErrorCode = (errorCode) => {
  switch (errorCode) {
    case 0:
      // Authorization failed
      // TODO: Add to language files.
      return 'Authorization failed';

    case 1:
      // Authorization response invalid
      // TODO: Add to language files.
      return 'Invalid Authorization Response';

    case 2:
      // Authorization heartbeat failed
      return 'Invalid Heartbeat';

    case 3:
      // Content tree response invalid
      // TODO: Add to language files.
      return 'Content Tree Response Invalid';

    case 4:
      // Authorization signature invalid
      // TODO: Add to language files.
      return 'The signature of the Authorization Response is invalid';

    case 5:
      // Content tree next failed
      // TODO: Add to language files.
      return 'Content Tree Next failed';

    case 6:
      // Playback failed
      return 'Playback Error';

    case 7:
      // The asset is not encoded
      return 'This video is not encoded for your device';

    case 8:
      // Internal error
      // TODO: Add to language files.
      return 'An internal error occurred';

    case 9:
      // Metadata response invalid
      return 'Invalid Metadata';

    case 10:
      // Invalid authorization token
      return 'Invalid Player Token';

    case 11:
      // Device limit has been reached
      return 'Authorization Error';

    case 12:
      // Device binding failed
      return 'Device binding failed';

    case 13:
      // Device id too long
      return 'Device ID is too long';

    case 14:
      // General DRM failure
      return 'General error acquiring license';

    case 15:
      // DRM file download failure
      // TODO: Add to language files.
      return 'Failed to download a required file during the DRM workflow';

    case 16:
      // DRM personalization failure
      // TODO: Add to language files.
      return 'Failed to complete device personalization during the DRM workflow';

    case 17:
      // DRM rights server error
      // TODO: Add to language files.
      return 'Failed to get rights for asset during the DRM workflow';

    case 18:
      // Invalid discovery parameter
      // TODO: Add to language files.
      return 'The expected discovery parameters are not provided';

    case 19:
      // Discovery network error
      // TODO: Add to language files.
      return 'A discovery network error occurred';

    case 20:
      // Discovery response failure
      // TODO: Add to language files.
      return 'A discovery response error occurred';

    case 21:
      // No available streams
      // TODO: Add to language files.
      return 'No available streams';

    case 22:
      // Pcode mismatch
      // TODO: Add to language files.
      return 'The provided PCode does not match the embed code owner';

    case 23:
      // Download error
      // TODO: Add to language files.
      return 'A download error occurred';

    case 24:
      // Concurrent streams
      return 'You have exceeded the maximum number of concurrent streams';

    case 25:
      //  Advertising id failure
      // TODO: Add to language files.
      return 'Failed to return the advertising ID';

    case 26:
      // Discovery GET failure
      // TODO: Add to language files.
      return 'Failed to get discovery results';

    case 27:
      // Discovery POST failure
      // TODO: Add to language files.
      return 'Failed to post discovery pins';

    case 28:
      // Player format mismatch
      // TODO: Add to language files.
      return 'Player and player content do not correspond';

    case 29:
      // Failed to create VR player
      // TODO: Add to language files.
      return 'Failed to create VR player';

    case 30:
      // Unknown error
      // TODO: Add to language files.
      return 'An unknown error occurred';

    case 31:
      // GeoBlocking access denied
      // TODO: Add to language files.
      return 'Geo access denied';

    default:
      // Default to Unknown error
      return 'An unknown error occurred';
  }
};

export const restrictSeekValueIfNeeded = seekValue => (
  Math.min(Math.max(VALUES.MIN_SKIP_VALUE, seekValue), VALUES.MAX_SKIP_VALUE)
);
