// 確保 DOM 載入完畢後再執行 JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const numbers = [1, 2, 2, 3, 4, 4, 5];
  // 方法一 (forEach & includes)
  // 開始計時
  const startTime1 = performance.now();
  const uniqueNumbers = [];
  numbers.forEach((num) => {
    if (!uniqueNumbers.includes(num)) {
      uniqueNumbers.push(num);
    }
  });
  // 結束計時
  const endTime1 = performance.now();
  const duration1 = (endTime1 - startTime1).toFixed(3); // 保留三位小數

  // 更新 HTML
  document.getElementById(
    "method1Description"
  ).textContent = `${uniqueNumbers.length} 個唯一元素`;
  document.getElementById(
    "method1Time"
  ).textContent = `耗時: ${duration1} 毫秒`;
  console.log(`方法一 (forEach & includes): ${duration1} 毫秒`); // 仍然可以在控制台輸出

  // 方法二 (set)
  // 開始計時
  const startTime2 = performance.now();
  const uniqueArray = [...new Set(numbers)];
  // 結束計時
  const endTime2 = performance.now();
  const duration2 = (endTime2 - startTime2).toFixed(3);

  // 更新 HTML
  document.getElementById(
    "method2Description"
  ).textContent = `${uniqueArray.length} 個唯一元素`;
  document.getElementById(
    "method2Time"
  ).textContent = `耗時: ${duration2} 毫秒`;
  console.log(`方法二 (使用 Set): ${duration2} 毫秒`); // 仍然可以在控制台輸出
});



/**
 * 以下放大陣列元素對比:
 * 輔助函式：生成一個包含隨機重複數字的陣列。
 * 用於效能測試。
 * @param {number} size - 陣列的目標大小。
 * @param {number} maxVal - 陣列中數字的最大值 (決定重複程度)。
 * @returns {number[]} 生成的陣列。
 */
function generateRandomArray(size, maxVal) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * maxVal) + 1);
  }
  return arr;
}

/**
 * 原始的去重函式 (O(n^2) 時間複雜度)。
 * @param {number[]} numbers - 包含重複數字的陣列。
 * @returns {number[]} 移除重複數字後的陣列。
 */
function getUniqueNumbersOriginal(numbers) {
  const uniqueNumbers = [];
  numbers.forEach((num) => {
    if (!uniqueNumbers.includes(num)) {
      uniqueNumbers.push(num);
    }
  });
  return uniqueNumbers;
}

/**
 * 高效的去重函式 (O(n) 時間複雜度)。
 * 利用 JavaScript Set 物件的特性。
 * @param {number[]} numbers - 包含重複數字的陣列。
 * @returns {number[]} 移除重複數字後的新陣列，保留原始插入順序。
 */
function getUniqueNumbersOptimized(numbers) {
  // 使用 Set 構造函數自動去重，然後用 Array.from 或展開運算符轉換回陣列
  return Array.from(new Set(numbers));
  // 或使用更簡潔的寫法： return [...new Set(numbers)];
}

// --- 效能測試 ---

console.log("--- 考題 9：陣列去重效能優化 ---");

// 定義不同規模的測試數據
const testSizes = [100, 1000, 10000, 50000, 100000]; 
const maxValue = 5000; // 數字範圍，影響重複程度

testSizes.forEach((size) => {
  console.log(`\n測試陣列大小: ${size}`);
  const testArray = generateRandomArray(size, maxValue);

  // 測試原始方法
  console.time(`原始方法 (O(N^2)) - ${size} 個元素`);
  const resultOriginal = getUniqueNumbersOriginal(testArray);
  console.timeEnd(`原始方法 (O(N^2)) - ${size} 個元素`);
  // console.log(`原始方法結果長度: ${resultOriginal.length}`); // 可選：檢查結果長度

  // 測試優化方法
  console.time(`優化方法 (O(N)) - ${size} 個元素`);
  const resultOptimized = getUniqueNumbersOptimized(testArray);
  console.timeEnd(`優化方法 (O(N)) - ${size} 個元素`);
  // console.log(`優化方法結果長度: ${resultOptimized.length}`); // 可選：檢查結果長度

  // 簡單驗證去重結果數量是否一致 (邏輯正確性)
  // 注意：實際應對比內容是否一致，但這裡只為快速驗證效能
  if (resultOriginal.length !== resultOptimized.length) {
    console.warn(
      `警告: 陣列大小 ${size} 的原始方法和優化方法結果長度不一致！可能存在邏輯錯誤。`
    );
  } else {
    console.log(`兩種方法去重後長度一致: ${resultOriginal.length}`);
  }
});
