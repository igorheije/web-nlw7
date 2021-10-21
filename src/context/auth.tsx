import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

interface AuthContextData {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
}
interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
    login: string;
  };
}

const AuthContext = createContext({} as AuthContextData);

interface AuthProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const signInUrl = 'http://localhost:4000/github';

  function signOut() {
    setUser(null);
    localStorage.removeItem('@token:DO');
  }

  async function signIn(gitCode: string) {
    const response = await api.post<AuthResponse>('/authenticate', {
      code: gitCode,
    });
    const { token, user } = response.data;
    localStorage.setItem('@token:DO', token);
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    setUser(user);
  }

  useEffect(() => {
    const url = window.location.href;
    const hasGithubeCode = url.includes('?code=');

    if (hasGithubeCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');
      window.history.pushState({}, '', urlWithoutCode);
      signIn(githubCode);
    }
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem('@token:DO');
    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const { user, signInUrl, signOut } = useContext(AuthContext);
  return { user, signInUrl, signOut };
};
