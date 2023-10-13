import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';

export function getPartyKitRoomUrl(room: string): string {
  return `${PUBLIC_PARTYKIT_HOST}/party/${room}`;
}
