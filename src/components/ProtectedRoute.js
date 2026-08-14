'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeRole } from '@/lib/auth';

export default function ProtectedRoute({
  children,
  requiredRole = null, // Can be string or array of strings
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        router.push('/signin');
        return;
      }

      const userData = JSON.parse(user);
      const userRole = normalizeRole(userData.role);

      if (requiredRole) {
        const allowedRoles = (Array.isArray(requiredRole) ? requiredRole : [requiredRole])
          .map((role) => normalizeRole(role))
          .filter(Boolean);

        if (!allowedRoles.includes(userRole)) {
          router.push('/unauthorized');
          return;
        }
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, requiredRole]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'var(--text-primary)',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
