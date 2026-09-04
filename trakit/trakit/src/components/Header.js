'use client';

import styles from './Header.module.css';

export default function Header() {
  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className={styles.header}>
      <div className={styles.alerts}>
        <div className={styles.alert}>
          <span className={styles.alertIcon}>▲</span>
          <span className={styles.alertText}>2 low stock</span>
        </div>
        <div className={styles.date}>
          <span className={styles.dateStar}>★</span>
          <span>{today}</span>
        </div>
      </div>
      <div className={styles.userRole}>
        {user.role === 'owner' ? 'OWNER' : 'SALES REP'}
      </div>
    </div>
  );
}
