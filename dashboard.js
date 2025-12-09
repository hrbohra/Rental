document.querySelectorAll(".payBtn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const amount = btn.getAttribute("data-amount");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        alert(`Server error: ${response.status}. Check console for details.`);
        return;
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert("Unable to start checkout session.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Network error. Please check your connection and try again.");
    }
  });
});
