'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page used to be a separate, read-only "VIEW ONLY" stock list that
// wasn't even linked from the sidebar and wasn't wired to the same data as
// everything else. Stock Control is now a single shared page (owners get
// pricing fields too, sales reps don't) — this just forwards old links there.
export default function SalesRepStockControlRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/stock-control');
  }, [router]);

  return null;
}
