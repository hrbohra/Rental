document.querySelectorAll(".payBtn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const amount = btn.getAttribute("data-amount");
    
    // Disable button during request
    btn.disabled = true;
    btn.textContent = "Processing...";

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });

      // Get response text first to handle both JSON and HTML responses
      const responseText = await response.text();
      
      // Log the actual response for debugging
      console.log("Response status:", response.status);
      console.log("Response body:", responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        console.error("Raw response:", responseText);
        alert("Server returned an invalid response. Check the console for details.");
        btn.disabled = false;
        btn.textContent = btn.getAttribute("data-original-text");
        return;
      }

      // Handle the JSON response
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Error: ${data.error}`);
        btn.disabled = false;
        btn.textContent = btn.getAttribute("data-original-text");
      } else {
        alert("Unable to start checkout session.");
        btn.disabled = false;
        btn.textContent = btn.getAttribute("data-original-text");
      }

    } catch (error) {
      console.error("Request failed:", error);
      alert("Network error. Please check your connection and try again.");
      btn.disabled = false;
      btn.textContent = btn.getAttribute("data-original-text");
    }
  });
});

// Store original button text
document.querySelectorAll(".payBtn").forEach((btn) => {
  btn.setAttribute("data-original-text", btn.textContent);
});
