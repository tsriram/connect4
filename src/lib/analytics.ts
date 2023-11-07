import { browser } from '$app/environment';
import { GameFormType } from '$lib/types';

export function trackGameEvent(type: GameFormType) {
  if (browser) {
    if (type === GameFormType.START) {
      window.gtag('event', 'new_game', {
        event_category: 'Game',
        event_label: 'New game'
      });
      window.umami.track('new_game');
    } else if (type === GameFormType.JOIN) {
      window.gtag('event', 'join_game', {
        event_category: 'Game',
        event_label: 'Join game'
      });
      window.umami.track('join_game');
    }
  }
}

export function trackGameCompletion() {
  if (browser) {
    window.gtag('event', 'game_completed', {
      event_category: 'Game',
      event_label: 'Game completed'
    });
    window.umami.track('game_completed');
  }
}

export function trackShare() {
  if (browser) {
    window.gtag('event', 'social_share', {
      event_category: 'Game',
      event_label: 'Social share'
    });
    window.umami.track('social_share');
  }
}

export function trackGameRestart() {
  if (browser) {
    window.gtag('event', 'game_restarted', {
      event_category: 'Game',
      event_label: 'Game restarted'
    });
    window.umami.track('game_restarted');
  }
}
