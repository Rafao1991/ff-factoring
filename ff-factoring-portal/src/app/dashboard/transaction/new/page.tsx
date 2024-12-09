'use client';

import TransactionForm, {
  TransactionSchema,
} from '@/components/transaction/transaction-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useCreateTransaction from '@/hooks/api/transactions/use-create-transaction';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const title = 'Nova operação';
const description = 'Crie uma nova operação.';

export default function NewTransaction() {
  const router = useRouter();
  const {
    mutate: createTransaction,
    isError: isCreationError,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
    error: creationError,
  } = useCreateTransaction();

  useEffect(() => {
    if (isCreationSuccess) {
      router.back();
    }
  }, [isCreationSuccess, router]);

  useEffect(() => {
    if (isCreationError) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar a operação',
        description: `Erro inesperado - ${creationError.message}`,
      });
    }
  }, [isCreationError, creationError]);

  function onSubmit(values: TransactionSchema) {
    createTransaction(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionForm onSubmit={onSubmit} isLoading={isCreationLoading} />
      </CardContent>
    </Card>
  );
}
