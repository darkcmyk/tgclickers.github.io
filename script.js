const BACKEND_URL = 'https://5ecf2cd5-b718-4734-aba6-2259aa598570-00-3s7c11zdialc7.pike.replit.dev';

const authMessage = document.getElementById('auth-message');

let currentUser = null;
let userBalance = 0;

function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');

  document.getElementById('btn-login').classList.toggle('active', tabName === 'login');
  document.getElementById('btn-register').classList.toggle('active', tabName === 'register');

  authMessage.innerText = '';
}

async function register() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;

  if (!username || !password) {
    authMessage.style.color = 'red';
    authMessage.innerText = 'Введите ник и пароль';
    return;
  }

  try {
    const res = await fetch(BACKEND_URL + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      authMessage.style.color = 'lightgreen';
      authMessage.innerText = 'Регистрация успешна! Войдите.';
      showTab('login');
    } else {
      authMessage.style.color = 'red';
      authMessage.innerText = data.error || 'Ошибка регистрации';
    }
  } catch {
    authMessage.style.color = 'red';
    authMessage.innerText = 'Ошибка сервера';
  }
}

async function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    authMessage.style.color = 'red';
    authMessage.innerText = 'Введите ник и пароль';
    return;
  }

  try {
    const res = await fetch(BACKEND_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      currentUser = data.username;
      userBalance = data.shkels;

      document.getElementById('user-name').innerText = currentUser;
      document.getElementById('user-shkels').innerText = userBalance;
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('casino-section').style.display = 'block';

      const canPlay = data.canPlay;
      document.getElementById('access-message').innerText = canPlay
        ? ''
        : 'Минимум 1 000 000 шекелей для игры в казино';

      authMessage.innerText = '';
    } else {
      authMessage.style.color = 'red';
      authMessage.innerText = data.error || 'Ошибка входа';
    }
  } catch {
    authMessage.style.color = 'red';
    authMessage.innerText = 'Ошибка сервера';
  }
}

async function playGuess() {
  const guessInput = document.getElementById('guess-number');
  const betInput = document.getElementById('guess-bet');
  const resultP = document.getElementById('guess-result');

  const guess = Number(guessInput.value);
  const bet = Number(betInput.value);

  if (!guess || guess < 1 || guess > 10) {
    resultP.style.color = 'red';
    resultP.innerText = 'Введите число от 1 до 10!';
    return;
  }
  if (!bet || bet < 1000000) {
    resultP.style.color = 'red';
    resultP.innerText = 'Минимальная ставка — 1 000 000 шекелей!';
    return;
  }
  if (bet > userBalance) {
    resultP.style.color = 'red';
    resultP.innerText = 'Недостаточно шекелей для ставки!';
    return;
  }

  try {
    const res = await fetch(BACKEND_URL + '/playGuess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, bet, guess }),
    });
    const data = await res.json();

    if (res.ok) {
      userBalance = data.shkels;
      document.getElementById('user-shkels').innerText = userBalance;

      resultP.style.color = data.won ? 'lightgreen' : 'orange';
      resultP.innerText = data.message;
    } else {
      resultP.style.color = 'red';
      resultP.innerText = data.error || 'Ошибка игры';
    }
  } catch {
    resultP.style.color = 'red';
    resultP.innerText = 'Ошибка сервера';
  }

  guessInput.value = '';
  betInput.value = '';
}

async function playBlackjack() {
  const betInput = document.getElementById('bj-bet');
  const resultP = document.getElementById('bj-result');

  const bet = Number(betInput.value);
  if (!bet || bet < 1000000) {
    resultP.style.color = 'red';
    resultP.innerText = 'Минимальная ставка — 1 000 000 шекелей!';
    return;
  }
  if (bet > userBalance) {
    resultP.style.color = 'red';
    resultP.innerText = 'Недостаточно шекелей для ставки!';
    return;
  }

  try {
    const res = await fetch(BACKEND_URL + '/playBlackjack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, bet }),
    });

    const data = await res.json();

    if (res.ok) {
      userBalance = data.shkels;
      document.getElementById('user-shkels').innerText = userBalance;

      resultP.style.color = data.won ? 'lightgreen' : 'orange';
      resultP.innerText = data.message;
    } else {
      resultP.style.color = 'red';
      resultP.innerText = data.error || 'Ошибка игры';
    }
  } catch {
    resultP.style.color = 'red';
    resultP.innerText = 'Ошибка сервера';
  }

  betInput.value = '';
}

function logout() {
  currentUser = null;
  userBalance = 0;
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('casino-section').style.display = 'none';

  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  authMessage.innerText = '';
  document.getElementById('guess-result').innerText = '';
  document.getElementById('bj-result').innerText = '';
}
