import React, { FormEvent, useState } from 'react';
import styles from './styles.module.scss';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { useAuth } from '../../context/auth';
import { api } from '../../services/api';

const SendMessageForm = () => {
  const { user, signOut } = useAuth();
  const [message, setMessage] = useState('');

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    await api.post('messages', { message });
    setMessage('');
  }

  return (
    <div className={styles.SendMessageFormWrapper}>
      <button onClick={signOut} className={styles.SigOutButton}>
        <VscSignOut size={32} />
      </button>

      <header className={styles.UserInfo}>
        <div className={styles.UserImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <h2 className={styles.UserName}>{user?.name}</h2>
        <div className={styles.UserGithub}>
          <VscGithubInverted size={24} />
          <p>{user?.login}</p>
        </div>
      </header>

      <form onSubmit={handleSendMessage} className={styles.SendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">ENVIAR MENSAGEM</button>
      </form>
    </div>
  );
};

export default SendMessageForm;
