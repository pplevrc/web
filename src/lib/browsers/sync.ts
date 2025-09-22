const TARGET_DATA_ATTRIBUTE_BUSY_WATCH = "data-budy-watch";

/**
 * "data-loadingSync" 属性を持つ要素が読み込まれたら, その要素の aria-busy 属性を false にする
 */
function handleBusyStateAll() {
  const targets = document.querySelectorAll(
    `[${TARGET_DATA_ATTRIBUTE_SHUFFLE}]`,
  );

  for (const target of targets) {
    if (target.getAttribute("aria-busy") === "false") {
      continue;
    }

    const loadDetectableElement = toLoadDetectableElement(target);
    if (!loadDetectableElement) {
      continue;
    }

    loadDetectableElement.addEventListener("load", () => {
      target.setAttribute("aria-busy", "false");
    });
  }
}

function toLoadDetectableElement(target: Element) {
  if (target instanceof HTMLImageElement) {
    return target;
  }

  if (target instanceof HTMLPictureElement) {
    return target.querySelector("img");
  }

  return null;
}

window.addEventListener("DOMContentLoaded", handleBusyStateAll);
