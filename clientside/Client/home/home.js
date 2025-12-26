// פונקציה לריקון ה-main
function clearMain() {
  const main = document.querySelector("main");
  main.innerHTML = "";
}
  //כשדף נטען להראות את כל החיפושים האחרונים של המשתמשמ הנוכחי
  document.addEventListener("DOMContentLoaded", () => {
    showPinsFromRecentSearches();
  addLikeButtonsToPins();
       
  
  });
let pinsOffset = 0;
const pinsLimit = 20;
// פונקציה להצגת פינים לפי חיפושים אחרונים של המשתמש
// אם אין חיפושים אחרונים, תציג את כל הפינים
function showPinsFromRecentSearches(loadMore = false) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  if (!loadMore) {
    pinsOffset = 0;  // אתחול בטעינה ראשונית
  }

  const key = `recentSearches_${user.id}`;
  const recentSearches = JSON.parse(localStorage.getItem(key)) || [];
  const url = recentSearches.length === 0
    ? `http://localhost:3000/pins?limit=${pinsLimit}&offset=${pinsOffset}`// אם אין חיפושים אחרונים, נציג את כל הפינים
    : "http://localhost:3000/pins/pins-by-tags";// אם יש חיפושים אחרונים, נשלח בקשה לפינים לפי תגיות

  const options = recentSearches.length === 0
    ? { method: "GET" }
    : {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: recentSearches, limit: pinsLimit, offset: pinsOffset })
      };

  fetch(url, options)
    .then(res => res.json())
    .then(pins => {
      if (!pins || pins.length === 0) return;

      const main = document.querySelector("main");
      if (!loadMore) clearMain();

      let resultsDiv = document.getElementById("searchResults");
      if (!resultsDiv) {
        resultsDiv = document.createElement("div");
        resultsDiv.id = "searchResults";
        if (recentSearches.length !== 0)
          resultsDiv.innerHTML = `<h3>פינים לפי החיפושים האחרונים שלך:</h3>`;
        main.appendChild(resultsDiv);
      }

      let grid = resultsDiv.querySelector(".pins-grid");
      if (!grid) {
        grid = document.createElement("div");
        grid.className = "pins-grid";
        resultsDiv.appendChild(grid);
      }

      pins.forEach(pin => {
        // יצירת כרטיסם
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
          const savedPinsKey = `savedPins_${user.id}`;
          let savedPins = JSON.parse(localStorage.getItem(savedPinsKey)) || [];
          savedPins.push(pin.id);
          localStorage.setItem(savedPinsKey, JSON.stringify(savedPins));
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

      pinsOffset += pins.length; // עדכון האוף-סט לפי הפינים שהתקבלו

      // הוספת כפתור 'הצג עוד' אם התקבלו בדיוק limit פינים (יכול להיות שיש עוד)
      if (pins.length === pinsLimit) {
        let loadMoreBtn = document.getElementById("loadMorePinsBtn");
        if (!loadMoreBtn) {
          loadMoreBtn = document.createElement("button");
          loadMoreBtn.id = "loadMorePinsBtn";
          loadMoreBtn.textContent = "הצג עוד";
          loadMoreBtn.style.margin = "20px auto";
          loadMoreBtn.style.display = "block";
          loadMoreBtn.style.padding = "10px 20px";
          loadMoreBtn.style.backgroundColor = "#ce0220";
          loadMoreBtn.style.color = "white";
          loadMoreBtn.style.border = "none";
          loadMoreBtn.style.borderRadius = "5px";
          loadMoreBtn.style.cursor = "pointer";

          loadMoreBtn.addEventListener("click", () => {
            showPinsFromRecentSearches(true);
          });

          main.appendChild(loadMoreBtn);
        }
      } else {
        // אם לא התקבלו עוד פינים, הסתר את כפתור 'הצג עוד' אם קיים
        const loadMoreBtn = document.getElementById("loadMorePinsBtn");
        if (loadMoreBtn) loadMoreBtn.remove();
      }

    })
    .catch(err => {
      console.error("שגיאה בהצגת פינים מומלצים:", err);
    });
}

  
  



  //הוספת לייקים
  function addLikeButtonsToPins(card) {

  const pinId = card.dataset.pinId;
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
