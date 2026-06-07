'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './unauthorized.module.css';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.errorCode}>403</div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          You do not have permission to access this page. Only users with the required role can access this resource.
        </p>
        <div className={styles.actions}>
          <button 
            className={styles.btn}
            onClick={() => router.back()}
          >
            Go Back
          </button>
          <Link href="/dashboard" className={styles.btn}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
