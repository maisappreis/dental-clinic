# Dental Clinic — Web Application

![Coverage](https://img.shields.io/badge/coverage-10%25-yellowgreen) ![Last Commit](https://img.shields.io/github/last-commit/maisappreis/dental-clinic)

- Web application developed to manage a dental clinic's **customers, revenues, expenses and monthly cash closing**, focusing on a clean UI and scalable frontend architecture.

🌐 **Live demo:**  
https://maisappreis.github.io/dental-clinic/

🔗 **Backend repository:**  
https://github.com/maisappreis/django-APIs


---

## 🧠 Overview

This project was built as part of a fullstack architecture, where the frontend communicates with a REST API developed in Django.  
It focuses on **state management, authentication flows and modular frontend structure**, following modern React and Next.js best practices.

---

## 🛠️ Tech Stack

- Next.js
- React.js
- TypeScript
- Zustand

---

## 📸 Preview

![dental](https://github.com/user-attachments/assets/5842745c-7d3a-4e9b-aa8b-5d392182b393)

---

## 🧩 Architecture

This application follows a **frontend–backend decoupled architecture**, where the React frontend communicates with a REST API built in Django.

- The **frontend** is developed with React and Next.js, using a modular component-based structure.
- **Global state management** is handled with Zustand, centralizing authentication state, API configuration, and shared application data.
- **Authentication** is implemented using JWT tokens, managed on the frontend and validated by the backend.
- The **backend API** is responsible for business logic, data persistence, and permissions, exposing secure REST endpoints.
- The project is structured to support scalability, maintainability, and clear separation of concerns.

---

## 🔐 Authentication Flow

Authentication is implemented using **JWT (JSON Web Tokens)**, enabling stateless and secure communication between the frontend and backend.

1. The user submits credentials through the frontend login form.
2. The frontend sends the credentials to the Django REST API.
3. Upon successful authentication, the backend issues an **access token** (and refresh token).
4. The frontend stores the token and attaches it to subsequent API requests via the `Authorization` header.
5. Protected routes and resources are validated on the backend using JWT authentication.
6. Authentication state is centrally managed on the frontend using **Zustand**.

---

## 🌱 Project Status

🚧 This project is under active development.  
New features, refactors, and improvements are added incrementally.

---

## 📦 Getting Started

### Installation

```sh
npm install
```

### Development

Start the development server with hot reload:
```sh
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

---

## 🏗️ Build & Production

Type-Check, Compile and Minify for Production

Build the production version:
```sh
npm run build
```

---

## 🧪 Testing

Run **Unit Tests** with React Testing Library
```sh
npm run test
```

---

## 🚀 Deployment

The frontend is deployed on **GitHub Pages** using **GitHub Actions** deployment flow targeting "main" branch.

A production build is generated with Next.js and published to the `main` branch.

---

## Learn More about Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

---

## 👩‍💻 Author

Maisa Pierini Preis

Frontend‑focused Full Stack Developer

- GitHub: https://github.com/maisappreis
- LinkedIn: https://www.linkedin.com/in/maisa-pp-2303/
- Portfolio: https://maisappreis.github.io/

---

## 📄 License

This project is licensed under the MIT License.

