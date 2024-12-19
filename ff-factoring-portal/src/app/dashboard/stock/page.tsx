'use client';

import { Error } from '@/components/error';
import { Loading } from '@/components/loading';
import useGetStock from '@/hooks/api/stock/use-get-stock';
// import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'react-oidc-context';

export default function Stock() {
  const auth = useAuth();
  // const queryClient = useQueryClient();
  const {
    data: stock,
    isLoading,
    isError,
  } = useGetStock(auth.user?.access_token || '');

  return (
    <>
      {!isError ? (
        !isLoading && stock ? (
          <p>{JSON.stringify(stock)}</p>
        ) : (
          <Loading />
        )
      ) : (
        <Error />
      )}
    </>
  );
}
