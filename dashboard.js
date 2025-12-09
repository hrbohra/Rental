document.querySelectorAll(".payBtn").forEach((btn)=>{
 btn.addEventListener("click",async ()=>{
  const amount=btn.getAttribute("data-amount");

  const response=await fetch("/api/create-checkout-session",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ amount })
  });

  const data=await response.json();
  if(data.url){ window.location.href=data.url; }
  else { alert("Unable to start checkout session."); }
 });
});