'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// E-Receipt is now a single shared page (src/app/e-receipt/page.js) that
// already restricts sales reps to their allowed categories and hides
// nothing else they need — this just forwards old links there.
export default function SalesRepEReceiptRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/e-receipt');
  }, [router]);

  return null;
}
