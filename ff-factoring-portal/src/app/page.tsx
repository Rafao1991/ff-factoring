'use client';

import { Error } from '@/components/error';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (typeof window !== 'undefined') {
        router.replace('/dashboard');
      }
    }
  }, [auth.isAuthenticated, router]);

  if (auth.isLoading) {
    return <Loading message='Carregando...' />;
  }

  if (auth.error) {
    console.log(auth.error);
    return <Error />;
  }

  return (
    <div className='w-6/12 mx-auto p-4 md:p-6 lg:p-8 xl:p-12 text-center'>
      <Card className='w-6/12 mx-auto'>
        <CardHeader>
          <CardTitle className='text-xl'>FF Factoring</CardTitle>
          <CardDescription className='text-xl'>Seja bem-vindo!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className='w-full py-6 text-xl'
            size='lg'
            onClick={() => auth.signinRedirect()}
          >
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
