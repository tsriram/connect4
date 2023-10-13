import { soundEnabled } from '$lib/store';
import { get } from 'svelte/store';

let coinDropSounds: HTMLAudioElement[];
let winningSound: HTMLAudioElement;

export function initSounds() {
  // rows in the board are in reverse order. Bottom most is 5, which
  coinDropSounds = [
    new Audio('/audio/coin-drop-row6.m4a'),
    new Audio('/audio/coin-drop-row5.m4a'),
    new Audio('/audio/coin-drop-row4.m4a'),
    new Audio('/audio/coin-drop-row3.m4a'),
    new Audio('/audio/coin-drop-row2.m4a'),
    new Audio('/audio/coin-drop-row1.m4a')
  ];
  coinDropSounds.forEach((audio) => {
    audio.preload = 'auto';
  });

  // winning celebration
  winningSound = new Audio('/audio/winning-celebration.mp3');
  winningSound.preload = 'auto';
}

export function playCoinDrop(rowNumber: number) {
  const coinDropSound = coinDropSounds[rowNumber];
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio#determining_when_playback_can_begin
  if (coinDropSound.readyState >= 2 && get(soundEnabled)) {
    coinDropSound.volume = 0.75;
    coinDropSound.play();
  }
}

export function playWinningCelebration() {
  if (winningSound.readyState >= 2 && get(soundEnabled)) {
    winningSound.volume = 0.5;
    winningSound.play();
  }
}
