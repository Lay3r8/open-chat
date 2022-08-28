import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { Message } from '../types/chat';

type ChatBodyProps = {
  socket: Socket;
  messages: Message[];
  lastMessageRef: React.MutableRefObject<null | HTMLDivElement>;
  typingStatus: string
}

const ChatBody = ({ socket, messages, lastMessageRef, typingStatus }: ChatBodyProps) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLeaveChat = () => {
    // if(!user) console.error('Cannot find user in localStorage!');
    localStorage.removeItem('user');
    socket.emit('userLeft', { id: user.id });
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <header className="chat-main-header">
        <p>Hangout with Colleagues</p>
        <button className="leave-chat-btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message-container">
        {messages.map((message) =>
          message.name === user.login ? (
            <div className="message-chats" key={message.id}>
              <p className="sender-name">You</p>
              <div className="message-sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message-chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message-recipient">
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}

        {/*This is triggered when a user is typing*/}
        <div className="message-status">
          <p>{typingStatus}</p>
        </div>

        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
