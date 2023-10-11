import { browser } from '$app/environment';
import { GameFormType } from '$lib/types';

export function trackGameEvent(type: GameFormType) {
	if (browser) {
		if (type === GameFormType.START) {
			window.gtag('event', 'new_game', {
				event_category: 'Game',
				event_label: 'New game'
			});
		} else if (type === GameFormType.JOIN) {
			window.gtag('event', 'join_game', {
				event_category: 'Game',
				event_label: 'Join game'
			});
		}
	}
}

export function trackGameCompletion() {
	if (browser) {
		window.gtag('event', 'game_completed', {
			event_category: 'Game',
			event_label: 'Game completed'
		});
	}
}

export function trackGameRestart() {
	if (browser) {
		window.gtag('event', 'game_restarted', {
			event_category: 'Game',
			event_label: 'Game restarted'
		});
	}
}
