# 🧵 SilaiMitra – AI Tailor Companion

**SilaiMitra** is a web-based tailoring management system designed to simplify and digitize daily tailoring business operations. It helps tailors manage customers, measurements, orders, payments, and deliveries through a centralized platform.

The application also provides smart features such as AI-based design recommendations, colour matching, and fabric calculation to enhance the tailoring experience.

## ✨ Features

- **Customer Management:** Add, update, view, and manage customer details.
- **Measurement Management:** Store and manage customer measurements for different garment types.
- **Order Management:** Create and track tailoring orders with delivery dates and order statuses.
- **Payment Management:** Record payments and track pending balances.
- **Dashboard:** View order summaries, payment statistics, and upcoming deliveries.
- **AI Design Recommendation:** Get rule-based design suggestions based on garment type, occasion, and colour preferences.
- **Colour Matching:** Get colour coordination suggestions.
- **Smart Fabric Calculator:** Estimate fabric requirements for garments.
- **Notification Management:** Manage customer notification details and messages.

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcryptjs

**Database**
- MySQL

**Tools**
- Visual Studio Code
- Git & GitHub
- Thunder Client
- MySQL Workbench

## 🏗️ Project Structure

```text
SilaiMitra/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── Server/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── ...
│
├── database/
│   └── schema.sql
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd SilaiMitra
```

### 2. Backend Setup

```bash
cd Server
npm install
```

Create a `.env` file inside the Server folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=silaimitra
JWT_SECRET=your_secret_key
```

### 3. Database Setup

- Open MySQL Workbench.
- Create a database named `silaimitra`.
- Import and execute `database/schema.sql`.
- Configure the database credentials in the `.env` file.

### 4. Start the Backend

```bash
npm run dev
```

### 5. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed in the terminal to access the application.

## 🔐 Security

- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected API routes.
- Backend request validation.

## 🎯 Project Objective

The main objective of SilaiMitra is to modernize traditional tailoring businesses by reducing manual record-keeping, improving customer management, and providing smart tools for efficient tailoring operations.

## 👩‍💻 Developed By

**Team SilaiMitra**

A collaborative full-stack web development project.

---

*SilaiMitra – Making Tailoring Smarter, Simpler & More Efficient.*