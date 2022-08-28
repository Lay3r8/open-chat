import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { User } from '../types/chat';

type ChatBarProps = {
  socket: Socket;
}

const ChatBar = ({ socket }: ChatBarProps) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
    socket.on('userLeftResponse', (data) => setUsers(data));
  }, [socket, users]);

  return (
    <div className="chat-sidebar">
      <h2>Open Chat</h2>

      <div>
        <h4 className="chat-header">ACTIVE USERS</h4>
        <div className="chat-users">
          {users.length > 0 ?
            users.map(u => {
              return <p key={u.id}>{u.login}</p>
            })
            :
            <p>No one is here...</p>
          }
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
