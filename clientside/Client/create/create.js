//העלאת תמונה ופרטים על pin
const imageInput = document.getElementById("image-input");
const previewImg = document.querySelector(".preview-img");
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      previewImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const chooseTagsBtn = document.getElementById('chooseTagsBtn');
  const tagsModal = document.getElementById('tagsModal');
  const modalTagsList = document.getElementById('modalTagsList');
  const loadMoreTagsBtn = document.getElementById('loadMoreTagsBtn');
  const confirmTagsBtn = document.getElementById('confirmTagsBtn');
  const cancelTagsBtn = document.getElementById('cancelTagsBtn');
  const selectedTagsDiv = document.getElementById('selectedTags');

  let selectedTagIds = new Set();// מונע כפילות
  let allTags = [];
  let page = 0;
  const pageSize = 20;
  // הוספת ארוע ללחצן בחירת טאגים 
  chooseTagsBtn.addEventListener('click', () => {
    page = 0;
    allTags = [];
    modalTagsList.innerHTML = '';
    tagsModal.style.display = 'block';
    loadMoreTags();
  });
  // הוספת ארוע ללחצן טעינת טאגים נוספים
  loadMoreTagsBtn.addEventListener('click', loadMoreTags);

  function loadMoreTags() {
    const offset = page * pageSize;//מספר הטאגים שיוצגו לי
    fetch(`http://localhost:3000/tags?limit=${pageSize}&offset=${offset}`)

      .then(res => res.json())
      .then(tags => {
        allTags = allTags.concat(tags);// מוסיף את התגים החדשים לרשימה הקיימת
        renderTags(tags);// מציג את הטאגים החדשים שבחרתיץ
        if (tags.length < pageSize) {// אם אין עוד טאגים להציג
          loadMoreTagsBtn.style.display = 'none';
        } else {
          loadMoreTagsBtn.style.display = 'block';
        }
        page++;
      });
  }
  // פונקציה להציג את הטאגים שיראו יפה בחלון הקופץ
  function renderTags(tags) {
    tags.forEach(tag => {
      if (modalTagsList.querySelector(`[data-id="${tag.id}"]`)) return;

      const tagEl = document.createElement('div');
      tagEl.className = 'tag-option';
      tagEl.dataset.id = tag.id;
      tagEl.textContent = tag.name;
      tagEl.onclick = () => {
        tagEl.classList.toggle('selected');
      };
      modalTagsList.appendChild(tagEl);
    });
  }
  // הוספת ארוע ללחצן אישור טאגים
  confirmTagsBtn.addEventListener('click', () => {
    const selected = modalTagsList.querySelectorAll('.tag-option.selected');
    selected.forEach(el => {
      const id = el.dataset.id;
      const name = el.textContent;

      if (!selectedTagIds.has(id)) {
        selectedTagIds.add(id);

        const tagEl = document.createElement('div');// יצירת אלמנט חדש עבור הטאג
        tagEl.className = 'tag';
        tagEl.dataset.id = id;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.onclick = () => {
          selectedTagIds.delete(id);
          tagEl.remove();
        };

        const span = document.createElement('span');
        span.textContent = name;

        tagEl.appendChild(removeBtn);
        tagEl.appendChild(span);
        selectedTagsDiv.appendChild(tagEl);// הוספת הטאג שנבחר לאזור הבחירה
      }
    });
    tagsModal.style.display = 'none';
  });

  cancelTagsBtn.addEventListener('click', () => {// סגירת החלון הקופץ
    tagsModal.style.display = 'none';
  });
});

// שליחת הפין לשרת
function savePin() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const image_url = document.getElementById('image-input').files[0];
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const user_id = user.id;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('image', image_url);
  formData.append('user_id', user_id);

  fetch('http://localhost:3000/pins', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) throw new Error('בעיה בשליחה לשרת');
      return response.json();
    })
    .then(data => {
      alert('הפין נשמר בהצלחה');

      const selectedTags = Array.from(document.getElementById('selectedTags').children)
        .map(div => div.dataset.id);

      if (selectedTags.length === 0) return;
      // שליחת הטאגים שנבחרו לשרת שיוסיף אותם 
      return fetch('http://localhost:3000/pinTags/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pin_id: data.id, tags: selectedTags })
      });
    })
    .then(response => {
      if (!response) return; // אם אין טאגים
      if (!response.ok) throw new Error('בעיה בהוספת הטאגים לפין');
      return response.json();
    })
    .then(() => {
    })
    .catch(error => {
      console.error('שגיאה:', error);
      alert('אירעה שגיאה');
    });
}

const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', savePin);


