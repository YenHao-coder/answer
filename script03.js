document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('submission-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const responseMessageDiv = document.getElementById('response-message');
    const nameErrorDiv = document.getElementById('name-error');
    const emailErrorDiv = document.getElementById('email-error');

    // 後端 Flask 伺服器的提交路由 URL
    const SUBMIT_URL = 'http://127.0.0.1:5000/submit';

    /**
     * 清除所有錯誤訊息和樣式。
     */
    function clearErrors() {
        nameInput.classList.remove('invalid');
        emailInput.classList.remove('invalid');
        nameErrorDiv.textContent = '';
        emailErrorDiv.textContent = '';
        responseMessageDiv.textContent = '';
        responseMessageDiv.className = ''; // 清除所有樣式類
    }

    /**
     * 顯示錯誤訊息和對應輸入框的無效樣式。
     * @param {HTMLElement} inputElement - 發生錯誤的 input 元素。
     * @param {HTMLElement} errorDiv - 顯示錯誤訊息的 div 元素。
     * @param {string} message - 要顯示的錯誤訊息。
     */
    function showInputError(inputElement, errorDiv, message) {
        inputElement.classList.add('invalid');
        errorDiv.textContent = message;
    }

    /**
     * 驗證表單輸入。
     * @param {string} name - 用戶名稱。
     * @param {string} email - 用戶電子郵件。
     * @returns {boolean} 如果驗證成功返回 true，否則返回 false。
     */
    function validateForm(name, email) {
        clearErrors(); // 每次驗證前先清除之前的錯誤

        let isValid = true;

        if (!name.trim()) {
            showInputError(nameInput, nameErrorDiv, '名稱不能為空。');
            isValid = false;
        }

        if (!email.trim()) {
            showInputError(emailInput, emailErrorDiv, '電子郵件不能為空。');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // 簡單的郵件格式驗證
            showInputError(emailInput, emailErrorDiv, '請輸入有效的電子郵件格式。');
            isValid = false;
        }

        return isValid;
    }

    /**
     * 處理表單提交，將數據發送到後端。
     * @param {Event} event - 提交事件物件。
     */
    async function handleSubmit(event) {
        event.preventDefault(); // 阻止表單默認的提交行為 (頁面刷新)

        const name = nameInput.value;
        const email = emailInput.value;

        // 前端驗證
        if (!validateForm(name, email)) {
            responseMessageDiv.textContent = '請檢查輸入欄位。';
            responseMessageDiv.classList.add('error');
            return; // 驗證失敗，停止提交
        }

        // 顯示提交中狀態
        submitBtn.disabled = true;
        responseMessageDiv.textContent = '提交中...請稍候';
        responseMessageDiv.className = ''; // 清除之前的 success/error 類
        responseMessageDiv.classList.add('info'); // 可選的提示信息類

        try {
            const response = await fetch(SUBMIT_URL, {
                method: 'POST', // 指定為 POST 請求
                headers: {
                    'Content-Type': 'application/json' // 告知伺服器發送的是 JSON
                },
                body: JSON.stringify({ name, email }) // 將 JS 物件轉換為 JSON 字串
            });

            const result = await response.json(); // 解析伺服器返回的 JSON

            if (response.ok) { // HTTP 狀態碼 200-299 之間為成功
                responseMessageDiv.textContent = `提交成功！伺服器訊息: ${result.message}`;
                responseMessageDiv.classList.add('success');
                // 成功後可選地清除表單
                nameInput.value = '';
                emailInput.value = '';
            } else {
                // 如果 HTTP 狀態碼表示錯誤 (例如 400, 500)
                const errorMessage = result.message || '未知錯誤';
                responseMessageDiv.textContent = `提交失敗: ${errorMessage}`;
                responseMessageDiv.classList.add('error');
            }
        } catch (error) {
            // 捕獲網路錯誤或 JSON 解析錯誤
            console.error('提交失敗:', error);
            responseMessageDiv.textContent = `網路錯誤或伺服器無響應: ${error.message}`;
            responseMessageDiv.classList.add('error');
        } finally {
            submitBtn.disabled = false; // 無論成功或失敗，最後都啟用按鈕
        }
    }

    // 綁定表單提交事件
    form.addEventListener('submit', handleSubmit);

    console.log("頁面載入完成。請確保後端伺服器 (app.py) 正在運行，然後填寫表單並點擊 '提交'。");
});