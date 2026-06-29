# PeerLink - Video Conferencing Platform

PeerLink is a full-stack video conferencing application that enables users to create and join secure video meetings with real-time audio/video communication, chat, and screen sharing. It supports both authenticated users and guests while maintaining a meeting history for registered users.

---

## Live Demo

* 🌐 **Frontend:** https://peer-link-1-snkh.onrender.com
* ⚙️ **Backend API:** https://peer-link-backend.onrender.com

---

## Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes
* Guest Access without Registration

### Video Meetings

* Create or Join Meetings using a Meeting Code
* Real-Time Video & Audio Communication
* Screen Sharing
* Live Chat during Meetings
* Camera & Microphone Controls
* Camera Preview before Joining
* Copy Meeting Code with One Click
* WebRTC-powered Peer-to-Peer Communication
* STUN/TURN Server Integration for Reliable Connectivity Across Different Networks

### Meeting History

* Stores Every Joined Meeting for Authenticated Users
* Displays Meeting Code and Joining Date
* Guests Can Join Meetings without Storing History

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

* WebRTC
* Socket.IO
* PeerJS
* STUN/TURN Servers

---

## Installation

### Clone the Repository

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
JWT_SECRET=your_jwt_secret
PORT=8080
CLIENT_URL=http://localhost:5173
```

If required, configure your TURN server credentials according to your deployment.

---

## Application Flow

### Registered Users

* Register/Login
* Create or Join Meetings
* Meeting Automatically Gets Added to History
* View Previous Meetings
* Logout Returns to the Landing Page

### Guest Users

* Join Meetings Directly from the Landing Page
* No Account Required
* No Meeting History Stored
* Leaving a Meeting Redirects Back to the Landing Page

---

## Screenshots

Add screenshots or GIFs here:

* Landing Page
* Authentication Page
* Home Dashboard
* Meeting Lobby
* Video Conference
* Screen Sharing
* Live Chat
* Meeting History

---

## Browser Permissions

To use video conferencing features, allow your browser access to:

* Camera
* Microphone
* Screen Sharing (when prompted)

---

## Future Improvements

* Group Video Calls
* Meeting Recording
* Virtual Backgrounds
* In-Meeting Reactions
* Waiting Room
* End-to-End Encryption
* File Sharing

---

## Author

**Ishaan Bansal**
