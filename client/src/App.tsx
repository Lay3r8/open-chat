import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from './types/Socket';
import Home from './components/Home';
import ChatPage from './pages/ChatPage';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:4000');

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
