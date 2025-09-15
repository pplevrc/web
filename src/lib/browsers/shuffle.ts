const targetAttribute = "data-shuffle";

export function shuffleDOM() {
  const targets = document.querySelectorAll(`[${targetAttribute}]`);

  for (const target of targets) {
    shuffle(target);
  }

  function shuffle(target: Element) {
    const items = Array.from(target.children);

    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      swap(items, i, j);
    }

    target.replaceChildren(...items);
  }

  function swap(items: Element[], i: number, j: number) {
    // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
    const temp = items[i]!;
    // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
    items[i] = items[j]!;
    items[j] = temp;
  }
}

window.addEventListener("DOMContentLoaded", shuffleDOM);
