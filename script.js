// --- Login logic ---
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "password123") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";
  } else {
    document.getElementById("message").innerText = "Invalid credentials!";
  }
}

// --- Check login on page load ---
if (window.location.pathname.endsWith("index.html")) {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
  }
}

// --- EMI Calculation via Flask API ---
async function calculateEMI() {
  const price = document.getElementById("price").value;
  const rate = document.getElementById("rate").value;
  const months = document.getElementById("months").value;

  const res = await fetch("http://127.0.0.1:5000/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price, rate, months }),
  });

  const data = await res.json();
  if (data.error) {
    document.getElementById("result").innerText = data.error;
  } else {
    document.getElementById("result").innerText =
      `Monthly EMI: ₹${data.emi} | Total Payable: ₹${data.total}`;
  }
}
