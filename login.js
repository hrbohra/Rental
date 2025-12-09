const form=document.getElementById("loginForm");
const errorMsg=document.getElementById("errorMsg");
form.addEventListener("submit",e=>{
 e.preventDefault();
 const email=document.getElementById("email").value;
 const password=document.getElementById("password").value;
 if(email==="alihatem@gmail" && password==="aliultra@123"){
   window.location.href="dashboard.html";
 } else { errorMsg.textContent="Invalid credentials."; }
});