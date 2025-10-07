from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
app.secret_key = "supersecretkey"  # required for session

# Serve static files (your HTML/CSS/JS)
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# --- Login endpoint ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Simple demo authentication
    if username == "admin" and password == "password123":
        session['logged_in'] = True
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Invalid credentials"}), 401

# --- Logout endpoint ---
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('logged_in', None)
    return jsonify({"success": True})

# --- EMI calculation endpoint ---
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

        return jsonify({"emi": round(emi,2), "total": round(total,2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
