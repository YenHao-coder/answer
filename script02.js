document.addEventListener('DOMContentLoaded', initializeShoppingCart);

/**
 * 驗證輸入值是否為大於等於 0 的有效整數。
 * 如果無效 (例如小於 0 或非整數)，則返回 null。
 * @param {string} value - 輸入的字串值。
 * @returns {number|null} - 有效的整數值或 null。
 */
function validateQuantityInput(value) {
    const num = parseInt(value, 10); // 嘗試解析為整數

    if (isNaN(num)) {
        // 如果不是數字，則為無效
        return null;
    }

    if (num < 0) {
        // 數量小於 0，彈窗提示並返回 null
        alert("數量必須大於 0");
        return null;
    }

    // 如果是小數，則取整 (但題目要求正整數，這裡確保是整數)
    if (num !== parseFloat(value)) {
        // 如果輸入的是小數，也視為無效或根據需求取整
        // 為了嚴格符合「正整數」且避免模糊，這裡選擇提示並重置
        alert("數量必須是整數");
        return null;
    }

    return num; // 返回有效的整數值
}

/**
 * 初始化購物車功能。
 * - 設置購物車數量顯示元素。
 * - 設置數量輸入欄位和 "+" "-" 按鈕。
 * - 為 "+" 和 "-" 按鈕綁定點擊事件，改變輸入欄位數值 (最小值為 0)。
 * - 驗證輸入欄位數值，確保為大於等於 0 的整數，並處理無效輸入。
 * - 為「加入購物車」按鈕綁定點擊事件，增加購物車數量並更新顯示。
 */
function initializeShoppingCart() {
    const cartTotalQuantitySpan = document.getElementById('cart-total-quantity');
    const plusBtn = document.querySelector('.plus-btn');
    const minusBtn = document.querySelector('.minus-btn');
    const quantityInput = document.querySelector('.quantity-input');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    let cartCount = 0; // 初始化購物車總數

    // 初始顯示購物車數量
    updateCartDisplay(cartCount);

    // 更新購物車數量顯示在頁面上
    function updateCartDisplay(count) {
        cartTotalQuantitySpan.textContent = count;
    }

    // 更新 input 欄位數值並觸發驗證
    function updateInputQuantity(newQuantity) {
        // 確保新數量不小於 0
        quantityInput.value = Math.max(0, newQuantity);
        // 立即觸發驗證，處理用戶手動輸入或加減後的邏輯
        handleQuantityInput();
    }

    // 處理 "+" 按鈕點擊
    plusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(quantityInput.value, 10);
        if (isNaN(currentQuantity)) currentQuantity = 0; // 如果是空或其他非數字，預設為0
        updateInputQuantity(currentQuantity + 1);
    });

    // 處理 "-" 按鈕點擊
    minusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(quantityInput.value, 10);
        if (isNaN(currentQuantity)) currentQuantity = 0; // 如果是空或其他非數字，預設為0
        updateInputQuantity(currentQuantity - 1); // Math.max(0, ...) 在 updateInputQuantity 內部處理
    });

    // 處理 input 欄位手動輸入或通過按鈕改變後的驗證
    function handleQuantityInput() {
        const inputValue = quantityInput.value;
        const validatedQuantity = validateQuantityInput(inputValue);

        if (validatedQuantity === null) {
            // 輸入無效，重置為 1
            quantityInput.value = 1;
        } else {
            // 輸入有效，確保顯示的是有效值
            quantityInput.value = validatedQuantity;
        }
        // 無論有效與否，此處的 cartCount 並不直接與 input 綁定
        // cartCount 只有在「加入購物車」時才會累加
    }

    // 監聽 input 欄位變化
    quantityInput.addEventListener('input', handleQuantityInput);
    // 監聽失去焦點事件，確保最終值符合規範
    quantityInput.addEventListener('blur', () => {
        // 如果失去焦點時值為空，則設為 1 (符合正整數，且避免加入0個)
        if (quantityInput.value === '' || parseInt(quantityInput.value, 10) < 0 || isNaN(parseInt(quantityInput.value, 10))) {
            quantityInput.value = 1;
        }
        handleQuantityInput(); // 再次驗證以確保數值正確顯示
    });

    // 處理「加入購物車」按鈕點擊
    addToCartBtn.addEventListener('click', () => {
        const quantityToAdd = parseInt(quantityInput.value, 10);
        
        // 再次驗證加入購物車的數量是否符合要求
        // 如果是0，彈窗提示不讓加入，而不是彈窗說「數量必須大於0」
        if (quantityToAdd === 0) {
            alert("請輸入大於 0 的數量才能加入購物車！");
            quantityInput.value = 1; // 重置為1
            return;
        }
        
        const finalQuantity = validateQuantityInput(String(quantityToAdd)); // 確保是 string 傳入

        if (finalQuantity !== null && finalQuantity > 0) { // 確保是有效的正整數才加入
            cartCount += finalQuantity;
            updateCartDisplay(cartCount);
            alert(`已將 ${finalQuantity} 個商品加入購物車！總數：${cartCount}`);
            quantityInput.value = 1; // 加入後重置數量為 1
        } else {
            // 如果數量無效（例如手動輸入了負數但未立即處理，或 0），再次提示並重置
            // validateQuantityInput 會處理小於0的彈窗
            if (finalQuantity === 0) {
                 alert("請輸入大於 0 的數量才能加入購物車！");
            }
            quantityInput.value = 1; // 重置為 1
        }
    });
}