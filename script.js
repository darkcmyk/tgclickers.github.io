const BACKEND_URL = 'https://casino-gag-backend.username.repl.co'; // ← замени на свой!

async function login() {
  const username = document.getElementById('username').value.trim().toLowerCase();
  const result = document.getElementById('result');

  if (!username) {
    result.innerText = 'Введите ник!';
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/checkShkels?username=${username}`);
    const data = await res.json();

    if (data.canPlay) {
      result.innerText = `🎉 Добро пожаловать, ${data.username}! Баланс: ${data.shkels} шекелей`;
      result.style.color = 'lightgreen';
    } else {
      result.innerText = `❌ Недостаточно шекелей (${data.shkels})`;
      result.style.color = 'red';
    }
  } catch (err) {
    result.innerText = '⚠️ Ошибка соединения с сервером';
    result.style.color = 'orange';
  }
}
