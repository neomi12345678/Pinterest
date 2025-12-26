function clearMain() {
  const main = document.querySelector("main");
  if (main) main.innerHTML = "";
}
//log-out למחיקת משתמש שיוצא מהחשבון שלו

document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();

  // שליפת המשתמש מה-localStorage
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user && user.id) {
    // שליחת בקשה למחיקת המשתמש לפי ה-ID
    fetch(`http://localhost:3000/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      },
    })
      .then(response => {
        if (!response.ok) throw new Error("מחיקה נכשלה");
      })
      .catch(err => {
        console.error("שגיאה במחיקה:", err);
      });
  }

  // מחיקת נתוני המשתמש מה-localStorage
  localStorage.removeItem("currentUser");

  // הפניה לעמוד ההתחברות
  window.location.href = "../login-register/login-register.html";
});

// אירוע זה מתבצע כאשר הדף נטען, הוא אחראי על הצגת הפינים לפי חיפוש המשתמש
document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.querySelector(".search-bar input");
  const searchButton = document.querySelector(".search-bar button");
  // הצגת הפינים לפי הערך של החיפוש
  searchButton.addEventListener("click", () => {
    const term = searchInput.value.trim();
    if (term) {
      saveSearchTerm(term);
      clearMain();
      showPinsForSearch(term);
    }
  });
  //אותה אפשרות לסינון ע"י לחיצת enter
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const term = searchInput.value.trim();
      if (term) {
        saveSearchTerm(term);
        clearMain();
        showPinsForSearch(term);
      }
    }
  });

});
// פונקציה זו משמשת להצגת פינים לפי חיפוש  של המשתמש
let pinsSearchOffset = 0;
const pinsSearchLimit = 20;

function showPinsForSearch(term, loadMore = false) {
  if (!loadMore) {
    pinsSearchOffset = 0; // איפוס באתחול של חיפוש חדש
  }
// //  של המשתמש שליחת בקשה לשרת לקבלת פינים לפי תגיות
  fetch("http://localhost:3000/pins/pins-by-tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tags: [term], limit: pinsSearchLimit, offset: pinsSearchOffset }),
  })
    .then(res => res.json())
    .then(pins => {
      if (!pins || pins.length === 0) return;

      const main = document.querySelector("main");
      if (!loadMore) clearMain();// ריקון ה-main לפני הצגת תוצאות חדשות

      let resultsDiv = document.getElementById("searchResults");
      if (!resultsDiv) {
        resultsDiv = document.createElement("div");
        resultsDiv.id = "searchResults";
        resultsDiv.innerHTML = `<h3>תוצאות חיפוש עבור: ${term}</h3>`;
        main.appendChild(resultsDiv);
      }

      let grid = resultsDiv.querySelector(".pins-grid");
      if (!grid) {
        grid = document.createElement("div");
        grid.className = "pins-grid";
        resultsDiv.appendChild(grid);
      }

      pins.forEach(pin => {// יצירת כרטיס פין
        const card = document.createElement("div");
        card.dataset.pinId = pin.id;
        card.style.border = "1px solid #ccc";
        card.style.padding = "10px";
        card.style.borderRadius = "10px";
        card.style.backgroundColor = "#fff";
        card.style.display = "flex";
        card.style.flexDirection = "column";

        const saveButton = document.createElement("button");
        saveButton.textContent = "שמור לאזור אישי";
        saveButton.style.marginTop = "auto";
        saveButton.style.padding = "5px 10px";
        saveButton.style.backgroundColor = "#ce0220";
        saveButton.style.color = "white";
        saveButton.style.border = "none";
        saveButton.style.cursor = "pointer";
        saveButton.style.borderRadius = "5px";

        saveButton.addEventListener("click", () => {// הוספת פין לאזור האישי של המשתמש
          const user = JSON.parse(localStorage.getItem('currentUser'));
          if (!user) return alert("עליך להתחבר");
          const savedPinsKey = `savedPins_${user.id}`;// יצירת מפתח ייחודי לאזור האישי של המשתמש
          let savedPins = JSON.parse(localStorage.getItem(savedPinsKey)) || [];
          savedPins.push(pin.id);// הוספת הפין לאזור האישי
          localStorage.setItem(savedPinsKey, JSON.stringify(savedPins));// שמירת הפינים המעודכנים ב-localStorage
        });

        card.innerHTML = `
        <img src="http://localhost:3000/${pin.image_url}" alt="${pin.title}" style="width: 100%; height: 180px; object-fit: contain; border-bottom: 1px solid #eee; border-radius: 8px 8px 0 0;">
        <h4 style="margin: 10px 0 5px 0; font-size: 16px; color: #444;">${pin.title}</h4>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">${pin.description || ''}</p>
      `;
        card.appendChild(saveButton);

        addLikeButtonsToPins(card);

        grid.appendChild(card);
      });

      pinsSearchOffset += pins.length;// עדכון האופסט כדי להציג את הפינים הבאים בחיפוש הבא

      // כפתור 'הצג עוד'
      if (pins.length === pinsSearchLimit) {// אם יש עוד פינים להציג
        let loadMoreBtn = document.getElementById("loadMoreSearchPinsBtn");
        if (!loadMoreBtn) {
          loadMoreBtn = document.createElement("button");
          loadMoreBtn.id = "loadMoreSearchPinsBtn";
          loadMoreBtn.textContent = "הצג עוד";
          loadMoreBtn.style.margin = "20px auto";
          loadMoreBtn.style.display = "block";
          loadMoreBtn.style.padding = "10px 20px";
          loadMoreBtn.style.backgroundColor = "#ce0220";
          loadMoreBtn.style.color = "white";
          loadMoreBtn.style.border = "none";
          loadMoreBtn.style.borderRadius = "5px";
          loadMoreBtn.style.cursor = "pointer";

          loadMoreBtn.addEventListener("click", () => {// הוספת ארוע ללחיצה על הכפתור בכדי שיוכל להוסיף עוד פינים 20 הבאים בתור
            showPinsForSearch(term, true);
          });

          main.appendChild(loadMoreBtn);
        }
      } else {
        const loadMoreBtn = document.getElementById("loadMoreSearchPinsBtn");
        if (loadMoreBtn) loadMoreBtn.remove();// אם לא התקבלו עוד פינים, הסתר את כפתור 'הצג עוד' אם קיים
      }
    })
    .catch(err => {
      console.error("שגיאה בהצגת פינים:", err);
    });
}



//פונצקיה זו משמשת לשמירת חיפושי המשתמש בlocal storage
function saveSearchTerm(term) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;
  const key = `recentSearches_${user.id}`;
  const recentSearches = JSON.parse(localStorage.getItem(key)) || [];
  if (!recentSearches.includes(term)) {
    recentSearches.unshift(term);// הוספת החיפוש החדש לתחילת הרשימ
    localStorage.setItem(key, JSON.stringify(recentSearches));
  }
}



//הוספת לייקים
function addLikeButtonsToPins(card) {

  const pinId = card.dataset.pinId;// שליפת ה-ID של הפין מהאלמנט
  if (!pinId) return;

  const likeButton = document.createElement("button");
  likeButton.textContent = "❤️ לייק";
  likeButton.className = "like-button";
  likeButton.style.marginTop = "10px";
  likeButton.style.padding = "5px 10px";
  likeButton.style.border = "1px solid #ccc";
  likeButton.style.borderRadius = "5px";
  likeButton.style.cursor = "pointer";
  likeButton.style.backgroundColor = "#f7f7f7";
  likeButton.style.display = "block";

  const likeCountSpan = document.createElement("span");
  likeCountSpan.className = "like-count";
  likeCountSpan.style.display = "block";
  likeCountSpan.style.marginTop = "5px";
  likeCountSpan.style.color = "#e60073";
  likeCountSpan.style.fontSize = "14px";
  likeCountSpan.textContent = "❤️ ..."; // טעינה ראשונית

  // הצגת מספר הלייקים הנוכחי
  fetch(`http://localhost:3000/likes/count/${pinId}`)
    .then(res => res.json())
    .then(data => {
      console.log("תשובה מהשרת ללייקים:", data); // הוסיפי שורת לוג זו
      likeCountSpan.textContent = `❤️ ${data.likeCount} לייקים`;
    })
    .catch(() => {
      likeCountSpan.textContent = "❤️ שגיאה";
    });

  likeButton.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return alert("עליך להתחבר כדי לעשות לייק");
// שליחת בקשה ללייק הפין
    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, pin_id: pinId })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {

        // עדכון מיידי של כמות הלייקים
        return fetch(`http://localhost:3000/likes/count/${pinId}`);
      })
      .then(res => res.json())
      .then(data => {
        likeCountSpan.textContent = `❤️ ${data.likeCount} לייקים`;
      })
      .catch(() => {
        alert("שגיאה בשליחת הלייק");
      });
  });

  card.appendChild(likeButton);
  card.appendChild(likeCountSpan);
}
