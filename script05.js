document.addEventListener("DOMContentLoaded", () => {
  const runOriginalBtn = document.getElementById("run-original");
  const runOptimizedBtn = document.getElementById("run-optimized");
  const clearResultsBtn = document.getElementById("clear-results");
  const originalResultContainer = document.getElementById("original-result");
  const optimizedResultContainer = document.getElementById("optimized-result");

  const NUM_DIVS = 1000; // 要創建的 div 元素數量

  /**
   * 清除結果容器內容。
   */
  function clearContainers() {
    originalResultContainer.innerHTML = "";
    optimizedResultContainer.innerHTML = "";
    console.clear(); // 清除控制台輸出
    console.log("--- 控制台已清除 ---");
  }

  /**
   * 原始方法：在迴圈中直接將大量元素附加到 DOM。
   * 效能較差，因為每次附加都可能觸發重排/重繪。
   *
   * @param {number} count - 要創建的 div 元素數量。
   * @param {HTMLElement} container - 元素將被附加到的容器。
   * @returns {void}
   */
  function appendDivsDirectly(count, container) {
    console.log(`開始執行原始方法，創建 ${count} 個 div...`);
    const startTime = performance.now();

    for (let i = 0; i < count; i++) {
      const div = document.createElement("div");
      div.textContent = `item${i + 1}`;
      container.appendChild(div); // 每次迴圈都直接操作 DOM
    }

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`原始方法完成！耗時: ${duration} 毫秒`);
    const resultDiv = document.createElement("div");
    resultDiv.textContent = `總共耗時：${duration} 毫秒`;
    container.prepend(resultDiv); // 將耗時信息加到頂部
  }

  /**
   * 優化方法：使用 DocumentFragment 高效地將大量元素附加到 DOM。
   * 避免了在迴圈中頻繁操作主 DOM 樹，減少重排/重繪次數。
   *
   * @param {number} count - 要創建的 div 元素數量。
   * @param {HTMLElement} container - 元素將被附加到的容器。
   * @returns {void}
   */
  function appendDivsEfficiently(count, container) {
    console.log(`開始執行優化方法，創建 ${count} 個 div...`);
    const startTime = performance.now();
    const fragment = []; // 創建空陣列存文字範本
    // 生產文字範本
    for (let i = 0; i < count; i++) {
      fragment.push(`<div>item${i + 1}</div>`);
    }
    // 一次加上網頁
    document.getElementById("optimized-result").innerHTML = fragment.join("");

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`優化方法完成！耗時: ${duration} 毫秒`);
    const resultDiv = document.createElement("div");
    resultDiv.textContent = `總共耗時：${duration} 毫秒`;
    container.prepend(resultDiv); // 將耗時信息加到頂部
  }

  // 綁定事件監聽器
  runOriginalBtn.addEventListener("click", () => {
    clearContainers(); // 每次測試前清除
    appendDivsDirectly(NUM_DIVS, originalResultContainer);
  });

  runOptimizedBtn.addEventListener("click", () => {
    clearContainers(); // 每次測試前清除
    appendDivsEfficiently(NUM_DIVS, optimizedResultContainer);
  });

  clearResultsBtn.addEventListener("click", clearContainers);

  console.log("頁面載入完成。請點擊按鈕執行測試。");
});
