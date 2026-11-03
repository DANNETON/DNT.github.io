/** Browser haptics: supported mainly on Android Chromium. iOS Safari currently ignores vibrate(). */
export function vibrateOnWin(enabled: boolean): boolean {
  if (!enabled || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return false;
  try {
    // One short celebratory pattern; user can disable it in Settings.
    return navigator.vibrate([70, 55, 110, 55, 160]);
  } catch {
    return false;
  }
}
