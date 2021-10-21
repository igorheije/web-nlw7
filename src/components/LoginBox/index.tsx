import React from 'react';
import bannerI from '../../assets/banner-girl.png';
import gitI from '../../assets/github.png';
import { useAuth } from '../../context/auth';
import styles from './LoginBox.module.scss';

const LoginBox = () => {
  const { signInUrl } = useAuth();

  return (
    <div className={styles.Wrapper}>
      <img src={bannerI} alt="banner-girl" />
      <h1>Envie e compartilhe sua mensagem</h1>
      <div className={styles.ContentButton}>
        <a href={signInUrl} className={styles.ButtonLogin}>
          <img src={gitI} />
          ENTRAR COM GITHUB
        </a>
      </div>
    </div>
  );
};

export default LoginBox;
