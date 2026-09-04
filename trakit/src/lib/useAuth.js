'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setToken(storedToken);
    } catch (error) {
      console.error('Failed to parse user data');
    }

    setIsLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        const error = await res.json();
        return { success: false, error: error.error };
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const error = await res.json();
        return { success: false, error: error.error };
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    router.push('/signin');
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
  };
}
