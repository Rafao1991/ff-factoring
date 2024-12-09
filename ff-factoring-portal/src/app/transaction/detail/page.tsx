'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionForm, {
  transactionFormSchema,
} from '@/components/transaction/transaction-form';
import { z } from 'zod';

const title = 'Detalhe da operação';

function Transaction() {
  const router = useRouter();
  const id = useSearchParams().get('id');
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransaction = async (id: string) => {
      setTimeout(() => {
        setTransaction({
          id,
          customerDocumentNumber: '12345678901',
          customerName: 'Rafael Sousa',
          amount: 100,
          date: new Date(2024, 6, 1),
          dueDate: new Date(2024, 9, 1),
          type: 'cheque',
          completed: true,
        });
      }, 3000);
    };

    if (!id) return;

    fetchTransaction(id);
  }, [id]);

  function onSubmit(values: z.infer<typeof transactionFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
        {transaction ? (
          <TransactionForm onSubmit={onSubmit} transaction={transaction} />
        ) : (
          <div className='flex items-center justify-center h-screen'>
            <Loader2 className='animate-spin w-12 h-12' />
            <p className='text-center'>Carregando a operação...</p>
          </div>
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
