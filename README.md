# Peer-Link - Real-Time Video Conferencing Platform

A full-stack video conferencing platform that enables users to create and join meetings, communicate in real time, and collaborate seamlessly through video calls and messaging.

## Features

### Authentication

* User Registration and Login
* Secure password hashing with bcrypt
* Token-based authentication
* Protected user access

### Video Conferencing

* Create and join meeting rooms
* Real-time user connectivity with Socket.IO
* Peer-to-peer video communication using WebRTC
* Live participant management

### Real-Time Communication

* Instant chat messaging during meetings
* User join and leave notifications
* Real-time event synchronization

### Architecture

* Modular frontend and backend structure
* RESTful API design
* Context-based authentication management
* Real-time communication using WebSockets

## Tech Stack

### Frontend

* React.js
* Material UI
* React Router
* Axios

### Backend

* Node.js
* Express.js
* Socket.IO

### Database

* MongoDB
* Mongoose

### Authentication

* bcrypt
* Crypto Tokens

### Real-Time Communication

* WebRTC
* Socket.IO

## Installation

```bash
git clone https://github.com/your-username/Peer-Link.git
cd Peer-Link
```

```bash
npm install
```

Create a `.env` file inside the backend:

```env
MONGO_URI=your_mongodb_connection_string
PORT=8080
```

Run the project:

```bash
npm run dev
```

## Key Learnings

* Real-time communication with Socket.IO
* Peer-to-peer video streaming using WebRTC
* Authentication and authorization workflows
* React Context API state management
* Building scalable full-stack applications

## Future Improvements

* Screen sharing
* Meeting recording
* Chat file sharing
* Meeting scheduling
* Participant moderation controls
* End-to-end encryption
