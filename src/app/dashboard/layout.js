'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

const dashboardLayoutStyle = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: 'var(--dark-bg)',
};

const mainContentStyle = {
  flex: 1,
  marginLeft: '250px',
  display: 'flex',
  flexDirection: 'column',
};

const contentAreaStyle = {
  flex: 1,
  overflow: 'auto',
  padding: '30px',
};

export default function DashboardLayout({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};
    setUserRole(user.role);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'var(--text-primary)',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole={userRole}>
      <div style={dashboardLayoutStyle}>
        <Sidebar userRole={userRole} />
        <div style={mainContentStyle}>
          <Header />
          <div style={contentAreaStyle}>
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
