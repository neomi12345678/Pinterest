
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return alert("עליך להתחבר");

  const boardsContainer = document.getElementById("boardsContainer");
  const unsortedPinsContainer = document.getElementById("unsortedPinsContainer");
  const addBoardBtn = document.getElementById("addBoardBtn");

  const savedPinsKey = `savedPins_${user.id}`;
  const savedPinsIds = JSON.parse(localStorage.getItem(savedPinsKey)) || [];

  let allPins = []; // כל הפינים שנשמרו על ידי המשתמש
  let boardPins = [];//כל פינים בלוחות
  let userBoards = [];// כל הלוחות של המשתמש


  //  קבלת כל הפינים שנשמרו על ידי המשתמש
  fetch("http://localhost:3000/pins/ids", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: savedPinsIds }),// שליחת מזהי הפינים שנשמרו
  })
    .then(res => res.json())
    .then(data => {
      allPins = data;
      return fetch("http://localhost:3000/BoardPins/getAllBoardPins");// קבלת כל הפינים בלוחות
    })
    .then(res => res.json())
    .then(data => {
      boardPins = data;
      return fetch(`http://localhost:3000/boards/user/${user.id}`, {// קבלת כל הלוחות של המשתמש
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
    })
    .then(res => res.json())
    .then(boards => {
      userBoards = boards;
      //📦 הצגת הלוחות בדף
      boards.forEach(board => {
        const boardDiv = document.createElement("div");// יצירת אלמנט חדש עבור כל =לוח
        boardDiv.className = "board-card";
        boardDiv.innerHTML = `<h4>${board.name}</h4><p>${board.description || ""}</p>`;
        boardDiv.addEventListener("click", () => openBoardPinsModal(board));
        boardsContainer.appendChild(boardDiv);
      });
      //  הצגת הפינים של המשתמש
      const pinIdsInBoards = new Set(boardPins.map(bp => bp.pin_id));// יצירת סט של מזהי הפינים שכבר משויכים ללוחות

      allPins.forEach(pin => {
        const card = createPinCard(pin);

        if (pinIdsInBoards.has(pin.id)) {
          // סגנון מיוחד לפין שכבר משויך ללוח
          card.title = "פין זה כבר משויך ללוח";
        }

        unsortedPinsContainer.appendChild(card);// הוספת כרטיס הפין לאזור הפיניםים
      });
     
    })
    .catch(err => {
      console.error("שגיאה בטעינת נתונים:", err);
    });
   // טיפול בלחיצה על כפתור יצירת לוח חדש
  addBoardBtn.addEventListener("click", () => {// טיפול בלחיצה על כפתור יצירת לוח חדש
    const name = prompt("שם הלוח:");
    if (!name) return;
    const description = prompt("תיאור (לא חובה):");

    fetch(`http://localhost:3000/boards/user/${user.id}`, {// יצירת לוח חדש
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ name, description }),
    })
      .then(res => res.json())
      .then(() => {
        location.reload();
      })
      .catch(err => {
        alert("שגיאה ביצירת לוח");
        console.error(err);
      });
  });
  // פונרציה ליצירת כרטיס פין שהמתשמש שמר
  function createPinCard(pin, inBoard = false, boardId = null) {//  פונקציה ליצירת כרטיס פין
    const card = document.createElement("div");
    card.className = "pin-card";
    card.innerHTML = `
    <img src="http://localhost:3000/${pin.image_url}" alt="${pin.title}" />
    <h4>${pin.title}</h4>
    <p>${pin.description || ''}</p>
    <button class="pin-action-btn">
      ${inBoard ? "🗑️ הסר מהלוח" : "📌 שמור בלוח"}
    </button>
  `;
    const actionBtn = card.querySelector(".pin-action-btn");
    /// טיפול בלחיצה על כפתור הפעולה
    if (inBoard) {// אם הפין  בלוח
      actionBtn.addEventListener("click", () => {
        // הסרת הפין מהלוח
        fetch(`http://localhost:3000/BoardPins/deleteBoardPin/${boardId}/${pin.id}`, {
          method: "DELETE",
        })

          .then(res => {
            if (!res.ok) throw new Error("בעיה במחיקה");
            location.reload();
          })
          .catch(err => {
            alert("שגיאה בהסרה מהלוח");
            console.error(err);
          });
      });
    } else {
      actionBtn.addEventListener("click", () => {
        openSaveModal(pin);// פתיחת מודל שמירת הפין
      });
    }

    return card;
  }

  // פונקציה לפתיחת מודל שמירת פין
  function openSaveModal(pin) {
    const modal = document.getElementById("saveModal");
    const modalContent = document.getElementById("saveModalContent");
    const saveBtn = document.getElementById("savePinToBoardsBtn");

    modalContent.innerHTML = `
      <h3>בחר לוחות לשמירת הפין:</h3>
      <div class="board-list">
        ${userBoards.map(board => `
          <label>
            <input type="checkbox" value="${board.id}" />
            ${board.name}
          </label>
        `).join("")}
      </div>
    `;
   // טיפול בלחיצה על כפתור שמירת הפין
    saveBtn.onclick = () => {
      const selectedBoardIds = Array.from(modalContent.querySelectorAll("input:checked")).map(cb => cb.value);
      if (!selectedBoardIds.length) return alert("בחר לפחות לוח אחד");
     // שליחת בקשה לשמירת הפין בלוחות שנבחרו
      Promise.all(selectedBoardIds.map(boardId =>
        fetch("http://localhost:3000/BoardPins/addBoardPin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ board_id: boardId, pin_id: pin.id })
        })
      ))
        .then(() => {
          // הוספת הפין גם ל-savedPins המקומי (אם לא קיים כבר)
          const currentSaved = JSON.parse(localStorage.getItem(savedPinsKey)) || [];
          if (!currentSaved.includes(pin.id)) {
            currentSaved.push(pin.id);
            localStorage.setItem(savedPinsKey, JSON.stringify(currentSaved));
          }

          modal.classList.add("hidden");

          location.reload();
        })
        .catch(err => {
          alert("שגיאה בשמירה");
          console.error(err);
        });
    };

    document.getElementById("closeModal").onclick = () => {
      modal.classList.add("hidden");
    };

    modal.classList.remove("hidden");
  }
