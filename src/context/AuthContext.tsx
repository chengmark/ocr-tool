import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import Spinner from '../components/Spinner';

interface Props {
  children?: ReactNode;
}

interface IAuthContext {
  user: Object | null;
  signInWithGoogle: () => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Object | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setPending(false);
    });
  }, []);

  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  if (pending) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
