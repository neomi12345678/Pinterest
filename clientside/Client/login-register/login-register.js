let isRegisterMode = false;

const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const username = document.getElementById('username');
const submitBtn = document.querySelector('form button');
const messageDiv = document.getElementById('message');

function updateModeUI() {
  username.style.display = isRegisterMode ? 'block' : 'none';
  submitBtn.textContent = isRegisterMode ? 'הרשמה' : 'התחבר';
  loginTab.classList.toggle('active', !isRegisterMode);
  registerTab.classList.toggle('active', isRegisterMode);
}

loginTab.addEventListener('click', () => {
  isRegisterMode = false;
  updateModeUI();
});

registerTab.addEventListener('click', () => {
  isRegisterMode = true;
  updateModeUI();
});
// הוספת אירוע submit לטופס
document.getElementById('authForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('username').value;
  const passwordInput = document.getElementById('password').value;
  const email = document.getElementById('email').value;

  if (isRegisterMode) {
    if (!name || !passwordInput) {
      messageDiv.textContent = 'אנא מלא/י שם משתמש וסיסמה.';
      return;
    }
    if (!email) {
      messageDiv.textContent = 'אנא הזן/י אימייל בהרשמה.';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      messageDiv.textContent = 'אימייל לא תקין.';
      return;
    }
  }

  const url = isRegisterMode
    ? 'http://localhost:3000/users'
    : 'http://localhost:3000/users/login';

  const payload = isRegisterMode
    ? { name, password_hash: passwordInput, email }
    : { email, password: passwordInput };

  const headers = {
    'Content-Type': 'application/json',
  };

  fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        messageDiv.textContent = 'שגיאה: ' + data.error;
        return;
      }
      if (!data.success && !data.token && !isRegisterMode) {
        messageDiv.textContent = 'אימייל או סיסמה שגויים';
        return;
      }

      messageDiv.textContent = isRegisterMode
        ? 'נרשמת בהצלחה!'
        : 'התחברת בהצלחה!';

      const user = isRegisterMode
        ? { id: data.id, name, email }
        : { id: data.userId, name: data.name, email };

      if (data.token) {
        localStorage.setItem('token', data.token);
        user.token = data.token;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = './../home/home.html';
    })
    .catch(err => {
      messageDiv.textContent = 'שגיאה: ' + err.message;
    });
});

// הפעלה ראשונית
updateModeUI();
