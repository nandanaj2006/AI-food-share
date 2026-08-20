# FoodShare — AI-Based Leftover Food Redistribution Center

SCM course project prototype. Connects food donors (restaurants, hotels, stores,
hostels) with NGOs, shelters, and volunteers to redistribute surplus food before
it spoils.

## Current status (Review 2)

This is a **frontend-only prototype** covering Sprint 1 and Sprint 2 of the
development plan from Review 1:

- Sprint 1 — User Registration & Login ✅ done
- Sprint 2 — Food Donation Module ✅ done
- Sprint 3 — NGO & Volunteer Dashboard 🟡 in progress (static/mock data only)
- Sprint 4 — AI-Based Matching & Prioritisation ⬜ not started
- Sprint 5 — Route Optimisation & Notifications ⬜ not started
- Sprint 6 — Reports & Dashboard analytics ⬜ not started

There is **no real backend or database yet** — the pages use the browser's
`localStorage` as a stand-in so the demo works without a server. This will be
replaced by a real backend + database in later sprints.

## Pages

| Page | File | Purpose |
|---|---|---|
| Landing | `index.html` | Project overview, entry point |
| Register | `register.html` | Create a donor / NGO / volunteer account |
| Sign in | `login.html` | Sign in and route to the right page |
| Donate | `donate.html` | Donor lists surplus food |
| Dashboard | `dashboard.html` | NGO/volunteer view of available donations |

## Folder structure

```
/css        stylesheet
/js         client-side logic (mock data layer)
index.html, register.html, login.html, donate.html, dashboard.html
```

## Running locally

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Tech

Plain HTML, CSS, and JavaScript. No frameworks yet — kept intentionally simple
so it is easy to track file-level changes for SCM status accounting.
