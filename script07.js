/**
 * 輔助函式：為個位數字補零。
 * 如果數字小於 10，在其前面添加 '0'。
 *
 * @param {number} num - 需要補零的數字。
 * @returns {string} 補零後的字串。
 *
 * @example
 * padZero(5); // "05"
 * padZero(12); // "12"
 */
function padZero(num) {
    return num < 10 ? '0' + num : String(num);
}

/**
 * 將 Unix 時間戳記（秒）轉換為 'YYYY-MM-DD HH:MM:SS' 格式的字串。
 *
 * @param {number} unixTimestamp - 以秒為單位的 Unix 時間戳記。
 * @returns {string} 格式化後的時間字串。
 *
 * @example
 * // For unixTimestamp = 1672531199 (對應 2023-01-01 23:59:59 UTC+9)
 * // 返回值可能因時區而異，但格式固定。
 * formatUnixTimestamp(1672531199); // "2023-01-01 23:59:59" (假設本地時區為 UTC+9)
 */
function formatUnixTimestamp(unixTimestamp) {
    // 將秒級時間戳記轉換為毫秒級，因為 Date 物件構造函數需要毫秒
    const date = new Date(unixTimestamp * 1000);
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1); // getMonth() 返回 0-11
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 獲取當前時間戳記 (秒)
const currentUnixTimestamp = Math.floor(Date.now() / 1000);
// 確保 DOM 已經載入
document.addEventListener('DOMContentLoaded',function(){
    // 獲取要顯示的元素
    const time = formatUnixTimestamp(currentUnixTimestamp)
    // 如果元素存在，則更新其內容
    const displayElement = document.getElementById('displayTime');
    if(displayElement){
        displayElement.textContent = time;
    }
})
console.log(`當前時間戳記: ${currentUnixTimestamp}`);
console.log(formatUnixTimestamp(currentUnixTimestamp));