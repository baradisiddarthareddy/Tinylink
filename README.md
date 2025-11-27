# TinyLink — URL Shortener (Node.js + Express + React + MySQL)

TinyLink is a full-stack URL shortener application that lets users shorten long URLs, generate custom codes, track clicks, and view analytics for each link.
It demonstrates professional backend, frontend, and deployment practices.

---

🧰 Tech Stack
## Frontend
- React
- Vite
- Custom CSS

## Backend
- Node.js
- Express.js
- MySQL (mysql2 + pooling)

## Database
- MySQL (Railway)


## Deployment

- Render (Backend)
- Render (Frontend Static Site)
- Railway (MySQL)

---  
# ⚙️ How It Works
🔸 1. User submits a long URL

Backend generates a random short code or validates the custom code.

🔸 2. URL saved in MySQL

With code, long URL, timestamps, and click count.

🔸 3. Redirection

Visiting /code on the backend triggers:

Click count increment

Redirect to the long URL

🔸 4. Stats Page

Frontend calls:

GET /api/links/:code

and displays analytics.

---

# Live link of Application 

https://frontend-axdm.onrender.com

