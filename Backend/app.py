from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()

    # Validate input
    if not all(k in data for k in ('price', 'rate', 'months')):
        return jsonify({"error": "Missing one or more required fields: price, rate, months"}), 400

    try:
        P = float(data['price'])
        R = float(data['rate']) / 12 / 100
        N = int(data['months'])

        if P <= 0 or R <= 0 or N <= 0:
            return jsonify({"error": "Values must be greater than zero"}), 400

        emi = (P * R * (1 + R)**N) / ((1 + R)**N - 1)
        total = emi * N

        return jsonify({
            "emi": round(emi, 2),
            "total": round(total, 2)
        }), 200

    except ValueError:
        return jsonify({"error": "Invalid numeric input"}), 400

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)