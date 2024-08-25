# Real-Time Chat Application

## Overview
A real-time chat application using MongoDB, Express.js, React, and Node.js. Implemented user authentication and real-time messaging with WebSocket.

## Technologies Used
- **MongoDB**: Database to store user information and chat history.
- **Express.js**: Backend framework for handling API requests and managing WebSocket connections.
- **React**: Frontend library for building a responsive user interface.
- **Node.js**: Server-side JavaScript runtime for handling backend logic.
- **WebSocket**: Real-time communication protocol for instant messaging.

## Installation

### Prerequisites
- Node.js
- MongoDB

### Steps

#### Clone the repository:

```bash
git clone https://github.com/tusharmalankiya/TalkTime.git
cd TalkTime
```

#### Server Set Up:
1. Install Dependencies:

    ```bash
    cd server
    ```

    ```bash
    npm install
    ```

2. Configuration:

    ```bash
    mv .config .env
    ```

3. Running the Application

    ```bash
    node index.js
    ```

#### Client Set Up:
1. Install Dependencies:

    ```bash
    cd client
    ```

    ```bash
    yarn install
    ```
    OR

    ```bash
    npm install
    ```
2. Configuration:

    ```bash
    mv .config .env
    ```
    
3. Run development server:

    ```bash
    yarn start
    ```
    OR
    ```bash
    npm start
    ```
4. Open your web browser and navigate to http://localhost:3000 to access the application.


## Usage
- **Register** a new account or **log in** with an existing account.
- Start **chatting** in real-time with other users in the room.


    



