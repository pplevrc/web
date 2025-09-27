const TARGET_DATA_ATTRIBUTE_SHUFFLE = "data-shuffle";

/**
 * data-shuffle 属性が同じ値を持つすべての要素配下を、要素数を変更せずにシャッフルする
 * 複数のエレメント間で子要素を混ぜ合わせてシャッフルする
 */
function shuffleDOM() {
  const targets = document.querySelectorAll(
    `[${TARGET_DATA_ATTRIBUTE_SHUFFLE}]`,
  );

  const sameTargets = new Map<string, Element[]>();

  for (const target of targets) {
    const value = target.getAttribute(TARGET_DATA_ATTRIBUTE_SHUFFLE);
    if (!value) {
      continue;
    }

    const targets = sameTargets.get(value) ?? [];
    targets.push(target);
    sameTargets.set(value, targets);
  }

  for (const targets of sameTargets.values()) {
    shuffleAcrossTargets(targets);
  }

  /**
   * 複数のエレメント間で子要素を混ぜ合わせてシャッフルする
   * 各エレメントの子要素数を変更せずに、全体でランダムに再配置する
   */
  function shuffleAcrossTargets(targets: Element[]) {
    // 全子要素を収集
    const allItems: Element[] = [];
    const targetSizes: number[] = [];

    for (const target of targets) {
      const children = Array.from(target.children);
      allItems.push(...children);
      targetSizes.push(children.length);
    }

    // 全体をシャッフル
    shuffleArray(allItems);

    // 元の個数に応じて再分配
    let index = 0;
    for (let i = 0; i < targets.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
      const size = targetSizes[i]!;
      // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
      const target = targets[i]!;
      const items = allItems.slice(index, index + size);
      target.replaceChildren(...items);
      index += size;
    }
  }

  /**
   * 配列をシャッフルする（Fisher-Yates shuffle）
   */
  function shuffleArray(items: Element[]) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      swap(items, i, j);
    }
  }

  function swap(items: Element[], i: number, j: number) {
    // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
    const temp = items[i]!;
    // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
    items[i] = items[j]!;
    items[j] = temp;
  }
}

// 即座に実行（Astroでは既にDOMが構築済み）
shuffleDOM();

// ページ遷移時にも実行
document.addEventListener("astro:page-load", shuffleDOM);
