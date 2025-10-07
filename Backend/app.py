from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "supersecretkey"

# Allow credentials and multiple origins (local + GitHub Pages)
CORS(app, supports_credentials=True, origins=[
    "http://127.0.0.1:5500",   # local server
    "https://darpangoel.github.io"  # GitHub Pages
])

# --- Login ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == "admin" and password == "password123":
        session['logged_in'] = True
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Invalid username or password"}), 401

# --- Logout ---
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('logged_in', None)
    return jsonify({"success": True})

# --- EMI Calculation ---
@app.route('/calculate', methods=['POST'])
def calculate():
    if not session.get('logged_in'):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    if not all(k in data for k in ('price', 'rate', 'months')):
        return jsonify({"error": "Missing fields"}), 400

    try:
        P = float(data['price'])
        R = float(data['rate']) / 12 / 100
        N = int(data['months'])

        if P <= 0 or R <= 0 or N <= 0:
            return jsonify({"error": "Values must be > 0"}), 400

        emi = (P * R * (1 + R)**N) / ((1 + R)**N - 1)
        total = emi * N

        return jsonify({"emi": round(emi, 2), "total": round(total, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
