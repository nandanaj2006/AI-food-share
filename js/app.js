/* FoodShare — mock data layer.
   Everything lives in localStorage, so the whole prototype works with
   no backend and no internet connection (as required for the review). */

const STORE_USERS = 'fs_users';
const STORE_SESSION = 'fs_session';
const STORE_LISTINGS = 'fs_listings';

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
}

function seedListingsIfEmpty() {
  const existing = readStore(STORE_LISTINGS, null);
  if (existing && existing.length) return;
  const seed = [
    { id: 'L-101', food: 'Rice + sambar (12 portions)', donor: 'Sharma Catering, T Nagar', qty: '12 portions', expiresIn: '2 hrs', status: 'open', urgent: true },
    { id: 'L-102', food: 'Mixed vegetable sabzi + rotis', donor: 'Green Leaf Mess, Velachery', qty: '8 portions', expiresIn: '4 hrs', status: 'open', urgent: false },
    { id: 'L-103', food: 'Bakery surplus — bread & buns', donor: 'Daily Bread Bakery', qty: '30 pieces', expiresIn: '6 hrs', status: 'open', urgent: false },
    { id: 'L-104', food: 'Wedding function leftovers', donor: 'Residency Hall, Adyar', qty: '50 portions', expiresIn: '1 hr', status: 'open', urgent: true }
  ];
  writeStore(STORE_LISTINGS, seed);
}
seedListingsIfEmpty();

function getCurrentUser() {
  return readStore(STORE_SESSION, null);
}
function requireAuth(redirectTo) {
  if (!getCurrentUser()) {
    window.location.href = redirectTo || 'login.html';
  }
}
function logout() {
  localStorage.removeItem(STORE_SESSION);
  window.location.href = 'login.html';
}

function registerUser(name, email, password, role) {
  const users = readStore(STORE_USERS, []);
  if (users.find(u => u.email === email)) {
    return { ok: false, message: 'An account with this email already exists.' };
  }
  users.push({ name, email, password, role });
  writeStore(STORE_USERS, users);
  return { ok: true };
}

function loginUser(email, password) {
  const users = readStore(STORE_USERS, []);
  const match = users.find(u => u.email === email && u.password === password);
  if (!match) return { ok: false, message: 'Incorrect email or password.' };
  writeStore(STORE_SESSION, { name: match.name, email: match.email, role: match.role });
  return { ok: true };
}

function addListing(food, donor, qty, expiresIn, urgent) {
  const listings = readStore(STORE_LISTINGS, []);
  const id = 'L-' + (100 + listings.length + 1);
  listings.unshift({ id, food, donor, qty, expiresIn, status: 'open', urgent: !!urgent });
  writeStore(STORE_LISTINGS, listings);
  return id;
}

function claimListing(id) {
  const listings = readStore(STORE_LISTINGS, []);
  const item = listings.find(l => l.id === id);
  if (item) item.status = 'claimed';
  writeStore(STORE_LISTINGS, listings);
}

function getListings() {
  return readStore(STORE_LISTINGS, []);
}

/* Nav auth-state toggle, run on every page */
document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  document.querySelectorAll('[data-auth="in"]').forEach(el => {
    el.classList.toggle('hidden', !user);
  });
  document.querySelectorAll('[data-auth="out"]').forEach(el => {
    el.classList.toggle('hidden', !!user);
  });
  document.querySelectorAll('[data-user-name]').forEach(el => {
    if (user) el.textContent = user.name;
  });
  const logoutBtn = document.querySelector('[data-action="logout"]');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
});
