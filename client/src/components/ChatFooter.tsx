import React, { useState, FormEvent, useEffect } from 'react';
import { Socket } from 'socket.io-client';

const TYPING_ENDED_TIMEOUT_MS = 1000;

type ChatFooterProps = {
  socket: Socket;
};

const ChatFooter = ({ socket }: ChatFooterProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && user.login) {
      socket.emit('message', {
        text: message,
        name: user.login,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage('');
  };
  const typingStarted = () => socket.emit('typingStart', user);
  const typingEnded = () => setTimeout(function() { socket.emit('typingEnd', user); }, TYPING_ENDED_TIMEOUT_MS);

  useEffect(() => {
    if(message.length === 0 && isTyping) {
      typingEnded();
      setIsTyping(false);
    }
    else if(message.length && !isTyping) {
      typingStarted();
      setIsTyping(true);
    }
  }, [message])

  return (
    <div className="chat-footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
