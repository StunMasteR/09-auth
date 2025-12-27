
'use client';


import { checkSession, getUser } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props){
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
    setLoading(true)
    try {
      const isAuthenticated = await checkSession();
      if (isAuthenticated) {
        const user = await getUser();
        if (user) setUser(user);
      } else {
        clearIsAuthenticated();
      }
    } catch (err) {
      alert(`AuthProvider error:${err}`);
      clearIsAuthenticated();
    } finally {
      setLoading(false)
    }
    };
    fetchUser();

  }, [setUser, clearIsAuthenticated]);

  return (isLoading ? <Loader /> : <>{children}</>)
};