'use client';

import { Error } from '@/components/error';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  const signOutRedirect = () => {
    const clientId = '1onbn5vq3buu1f5ijke3o1gnve';
    const logoutUri = 'http://localhost:3000';
    const cognitoDomain =
      'https://us-east-10siontogi.auth.us-east-1.amazoncognito.com';
    router.push(
      `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
        logoutUri
      )}`
    );
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (typeof window !== 'undefined') {
        router.replace('/dashboard');
      }
    }
  }, [auth.isAuthenticated, router]);

  if (auth.isLoading) {
    return <Loader message='Carregando...' />;
  }

  if (auth.error) {
    console.log(auth.error);
    return <Error />;
  }

  return (
    <div>
      <Button onClick={() => auth.signinRedirect()}>Sign in</Button>
      <Button onClick={() => signOutRedirect()}>Sign out</Button>
    </div>
  );
}
