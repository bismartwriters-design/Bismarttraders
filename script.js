const authScreen = document.getElementById('authScreen');
const app = document.getElementById('app');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const authSubmit = document.getElementById('authSubmit');
const switchMode = document.getElementById('switchMode');
const switchText = document.getElementById('switchText');
const nameField = document.getElementById('nameField');
const authError = document.getElementById('authError');
let isSignup = false;

function getUsers() {
  try { return JSON.parse(localStorage.getItem('pesaearn_demo_users') || '[]'); }
  catch { return []; }
}
function setMode(signup) {
  isSignup = signup;
  authTitle.textContent = signup ? 'Create your account' : 'Welcome back';
  authSubtitle.textContent = signup ? 'Sign up to explore your demo dashboard.' : 'Log in to view your trading dashboard.';
  authSubmit.textContent = signup ? 'Create account' : 'Log in';
  switchText.textContent = signup ? 'Already have an account?' : 'New to PesaEarn?';
  switchMode.textContent = signup ? 'Log in' : 'Create an account';
  nameField.classList.toggle('hidden', !signup);
  document.getElementById('fullName').required = signup;
  document.getElementById('password').autocomplete = signup ? 'new-password' : 'current-password';
  authError.textContent = '';
}
switchMode.addEventListener('click', () => setMode(!isSignup));

function showDashboard(user) {
  authScreen.classList.add('hidden');
  app.classList.remove('hidden');
  const name = user.name || user.email.split('@')[0];
  document.getElementById('userName').textContent = name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('welcomeName').textContent = name.split(' ')[0];
  document.getElementById('avatar').textContent = name.charAt(0).toUpperCase();
}
authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  authError.textContent = '';
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const users = getUsers();

  if (isSignup) {
    const name = document.getElementById('fullName').value.trim();
    if (password.length < 6) { authError.textContent = 'Please use at least 6 characters for the demo password.'; return; }
    if (users.some(user => user.email === email)) { authError.textContent = 'An account with this email already exists. Please log in.'; return; }
    const user = { name, email, password };
    users.push(user);
    localStorage.setItem('pesaearn_demo_users', JSON.stringify(users));
    localStorage.setItem('pesaearn_demo_session', JSON.stringify({ name, email }));
    showDashboard(user);
  } else {
    const user = users.find(item => item.email === email && item.password === password);
    if (!user) { authError.textContent = 'Email or password is incorrect. Create a demo account first if this is your first visit.'; return; }
    localStorage.setItem('pesaearn_demo_session', JSON.stringify({ name: user.name, email: user.email }));
    showDashboard(user);
  }
});
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('pesaearn_demo_session');
  app.classList.add('hidden');
  authScreen.classList.remove('hidden');
  authForm.reset();
  setMode(false);
});
document.getElementById('refreshBtn').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.textContent = '✓ Demo refreshed';
  setTimeout(() => button.textContent = '↻ Refresh demo', 1300);
});
try {
  const session = JSON.parse(localStorage.getItem('pesaearn_demo_session') || 'null');
  if (session && session.email) showDashboard(session);
} catch { localStorage.removeItem('pesaearn_demo_session'); }
