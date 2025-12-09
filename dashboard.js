document.querySelectorAll(".payBtn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const amount = btn.getAttribute("data-amount");
    
    // Disable button during request
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "Processing...";

    try {
      console.log('Sending request to:', '/api/create-checkout-session');
      console.log('Amount:', amount);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get response text first
      const responseText = await response.text();
      console.log('Response body:', responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        alert(`Server returned invalid response. Status: ${response.status}\n\nResponse: ${responseText.substring(0, 200)}`);
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      }

      // Handle the response
      if (response.ok && data.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Error: ${data.error}`);
        btn.disabled = false;
        btn.textContent = originalText;
      } else {
        alert("Unable to start checkout session.");
        btn.disabled = false;
        btn.textContent = originalText;
      }

    } catch (error) {
      console.error("Request failed:", error);
      alert(`Network error: ${error.message}\n\nCheck the console for details.`);
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
});
