# HexaWealth

## Overview

This project is a full-stack application structured into two main parts:

- **Client**: A front-end React application.
- **Server**: A back-end Node.js application using Express and MongoDB.

The client and server communicate via APIs, making the application highly modular and scalable.

---

## Prerequisites

Before running this project, ensure the following software is installed on your machine:

- [Node.js](https://nodejs.org/) (version 16 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (for database)

---

## Setup Instructions

### Step 1: Clone the Repository

git clone <repository-url>
cd <project-folder>

---

### Step 2: Setting Up the Server

Navigate to the server directory
cd server
Install server dependencies
npm install or yarn install

Create a .env fil in the server directory and add the following:

PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-secret-key

Start the server
npm start

### Setting Up the Client

Navigate to Client directory
cd ../client
Install client dependencies
npm install or yarn install
Create a .env file in the client directory and add the follwing:
REACT_APP_API_URL=http://localhost:5000

Start the client
npm start

Directory Structure
HexaWealth/
│
├── client/ # Front-end application
│ ├── public/
│ ├── src/
│ ├── package.json
│ └── .env # Client-specific environment variables
│
├── server/ # Back-end application
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── package.json
│ ├── .env # Server-specific environment variables
│ └── server.js # Server entry point
│
└── README.md # Project documentation
