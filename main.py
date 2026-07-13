from flask import Flask, request, jsonify
from table import Hero
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/hero_data', methods=['POST'])
def hero_data():
    # 1. Получаем JSON, который прислал JavaScript
    data = request.get_json()
    
    new_hero = Hero(name=data['name'], race=data['race'], character_class=data['characterClass'], lvl=data['lvl'], destribition=data['description'], skills=data['skills'])
    return jsonify({"status": "success", "received": data}), 200

if __name__ == '__main__':
    app.run(debug=True)
