export function getViewportWidth(): number {
  return window.innerWidth;
}

export const PC_VIEWPORT_WIDTH = 1440;

export const SP_MAX_WIDTH = PC_VIEWPORT_WIDTH - 0.01;

export const SP_ROOT_FONT_SCALE = 3;

export function isSP() {
  return getViewportWidth() < PC_VIEWPORT_WIDTH;
}

export function isPC() {
  return !isSP();
}
