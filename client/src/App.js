import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import SetProfile from './pages/SetProfile';
import Chat from './pages/Chat';
import CreateChatRoom from './components/CreateChatRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/set-profile" element={<SetProfile />} />
        <Route path="/create-chatroom" element={<CreateChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
