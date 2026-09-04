'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function SignIn() {
  const router = useRouter();
  const [role, setRole] = useState('owner'); // Initial state role
  const [email, setEmail] = useState('');    // Cleared hardcoded fallback string
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role, // This will cleanly send 'owner' or 'sales' to your backend API
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Sign in failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect pathways based on the canonical user role
      if (role === 'owner') {
        router.push('/dashboard');
      } else {
        router.push('/stock-control');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.logo}>INVENTIS</div>
          <div className={styles.subtitle}>INVENTORY SUITE</div>
        </div>

        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.description}>Sign in to your account to continue</p>

        <div className={styles.roleButtons}>
          <button
            type="button"
            className={`${styles.roleButton} ${role === 'owner' ? styles.active : ''}`}
            onClick={() => setRole('owner')}
          >
            Owner
          </button>
          <button
            type="button"
            className={`${styles.roleButton} ${role === 'sales_rep' ? styles.active : ''}`}
            onClick={() => setRole('sales_rep')}
          >
            Sales Rep
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>Don't have an account?</p>
          <Link href="/signup" className={styles.signupLink}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}