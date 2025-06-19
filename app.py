from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
# 啟用 CORS，允許所有來源訪問，以便前端頁面可以從不同的端口或本地檔案系統請求
CORS(app) 

# 定義產品數據
products_data = [
    {"id": 1, "name": "高性能筆記型電腦", "price": 35000},
    {"id": 2, "name": "人體工學無線滑鼠", "price": 800},
    {"id": 3, "name": "RGB 機械式鍵盤", "price": 2500},
    {"id": 4, "name": "4K UHD 27吋顯示器", "price": 7000},
    {"id": 5, "name": "USB-C 萬用轉接器", "price": 1200},
    {"id": 6, "name": "降噪耳機", "price": 4000},
    {"id": 7, "name": "智慧型手錶", "price": 9500},
    {"id": 8, "name": "行動電源", "price": 600},
    {"id": 9, "name": "外接硬碟 (2TB)", "price": 2800},
    {"id": 10, "name": "網路攝影機", "price": 1500},
]

# 路由: 回復商品清單列表
@app.route('/api/products', methods=['GET'])
def get_products():
    """
    提供商品列表的 API 端點。
    模擬網路延遲，並返回 JSON 格式的商品數據。
    """
    time.sleep(1)  # 模擬網路延遲 1 秒
    return jsonify({"products": products_data})

# 路由: 接收使用者名稱與電子郵件
@app.route('/submit', methods=['POST'])
def submit_form():
    """接收前端提交的數據表單(名稱或電子郵件)。
    解析 JSON 數據，打印控制台，並返回成功響應"""
    if not request.is_json:
        # 如果請求不是 JSON 格式，返回錯誤
        return jsonify({"status":"error","message":"請求必須是 JSON 格式"}), 400
    data = request.get_json() #獲取 JSON 數據
    name = data.get('name')
    email = data.get('email')

    #簡單數據驗證
    if not name or not email:
        return jsonify({"status":"error", "message":"名稱和電子郵件是必填欄位"}), 400
    if "@" not in email or "." not in email:
        return jsonify({"status":"error", "message":"電子郵件格式不正確"}), 400
    print(f"收到來自前端的提交: 名稱 - {name}, 電子郵件 - {email}") #打印到後端控制台
    time.sleep(0.5) #模擬處理延遲 0.5 秒
    # 返回成功響應
    return jsonify({"status":"success", "message":"資料已成功接收", "data":{"name":name, "email":email}}), 200

# 通用首頁路由
@app.route('/')
def home():
    return "後端伺服器運行中。請嘗試訪問 /api/products 或向 /submit 發送 POST 請求。"

if __name__ == '__main__':
    # 啟動 Flask 伺服器
    # host='0.0.0.0' 允許從任何 IP 訪問 (通常用於 Docker 或虛擬機)
    # port=5000 是 Flask 預設端口
    app.run(debug=True, host='127.0.0.1', port=5000)