document.addEventListener("DOMContentLoaded", () => {
  const tagsList = document.getElementById("tagsList");
  const addTagBtn = document.getElementById("addTagBtn");
  const newTagInput = document.getElementById("newTagInput");
  const loadMoreTagsBtn = document.getElementById("loadMoreTagsBtn");

  let offset = 0;
  const limit = 20;

  function loadTags() {
    fetch(`http://localhost:3000/tags?limit=${limit}&offset=${offset}`)
      .then(res => res.json())
      .then(tags => {
        if (tags.length === 0) {
          loadMoreTagsBtn.disabled = true;
          loadMoreTagsBtn.textContent = "אין עוד תגיות לטעינה";
          return;
        }

        tags.forEach(tag => {
          const li = document.createElement("li");
          li.textContent = tag.name;
          tagsList.appendChild(li);
        });

        offset += limit;
      })
      .catch(err => {
        if (offset === 0) tagsList.innerHTML = "<li>שגיאה בטעינת תגים</li>";
        console.error(err);
      });
  }

  addTagBtn.addEventListener("click", () => {
    const name = newTagInput.value.trim();
    if (!name) return alert("יש להזין שם תג");

    fetch("http://localhost:3000/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        newTagInput.value = "";
        // אפס offset כדי לטעון מחדש את הרשימה מההתחלה
        offset = 0;
        tagsList.innerHTML = ""; // נקה קודם את הרשימה
        loadMoreTagsBtn.disabled = false;
        loadMoreTagsBtn.textContent = "הצג עוד תגיות";
        loadTags();
      })
      .catch(() => alert("שגיאה בהוספת תג"));
  });

  loadMoreTagsBtn.addEventListener("click", loadTags);

  loadTags(); // טען את ה-20 הראשונים אוטומטית
});
