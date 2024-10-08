"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/strava/callback`;

export default function StravaAuth() {
  const router = useRouter();

  useEffect(() => {
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=activity:read_all`;
    router.push(authUrl);
  }, [router]);

  return <div>Redirecting to Strava for authorization...</div>;
}