from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    try:
        P = float(data['price'])
        R = float(data['rate']) / 12 / 100
        N = int(data['months'])
        emi = (P * R * (1 + R)**N) / ((1 + R)**N - 1)
        total = emi * N
        return jsonify({"emi": round(emi, 2), "total": round(total, 2)})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
