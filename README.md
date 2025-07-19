# LYNQ Social Media Platform
A full-stack social media platform built with **React**, **Node.js**, **Express**, and **MongoDB**. The app features a modern UI, real-time chat, analytics, notifications, and a rich Indian context in its seed data (users, posts, and celebrities).

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Seeding the Database](#seeding-the-database)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- User authentication (register, login, JWT-based sessions)
- Create, like, and comment on posts (with media upload)
- Follow/unfollow users (including Indian celebrities)
- Real-time chat/messaging between users
- User profile management (update info, upload avatar)
- Notifications for likes, comments, and follows
- Analytics dashboard for user activity
- Responsive, modern UI with Material-UI and framer-motion
- Indian context: seed data includes Indian users, celebrities, and posts

## Tech Stack
- **Frontend:** React 19, Material-UI, framer-motion, axios, react-router-dom, socket.io-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, multer, socket.io

## Screenshots
> _Add screenshots or GIFs of the app here (Feed, Chat, Profile, Analytics, etc.)_

## Getting Started

### Backend Setup
1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Create a `.env` file:**
   ```env
   MONGO_URI=mongodb://localhost:27017/socialmedia
   JWT_SECRET=your_jwt_secret
   ```
3. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend runs on [http://localhost:5012](http://localhost:5012)

### Frontend Setup
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the frontend dev server:**
   ```bash
   npm start
   ```
   The frontend runs on [http://localhost:3012](http://localhost:3012) and proxies API requests to the backend.

### Seeding the Database
1. **Seed with Indian users, celebs, posts, and messages:**
   ```bash
   cd backend
   node seed.js
   ```
   This will clear and repopulate the database with demo data.

## Usage
- Register a new account or log in with seeded users (see `backend/seed.js` for credentials)
- Explore the feed, like/comment on posts, follow users
- Chat in real-time with other users and celebrities
- View analytics and notifications
- Update your profile and avatar

## Project Structure
```
Social Media Platform/
  backend/         # Express API, MongoDB models, routes, seed data
  frontend/        # React app, components, pages, assets
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

[MIT](LICENSE) 
