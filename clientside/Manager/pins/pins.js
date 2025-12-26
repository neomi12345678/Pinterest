document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pinsContainer");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  let offset = 0;
  const limit = 20;

  function loadPins() {
    fetch(`http://localhost:3000/pins?limit=${limit}&offset=${offset}`)
      .then(res => res.json())
      .then(pins => {

        if (pins.length === 0) {
          loadMoreBtn.disabled = true;
          loadMoreBtn.textContent = "אין עוד פינים לטעינה";
          return;
        }
        pins.forEach(pin => {
          const card = document.createElement("div");
          card.className = "pin-card";

          card.innerHTML = `
            <img src="http://localhost:3000/${pin.image_url}" alt="${pin.title}" style="width: 100%; height: 180px; object-fit: contain; border-bottom: 1px solid #eee; border-radius: 8px 8px 0 0;">
            <h3>${pin.title || "ללא כותרת"}</h3>
            <p><strong>מזהה:</strong> ${pin.id}</p>
            <button onclick="deletePin(${pin.id}, this)">🗑️ מחק</button>
          `;

          container.appendChild(card);

        });

        offset += limit;
      })
      .catch(err => {
        console.error("שגיאה בשליפת פינים:", err);
      });
  }

  loadMoreBtn.addEventListener("click", () => {
    loadPins();
  });

  // טען את 20 הראשונים אוטומטית
  loadPins();
});

function deletePin(pinId, buttonElement) {
  if (!confirm("האם את בטוחה שברצונך למחוק את הפין?")) return;

  fetch(`http://localhost:3000/pins/${pinId}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("המחיקה נכשלה");
      buttonElement.closest(".pin-card").remove();
    })
    .catch(err => {
      console.error("שגיאה במחיקה:", err);
      alert("אירעה שגיאה בעת המחיקה");
    });
}
