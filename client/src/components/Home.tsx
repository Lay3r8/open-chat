import React, { useState, FormEvent } from 'react';
import { Socket } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

type HomeProps = {
  socket: Socket;
};

const Home = ({socket}: HomeProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = {login: userName, id: uuidv4()};
    localStorage.setItem('user', JSON.stringify(user));
    socket.emit('newUser', user);
    navigate('/chat');
  };

  return (
    <form className="home-container" onSubmit={handleSubmit}>
      <h2 className="home-header">Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        minLength={3}
        name="username"
        id="username"
        className="username-input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button className="home-cta">SIGN IN</button>
    </form>
  );
};

export default Home;
