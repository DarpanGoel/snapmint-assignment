function calculateEMI() {
    let P = parseFloat(document.getElementById("price").value);
    let annualRate = parseFloat(document.getElementById("rate").value);
    let N = parseInt(document.getElementById("months").value);
  
    if (!P || !annualRate || !N || P <= 0 || annualRate <= 0 || N <= 0) {
      document.getElementById("result").innerText = "Please enter valid inputs.";
      return;
    }
  
    let R = annualRate / (12 * 100); // monthly interest rate
    let EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    let total = EMI * N;
  
    document.getElementById("result").innerText =
      `Monthly EMI: ₹${EMI.toFixed(2)} | Total Payable: ₹${total.toFixed(2)}`;
  }
  