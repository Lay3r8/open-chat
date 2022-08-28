import React, { useEffect, useRef, useState } from 'react';
import { Socket } from "socket.io-client";
import ChatBar from '../components/ChatBar';
import ChatBody from '../components/ChatBody';
import ChatFooter from '../components/ChatFooter';
import { Message, User } from '../types/chat';

type ChatPageProps = {
  socket: Socket;
};

const buildTypingStatus = (typingUsers: User[]) => {
  let typingStatus = '';
  switch(typingUsers.length) {
    case 0:
      break;
    case 1:
      typingStatus = `${typingUsers[0].login} is typing...`;
      break;
    case 2:
      typingStatus = `${typingUsers[0].login} and ${typingUsers[1].login} are typing...`;
      break;
    default:
      typingStatus = `${typingUsers[0].login}, ${typingUsers[1].login} and ${typingUsers.length} other users are typing...`;
      break;
  }
  return typingStatus;
}

const ChatPage = ({ socket }: ChatPageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef<null | HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');


  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(buildTypingStatus(data.filter((u: User) => u.id !== user.id))));
  }, [socket]);

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat-main">
        <ChatBody socket={socket} messages={messages} lastMessageRef={lastMessageRef} typingStatus={typingStatus}/>
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
