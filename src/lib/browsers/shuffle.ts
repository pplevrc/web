/**
 * data-shuffle 属性名
 */
const TARGET_DATA_ATTRIBUTE_SHUFFLE = "data-shuffle";

/**
 * シャッフルを無効化する query parameter 名
 * E2E テスト（visual regression test など）で使用
 * @example
 * `?disable-shuffle=true`
 */
const QUERY_PARAM_DISABLE_SHUFFLE = "disable-shuffle";

/**
 * Query parameter で無効化できるか判定する
 * E2E テスト（visual regression test など）で使用
 */
function shouldShuffle(): boolean {
  return (
    new URLSearchParams(window.location.search).get(
      QUERY_PARAM_DISABLE_SHUFFLE,
    ) !== "true"
  );
}

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

  for (const shuffleRoots of sameTargets.values()) {
    shuffleAcrossTargets(shuffleRoots);
  }

  /**
   * 複数のエレメント間で子要素を混ぜ合わせてシャッフルする
   * 各エレメントの子要素数を変更せずに、全体でランダムに再配置する
   * @param shuffleRoots シャッフルするルート要素配列
   */
  function shuffleAcrossTargets(shuffleRoots: Element[]) {
    // 全子要素を収集
    const allElements: Element[] = [];
    const targetSizes: number[] = [];

    for (const shuffleRoot of shuffleRoots) {
      const children = Array.from(shuffleRoot.children);
      allElements.push(...children);
      targetSizes.push(children.length);
    }

    // 全体をシャッフル
    shuffle(allElements);

    // 元の個数に応じて再分配
    let index = 0;
    for (let i = 0; i < shuffleRoots.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
      const size = targetSizes[i]!;
      // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
      const target = shuffleRoots[i]!;
      const items = allElements.slice(index, index + size);
      target.replaceChildren(...items);
      index += size;
    }
  }

  /**
   * 配列をシャッフルする（Fisher-Yates shuffle）
   * @param elements シャッフルする要素配列
   */
  function shuffle<T>(elements: T[]) {
    for (let i = elements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      swap(elements, i, j);
    }
  }

  /**
   * 配列の要素を入れ替える
   * @param elements 入れ替える要素配列
   * @param i 入れ替える要素のインデックス
   * @param j 入れ替える要素のインデックス
   */
  function swap<T>(elements: T[], i: number, j: number) {
    // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
    const temp = elements[i]!;
    // biome-ignore lint/style/noNonNullAssertion: あるのわかっている
    elements[i] = elements[j]!;
    elements[j] = temp;
  }
}

if (shouldShuffle()) {
  // 即座に実行（Astroでは既にDOMが構築済み）
  shuffleDOM();

  // ページ遷移時にも実行
  document.addEventListener("astro:page-load", shuffleDOM);
}
