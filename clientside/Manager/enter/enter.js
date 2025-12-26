document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error");
const email = "";

  fetch("http://localhost:3000/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
})

    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.message || "סיסמה שגויה");
        });
      }
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("adminToken", data.token); // שמירת הטוקן
      window.location.href = "../home/home.html"; // מעבר לעמוד הבא
    })
    .catch((err) => {
      errorMessage.textContent = err.message;
    });
});
