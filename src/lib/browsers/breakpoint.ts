export function getViewportWidth(): number {
  return window.innerWidth;
}

export const PC_VIEWPORT_WIDTH = 1440;

export function isSP() {
  return getViewportWidth() < PC_VIEWPORT_WIDTH;
}

export function isPC() {
  return !isSP();
}
