const TARGET_DATA_ATTRIBUTE = "data-touch-active";

/**
 * "data-touch-active" 属性を持つ要素に対して、タッチ時に data-active 属性を自動的に付与/削除する
 */
function handleTouchActiveAll() {
  const targets = document.querySelectorAll(`[${TARGET_DATA_ATTRIBUTE}]`);

  for (const target of targets) {
    if (!(target instanceof HTMLElement)) {
      continue;
    }

    target.addEventListener("touchstart", () => {
      target.dataset.active = "true";
    });

    target.addEventListener("touchend", () => {
      delete target.dataset.active;
    });

    target.addEventListener("touchcancel", () => {
      delete target.dataset.active;
    });
  }
}

window.addEventListener("DOMContentLoaded", handleTouchActiveAll);

document.addEventListener("astro:page-load", handleTouchActiveAll);
