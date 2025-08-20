# 🏆 Leaderboard Backend (Node.js + MongoDB)

## 📌 Overview
This is the **backend service** for the Leaderboard Task.  
It is built using **Node.js (Express.js)** and **MongoDB (Mongoose)** to handle user management, claim points, leaderboard ranking, and claim history tracking.  

---

## 🎯 Features
- **User Management**
  - Pre-seeded with 10 default users (e.g., Rahul, Kamal, Sanak).
  - Add new users dynamically via API/frontend.

- **Claim Points**
  - Randomly awards **1–10 points** to the selected user.
  - Updates the user’s total points.
  - Stores claim data in a **Claim History collection**.

- **Leaderboard**
  - Ranks users dynamically in **descending order of points**.
  - Returns **username, total points, and rank**.

- **Claim History**
  - Every point claim is recorded in a dedicated collection.

---

## 🏗️ Tech Stack
- **Runtime**: Node.js  
- **Framework**: Express.js  
- **Database**: MongoDB (Atlas / Local)  
- **ODM**: Mongoose  

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-backend-repo-link.git
cd leaderboard-backend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Environment Variables
Create a .env file in the root folder:

env
Copy
Edit
MONGODB_URI=your-mongodb-connection-string
PORT=5000
NODE_ENV=development
4. Run Server
bash
Copy
Edit
npm start
Backend will start at: http://localhost:5000

📂 API Endpoints
🔹 Users
GET /api/users → Fetch all users

POST /api/users → Add new user

🔹 Claim Points
POST /api/claim/:userId → Claim random points (1–10) for a user

🔹 Leaderboard
GET /api/leaderboard → Get ranked leaderboard

🔹 Claim History
GET /api/history → Fetch claim history

📂 Project Structure
bash
Copy
Edit
backend/
│
├── models/
│   ├── User.js          # User schema
│   └── ClaimHistory.js  # Claim history schema
│
├── routes/
│   ├── userRoutes.js    # User APIs
│   ├── claimRoutes.js   # Claim points API
│   └── leaderboard.js   # Leaderboard API
│
├── controllers/         # Business logic
├── server.js            # Entry point
└── .env                 # Environment variables
🚀 Outcome
Fully functional backend API for Leaderboard Task.

Supports user creation, claiming random points, dynamic ranking, and history tracking.

Clean and modular code following best practices.
