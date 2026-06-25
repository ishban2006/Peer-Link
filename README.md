# PeerLink - Video Conferencing Platform

PeerLink is a full-stack video conferencing application that enables users to create and join secure video meetings with real-time audio/video communication, chat, and screen sharing. It supports both authenticated users and guests while maintaining a meeting history for registered users.

---

## Features

### Authentication

* User Registration
* User Login
* JWT/Token-based authentication
* Protected routes
* Guest access without registration

### Video Meetings

* Create or join meetings using a meeting code
* Real-time video and audio communication
* Screen sharing
* Live chat during meetings
* Microphone and camera controls
* Camera preview before joining
* Copy Meeting Code with one click

### Meeting History

* Stores every joined meeting for authenticated users
* Displays meeting code and joining date
* Guests can join meetings without storing history

---

## Tech Stack

### Frontend

* React.js
* React Router
* Material UI (MUI)
* Axios
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Real-Time Communication

* Socket.IO
* WebRTC
* PeerJS

---

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/PeerLink.git
```

### Backend

```bash
cd backEnd
npm install
npm start
```

### Frontend

```bash
cd frontEnd
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
MONGO_URI=your_mongodb_connection_string
PORT=8080
```

---

## Application Flow

### Registered Users

* Register/Login
* Join or create meetings
* Meeting automatically gets added to history
* View previous meetings
* Logout returns to landing page

### Guest Users

* Join meetings directly from the landing page
* No account required
* No meeting history stored
* Leaving a meeting redirects back to the landing page

---

## Screenshots

Add screenshots here:

* Landing Page
* Authentication Page
* Home Page
* Lobby
* Video Meeting
* Meeting History

---

## Author

**Ishaan Bansal**