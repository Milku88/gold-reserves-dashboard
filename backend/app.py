from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder='../frontend')
CORS(app)

# Załaduj dane
with open('data.json', 'r', encoding='utf-8') as f:
    GOLD_DATA = json.load(f)

@app.route('/api/gold-reserves')
def get_gold_reserves():
    return jsonify(GOLD_DATA)

# Serwuj frontend
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../frontend', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))