// פונקציה לפתיחת מודל הצגת הפינים בלוח
  function openBoardPinsModal(board) {
    const modal = document.getElementById("boardPinsModal");
    const modalTitle = document.getElementById("boardPinsTitle");
    const modalContent = document.getElementById("boardPinsContent");
    const closeBtn = document.getElementById("closeBoardPinsModal");

    modalTitle.textContent = `פינים בלוח: ${board.name}`;
    modalContent.innerHTML = "";

    const pinMap = new Map(allPins.map(pin => [String(pin.id), pin]));// יצירת מפה של הפינים לפי מזהה

    // סינון הפינים בלוח לפי מזהה הלוח
    const pinsInBoard = boardPins
      .filter(bp => String(bp.board_id) === String(board.id))// סינון הפינים לפי הלוח
      .map(bp => allPins.find(pin => String(pin.id) === String(bp.pin_id)))// חיפוש הפינים בלוח לפי מזהה
      .filter(Boolean);


    if (pinsInBoard.length === 0) {
      modalContent.innerHTML = "<p>אין פינים בלוח זה</p>";
    } else {


      pinsInBoard.forEach(pin => {
        const card = createPinCard(pin, true, board.id); // מחיקה יצירת כרטיס פין עם סגנון מיוחד
        modalContent.appendChild(card);
      });
    }
    closeBtn.onclick = () => modal.classList.add("hidden");
    modal.classList.remove("hidden");
  }
});
// פתיחת חלון עדכון והבאת הנתונים מהשרת
function openUpdateUserModal() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("עליך להתחבר");
    return;
  }

  fetch(`http://localhost:3000/users/${currentUser.id}`, {// שליחת בקשה לקבלת פרטי המשתמש
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(user => {
      const emailInput = document.querySelector("#updateUserForm input[name='email']");
      const nameInput = document.querySelector("#updateUserForm input[name='name']");

      emailInput.value = user.email || "";
      emailInput.setAttribute("data-original", user.email || "");

      nameInput.value = user.name || "";
      nameInput.setAttribute("data-original", user.name || "");

      document.getElementById("updateUserModal").style.display = "block";
    })
    .catch(err => {
      console.error("שגיאה בקבלת פרטי המשתמש", err);
      alert("שגיאה בטעינת פרטי המשתמש");
    });
}

// סגירת חלון העדכון
function closeUpdateUserModal() {
  document.getElementById("updateUserModal").style.display = "none";
  document.getElementById("updateUserForm").reset();
}

// חיבור אירוע לשליחת הטופס
document.addEventListener("DOMContentLoaded", () => {
  const updateForm = document.getElementById("updateUserForm");
  if (!updateForm) {
    console.error("הטופס לעדכון משתמש לא נמצא בדף");
    return;
  }

  updateForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("עליך להתחבר");
      return;
    }

    const formData = new FormData(this);
    const data = {};

    for (const [key, value] of formData.entries()) {// איסוף הנתונים מהטופס
      const input = this.querySelector(`[name="${key}"]`);
      const original = input?.getAttribute("data-original") || "";

      if (value.trim() && value.trim() !== original.trim()) {
        data[key] = value.trim();
      }
    }

    if (Object.keys(data).length === 0) {
      return alert("יש לשנות לפחות שדה אחד לעדכון");
    }

    fetch(`http://localhost:3000/users/${currentUser.id}`, {// שליחת הבקשה לעדכון המשתמש
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          alert("שגיאה: " + json.error);
        } else {
          closeUpdateUserModal();
          location.reload();
        }
      })
      .catch(err => {
        console.error("שגיאת רשת:", err);
        alert("שגיאת רשת בעת עדכון");
      });
  });
});
