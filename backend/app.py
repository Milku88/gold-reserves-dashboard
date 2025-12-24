from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import yfinance as yf

app = Flask(__name__, static_folder='../frontend')
CORS(app)

# Załaduj dane o rezerwach
with open('data.json', 'r', encoding='utf-8') as f:
    GOLD_RESERVES = json.load(f)

@app.route('/api/gold-reserves')
def get_gold_reserves():
    return jsonify(GOLD_RESERVES)

@app.route('/api/gold-price')
def get_gold_price():
    try:
        ticker = yf.Ticker("GC=F")  # Futures na złoto
        hist = ticker.history(period="1d")
        price = hist['Close'].iloc[-1] if not hist.empty else 2350.0  # fallback
    except:
        price = 2350.0
    return jsonify({"price": round(price, 2)})

# Serwuj frontend
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../frontend', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))