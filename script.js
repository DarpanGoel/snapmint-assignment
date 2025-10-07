// --- Login ---
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageBox = document.getElementById("message");

  try {
    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    });
    const data = await res.json();

    if (data.success) {
      window.location.href = "emi.html";
    } else {
      messageBox.innerText = "❌ " + data.error;
    }
  } catch (err) {
    messageBox.innerText = "❌ Server error!";
  }
}

// --- Logout ---
async function logout() {
  await fetch("http://127.0.0.1:5000/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "login.html";
}

// --- EMI Calculation ---
async function calculateEMI() {
  const price = document.getElementById("price").value;
  const rate = document.getElementById("rate").value;
  const months = document.getElementById("months").value;
  const resultBox = document.getElementById("result");

  try {
    const res = await fetch("http://127.0.0.1:5000/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ price, rate, months })
    });
    const data = await res.json();

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }

    if (data.error) {
      resultBox.innerText = "⚠️ " + data.error;
    } else {
      resultBox.innerText = `💰 Monthly EMI: ₹${data.emi} | Total Payable: ₹${data.total}`;
    }
  } catch (err) {
    resultBox.innerText = "⚠️ Server error!";
  }

  resultBox.classList.add("visible");
}
