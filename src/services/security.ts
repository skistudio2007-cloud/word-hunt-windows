/**
 * Security & Anti-Inspection Shield
 * © 2026 Word Hunt Windows. All Rights Reserved.
 * Created & Owned by Developer.
 * Unauthorized inspection, copying, or reverse engineering of this software is strictly prohibited.
 */

export const initSecurityShield = (): void => {
  if (typeof window === 'undefined') return;

  // 1. Disable Right-Click Context Menu
  window.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Disable Developer Shortcut Keys
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    // F12 key
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    // Ctrl+Shift+I / Cmd+Opt+I (Inspect)
    // Ctrl+Shift+J / Cmd+Opt+J (Console)
    // Ctrl+Shift+C / Cmd+Opt+C (Select Element)
    if (isCtrlOrMeta && e.shiftKey) {
      const key = e.key.toUpperCase();
      if (key === 'I' || key === 'J' || key === 'C') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Ctrl+U (View Page Source)
    if (isCtrlOrMeta && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S (Save Page HTML)
    if (isCtrlOrMeta && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });

  // 3. DevTools Warning & Copyright Notice Banner in Console
  try {
    const bannerStyle = 'color: #dc2626; font-size: 32px; font-weight: 900; font-family: sans-serif; text-shadow: 1px 1px 2px black;';
    const textStyle = 'color: #1e293b; font-size: 13px; font-weight: bold; line-height: 1.6; font-family: sans-serif;';
    const subTextStyle = 'color: #2563eb; font-size: 11px; font-weight: 800; font-family: monospace;';

    console.clear();
    console.log('%cSTOP! ACCESS RESTRICTED', bannerStyle);
    console.log(
      '%cThis application and all associated source code, algorithms, and assets are protected by international copyright laws.\n' +
      'Unauthorized copying, reverse engineering, inspection, decompilation, or redistribution of this software is strictly prohibited.',
      textStyle
    );
    console.log('%c© 2026 Word Hunt Windows • All Rights Reserved • Proprietary & Confidential', subTextStyle);
  } catch {
    // Ignore any console restrictions
  }
};
