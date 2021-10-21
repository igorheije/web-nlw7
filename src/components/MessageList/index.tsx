import React, { useEffect, useState } from 'react';
import styles from './MessageList.module.scss';
import logoI from '../../assets/logo.svg';
import { api } from '../../services/api';
import io from 'socket.io-client';

interface MessageProps {
  id: string;
  text?: string;
  userName?: string;
  userImage?: string;
}

const socket = io('http://localhost:4000');

const messagesQueue: MessageProps[] = [];

socket.on('new_message', (newMessage) => {
  const data = {
    id: newMessage.id,
    text: newMessage.text,
    userName: newMessage.user.name,
    userImage: newMessage.user.avatar_url,
  };

  messagesQueue.push(data);
});

const MessageList = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages((men) =>
          [messagesQueue[0], men[0], men[1]].filter(Boolean),
        );

        messagesQueue.shift();
      }
    }, 3000);
  }, []);

  useEffect(() => {
    const getMessageList = async () => {
      try {
        const res = await api.get('/messages/last3');

        const datas = res?.data?.map((data) => {
          return {
            id: data.id,
            text: data.text,
            userName: data.user.name,
            userImage: data.user.avatar_url,
          };
        });
        setMessages(datas);
        console.log(datas);
      } catch (err) {
        console.log(err);
      }
    };
    getMessageList();
  }, []);

  return (
    <div className={styles.Wrapper}>
      <header>
        <img src={logoI} alt="Logo" />
      </header>
      <div className={styles.ContainerMessages}>
        {messages?.map((message, index) => (
          <div
            key={message.id}
            className={`${styles.ContentMessage} ${
              index === 1 && styles.rightContent
            }`}
          >
            <p>{message.text}</p>
            <div className={styles.contentUser}>
              <div className={styles.image}>
                <img src={message.userImage} alt={message.userName} />
              </div>
              <p>{message.userName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
