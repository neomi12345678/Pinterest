let offset = 0;
const limit = 20;

function loadUsers() {
  fetch(`http://localhost:3000/users?limit=${limit}&offset=${offset}`)
    .then(res => res.json())
    .then(users => {
      if (users.length === 0) {
        // אין עוד משתמשים לטעון
        document.getElementById("loadMoreBtn").disabled = true;
        return;
      }
      const container = document.getElementById("usersContainer");
      users.forEach(user => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.innerHTML = `
          <h3>${user.name || "שם לא זמין"}</h3>
          <p><strong>אימייל:</strong> ${user.email}</p>
          <p><strong>מספר מזהה:</strong> ${user.id}</p>
          <button onclick="deleteUser(${user.id}, this)">🗑️ מחק</button>
        `;
        container.appendChild(card);
      });
      offset += limit; // עדכון האופסט לטעינה הבאה
    })
    .catch(err => {
      console.error("שגיאה בשליפת משתמשים:", err);
    });
}

// טען את המשתמשים בפעם הראשונה
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  // מאזין לכפתור "הצג עוד"
  document.getElementById("loadMoreBtn").addEventListener("click", loadUsers);
});

function deleteUser(userId, buttonElement) {
  if (!confirm("האם את בטוחה שברצונך למחוק את המשתמש?")) return;

  fetch(`http://localhost:3000/users/${userId}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("המחיקה נכשלה");
      buttonElement.closest(".user-card").remove();
    })
    .catch(err => {
      console.error("שגיאה במחיקה:", err);
      alert("אירעה שגיאה בעת המחיקה");
    });
}
