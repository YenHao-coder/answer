document.addEventListener('DOMContentLoaded', () => {
    const loadProductsBtn = document.getElementById('load-products-btn');
    const productList = document.getElementById('product-list');
    const statusMessage = document.getElementById('status-message');

    // 後端 API 的實際 URL
    const API_URL = 'http://127.0.0.1:5000/api/products'; 

    /**
     * 從實際後端伺服器的 /api/products 路由拉取商品數據。
     * 使用 fetch API 進行非同步請求。
     * @returns {Promise<Object>} 包含產品列表的 Promise。
     */
    async function fetchProductsFromBackend() {
        statusMessage.textContent = '載入中...請稍候';
        loadProductsBtn.disabled = true; // 禁用按鈕防止重複點擊

        try {
            const response = await fetch(API_URL);

            // 檢查 HTTP 響應是否成功 (例如 200 OK)
            if (!response.ok) {
                // 如果響應不成功，拋出錯誤
                const errorText = await response.text(); // 嘗試讀取錯誤訊息
                throw new Error(`HTTP 錯誤! 狀態: ${response.status}. 訊息: ${errorText || '未知錯誤'}`);
            }

            const data = await response.json();
            return data; // 返回解析後的 JSON 數據
        } catch (error) {
            // 捕獲網路錯誤或 JSON 解析錯誤
            console.error('Fetch 請求失敗:', error);
            throw new Error(`無法連接到伺服器或數據格式錯誤: ${error.message}`);
        }
    }

    /**
     * 在頁面上顯示商品列表。
     * @param {Array<Object>} products - 包含商品物件的陣列。
     */
    function displayProducts(products) {
        // 清除舊的列表內容
        productList.innerHTML = ''; 

        if (products && products.length > 0) {
            products.forEach(product => {
                const listItem = document.createElement('li');
                const productName = document.createElement('strong');
                productName.textContent = product.name;
                
                const productPrice = document.createElement('span');
                // 使用 toLocaleString 格式化貨幣，例如 NT$ 35,000
                productPrice.textContent = `NT$ ${product.price.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`; 
                
                listItem.appendChild(productName);
                listItem.appendChild(productPrice);
                productList.appendChild(listItem);
            });
        } else {
            const noDataMessage = document.createElement('li');
            noDataMessage.textContent = '目前沒有商品資料。';
            productList.appendChild(noDataMessage);
        }
        statusMessage.textContent = ''; // 清除狀態訊息
        loadProductsBtn.disabled = false; // 重新啟用按鈕
    }

    /**
     * 處理載入商品資料的事件。
     */
    async function handleLoadProducts() {
        try {
            const data = await fetchProductsFromBackend();
            // 假設後端返回的 JSON 結構是 {"products": [...]}
            displayProducts(data.products); 

        } catch (error) {
            console.error('處理商品資料失敗:', error);
            statusMessage.textContent = `載入失敗: ${error.message}`;
            productList.innerHTML = '<li>載入商品時發生錯誤，請檢查後端伺服器或網路連接。</li>';
        } finally {
            loadProductsBtn.disabled = false; // 無論成功或失敗，最後都啟用按鈕
        }
    }

    // 綁定按鈕點擊事件
    loadProductsBtn.addEventListener('click', handleLoadProducts);

    console.log("頁面載入完成。請確保後端伺服器 (app.py) 正在運行，然後點擊 '載入商品資料' 按鈕。");
});