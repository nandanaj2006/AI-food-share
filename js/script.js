/* ============================================
   FoodShare — prototype data layer
   Uses localStorage as a stand-in backend so the
   demo works with no server. Replace with real
   API calls once the backend module is built.
   ============================================ */

const DB = {
  users: 'foodshare_users',
  session: 'foodshare_session',
  donations: 'foodshare_donations'
};

function seedDonations(){
  if (localStorage.getItem(DB.donations)) return;
  const seed = [
    { id: 1, item: 'Vegetable Biryani', qty: '15 kg', type: 'Veg', donor: 'Green Leaf Hotel', location: 'Salem', expiresIn: '2 hrs', urgent: true },
    { id: 2, item: 'Packaged Bread Loaves', qty: '40 pcs', type: 'Veg', donor: 'Sunrise Bakery', location: 'Salem', expiresIn: '1 day', urgent: false },
    { id: 3, item: 'Chicken Curry', qty: '8 kg', type: 'Non-Veg', donor: 'Spice Route Restaurant', location: 'Coimbatore', expiresIn: '3 hrs', urgent: true },
    { id: 4, item: 'Fresh Fruits (mixed)', qty: '25 kg', type: 'Veg', donor: 'City Supermarket', location: 'Salem', expiresIn: '2 days', urgent: false }
  ];
  localStorage.setItem(DB.donations, JSON.stringify(seed));
}

function getUsers(){
  return JSON.parse(localStorage.getItem(DB.users) || '[]');
}
function saveUser(user){
  const users = getUsers();
  users.push(user);
  localStorage.setItem(DB.users, JSON.stringify(users));
}
function setSession(user){
  localStorage.setItem(DB.session, JSON.stringify(user));
}
function getSession(){
  return JSON.parse(localStorage.getItem(DB.session) || 'null');
}

/* ---------- Register page ---------- */
function initRegisterForm(){
  const form = document.getElementById('registerForm');
  if (!form) return;

  const roleOpts = document.querySelectorAll('.role-opt');
  roleOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      roleOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      opt.querySelector('input').checked = true;
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const location = document.getElementById('location').value.trim();
    const role = form.querySelector('input[name="role"]:checked');

    if (!name || !email || !password || !location || !role) {
      msg.textContent = 'Please fill in every field and choose a role.';
      msg.className = 'msg error show';
      return;
    }

    saveUser({ name, email, password, location, role: role.value });
    msg.textContent = 'Account created. Redirecting to sign in…';
    msg.className = 'msg success show';
    setTimeout(() => { window.location.href = 'login.html'; }, 900);
  });
}

/* ---------- Login page ---------- */
function initLoginForm(){
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const user = getUsers().find(u => u.email === email && u.password === password);

    if (!user) {
      msg.textContent = 'No matching account found. Check your details or register first.';
      msg.className = 'msg error show';
      return;
    }
    setSession(user);
    msg.textContent = 'Signed in. Redirecting…';
    msg.className = 'msg success show';
    setTimeout(() => {
      window.location.href = user.role === 'donor' ? 'donate.html' : 'dashboard.html';
    }, 700);
  });
}

/* ---------- Donate page ---------- */
function initDonateForm(){
  const form = document.getElementById('donateForm');
  if (!form) return;
  seedDonations();

  const session = getSession();
  const who = document.getElementById('whoBadge');
  if (who) who.textContent = session ? `Signed in as ${session.name}` : 'Guest donor';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    const item = document.getElementById('item').value.trim();
    const qty = document.getElementById('qty').value.trim();
    const type = document.getElementById('type').value;
    const location = document.getElementById('location').value.trim();
    const expiresIn = document.getElementById('expiresIn').value.trim();

    if (!item || !qty || !location || !expiresIn) {
      msg.textContent = 'Please complete every field before listing this donation.';
      msg.className = 'msg error show';
      return;
    }

    const donations = JSON.parse(localStorage.getItem(DB.donations) || '[]');
    donations.unshift({
      id: Date.now(),
      item, qty, type, location, expiresIn,
      donor: session ? session.name : 'Guest Donor',
      urgent: expiresIn.toLowerCase().includes('hr')
    });
    localStorage.setItem(DB.donations, JSON.stringify(donations));

    msg.textContent = 'Listed. NGOs and volunteers nearby can now see this donation.';
    msg.className = 'msg success show';
    form.reset();
  });
}

/* ---------- Dashboard page ---------- */
function initDashboard(){
  const tbody = document.getElementById('listingBody');
  if (!tbody) return;
  seedDonations();

  const session = getSession();
  const who = document.getElementById('whoBadge');
  if (who) who.textContent = session ? `Signed in as ${session.name}` : 'Guest view';

  const locationFilter = document.getElementById('locationFilter');
  const typeFilter = document.getElementById('typeFilter');

  function render(){
    const donations = JSON.parse(localStorage.getItem(DB.donations) || '[]');
    const loc = locationFilter.value;
    const type = typeFilter.value;

    const filtered = donations.filter(d =>
      (loc === 'all' || d.location === loc) &&
      (type === 'all' || d.type === type)
    );

    if (!filtered.length) {
      tbody.innerHTML = '';
      document.getElementById('emptyState').style.display = 'block';
      return;
    }
    document.getElementById('emptyState').style.display = 'none';

    tbody.innerHTML = filtered.map(d => `
      <tr class="${d.urgent ? 'urgent' : 'ok'}">
        <td>${d.item}</td>
        <td>${d.qty}</td>
        <td>${d.type}</td>
        <td>${d.donor}</td>
        <td>${d.location}</td>
        <td class="status">${d.urgent ? 'Pick up soon' : 'Available'} · ${d.expiresIn}</td>
      </tr>
    `).join('');
  }

  const donations = JSON.parse(localStorage.getItem(DB.donations) || '[]');
  const locations = ['all', ...new Set(donations.map(d => d.location))];
  locationFilter.innerHTML = locations.map(l => `<option value="${l}">${l === 'all' ? 'All locations' : l}</option>`).join('');

  locationFilter.addEventListener('change', render);
  typeFilter.addEventListener('change', render);
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  initRegisterForm();
  initLoginForm();
  initDonateForm();
  initDashboard();
});
