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
      credentials: "include" // important for session cookies
    });

    const data = await res.json();

    if (!res.ok) {
      // Show proper error message from server
      messageBox.innerText = "❌ " + (data.error || "Invalid username or password!");
      return;
    }

    if (data.success) {
      window.location.href = "emi.html";
    } else {
      messageBox.innerText = "❌ " + (data.error || "Invalid username or password!");
    }
  } catch (err) {
    console.error("Login error:", err);
    messageBox.innerText = "❌ Server error!";
  }
}

// --- Logout ---
async function logout() {
  try {
    const res = await fetch("http://127.0.0.1:5000/logout", {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      window.location.href = "login.html";
    } else {
      alert("Logout failed!");
    }
  } catch (err) {
    console.error("Logout error:", err);
    alert("Server error during logout!");
  }
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

    if (!res.ok) {
      if (res.status === 401) {
        // Not logged in
        window.location.href = "login.html";
      } else {
        resultBox.innerText = "⚠️ " + (data.error || "Invalid input!");
      }
      resultBox.classList.add("visible");
      return;
    }

    // Success
    resultBox.innerText = `💰 Monthly EMI: ₹${data.emi} | Total Payable: ₹${data.total}`;
    resultBox.classList.add("visible");

  } catch (err) {
    console.error("EMI calculation error:", err);
    resultBox.innerText = "⚠️ Server error!";
    resultBox.classList.add("visible");
  }
}
