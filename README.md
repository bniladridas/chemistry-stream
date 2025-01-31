# Chemistry Stream

A real-time platform for chemistry students to connect, chat, and video call with each other.

## Features
- Real-time text chat
- Video calling
- Chemistry-focused user interface
- Multiple user support

## Tech Stack
- Frontend: React.js
- Backend: Node.js + Express
- Real-time Communication: Socket.IO
- Video Calling: WebRTC

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository
2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

#### Option 1: Using the Start Script (Recommended)
Simply run:
```bash
./start.sh
```
This will start both the backend and frontend servers automatically.

#### Option 2: Manual Start
If you prefer to run the servers separately:

1. Start the backend server:
```bash
cd backend
node src/server.js
```

2. In a new terminal, start the frontend server:
```bash
cd frontend
npm start
```

### Accessing the Application
- The application will automatically open in your default browser at http://localhost:3000
- Allow camera and microphone access when prompted
- To test the chat and video features, open another browser window to http://localhost:3000

### Stopping the Application
- If using the start script: Press `Ctrl + C` in the terminal
- If running manually: Press `Ctrl + C` in both terminal windows

## Usage
1. When the application loads, you'll see your video feed in the main section
2. Use the chat panel on the right to communicate with other users
3. Multiple users can join by opening the application in different browser windows
