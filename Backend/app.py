from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allows requests from frontend

@app.route('/calculate', methods=['POST'])
def calculate_emi():
    data = request.get_json()
    P = float(data.get('price', 0))
    annualRate = float(data.get('rate', 0))
    N = int(data.get('months', 0))

    if P <= 0 or annualRate <= 0 or N <= 0:
        return jsonify({'error': 'Invalid inputs'}), 400

    R = annualRate / (12 * 100)
    EMI = (P * R * (1 + R)**N) / ((1 + R)**N - 1)
    total = EMI * N

    return jsonify({
        'emi': round(EMI, 2),
        'total': round(total, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
