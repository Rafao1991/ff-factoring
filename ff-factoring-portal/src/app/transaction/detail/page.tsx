'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Error } from '@/components/error';
import TransactionForm, {
  TransactionSchema,
} from '@/components/transaction/transaction-form';
import useGetTransaction from '@/hooks/api/transactions/use-get-transaction';
import useUpdateTransaction from '@/hooks/api/transactions/use-update-transaction';
import { toast } from '@/hooks/use-toast';

const title = 'Detalhe da operação';

function Transaction() {
  const router = useRouter();
  const id = useSearchParams().get('id');
  const { data: transaction, isError, isLoading } = useGetTransaction(id);
  const {
    mutate: updateTransaction,
    isError: isUpdateError,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    error: updateError,
  } = useUpdateTransaction();

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

  function onSubmit(transaction: TransactionSchema) {
    if (!id) return;
    updateTransaction({ id, transaction });
  }

  // Redirect to the transaction page if the id is not found
  if (!id) {
    if (typeof window !== 'undefined') {
      router.push('/transaction');
    }
    return null;
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
            <div className='flex items-center justify-center h-screen'>
              <Loader2 className='animate-spin w-12 h-12' />
              <p className='text-center'>Carregando a operação...</p>
            </div>
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
    <Suspense fallback={<Loader2 className='animate-spin' />}>
      <Transaction />
    </Suspense>
  );
}
