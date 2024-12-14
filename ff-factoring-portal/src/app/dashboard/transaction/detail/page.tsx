'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Error } from '@/components/error';
import TransactionForm, {
  TransactionSchema,
} from '@/components/transaction/transaction-form';
import useGetTransaction from '@/hooks/api/transactions/use-get-transaction';
import useUpdateTransaction from '@/hooks/api/transactions/use-update-transaction';
import { toast } from '@/hooks/use-toast';
import { useAuth } from 'react-oidc-context';
import { useQueryClient } from '@tanstack/react-query';
import { Loading } from '@/components/loading';

const title = 'Detalhe da operação';

function Transaction() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const id = useSearchParams().get('id');
  const {
    data: transaction,
    isError,
    isLoading,
  } = useGetTransaction(id, auth.user?.access_token || '');
  const {
    mutate: updateTransaction,
    isError: isUpdateError,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    error: updateError,
  } = useUpdateTransaction(auth.user?.access_token || '');

  useEffect(() => {
    if (isUpdateSuccess) {
      router.back();
    }
  }, [isUpdateSuccess, router]);

  useEffect(() => {
    if (isUpdateError) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar a operação',
        description: `Erro inesperado - ${updateError.message}`,
      });
    }
  }, [isUpdateError, updateError]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: ['getTransaction', id] });
    }
  }, [auth.isAuthenticated, queryClient, id]);

  function onSubmit(transaction: TransactionSchema) {
    if (!id) return;
    updateTransaction({
      id,
      transaction: {
        ...transaction,
        amount: Number(transaction.amount.toFixed(2)),
      },
    });
  }

  // Redirect to the transaction page if the id is not found
  if (!id) {
    if (typeof window !== 'undefined') {
      router.push('/dashboard/transaction');
    }
    return null;
  }

  if (!auth.isAuthenticated) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isError ? (
          !isLoading && transaction ? (
            <TransactionForm
              onSubmit={onSubmit}
              isLoading={isUpdateLoading}
              transaction={transaction}
            />
          ) : (
            <Loading />
          )
        ) : (
          <Error />
        )}
      </CardContent>
    </Card>
  );
}

export default function TransactionWrapper() {
  return (
    <Suspense>
      <Transaction />
    </Suspense>
  );
}
