'use client';

import CustomerForm, {
  customerFormSchema,
} from '@/components/customer/customer-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { z } from 'zod';

const title = 'Detalhe do cliente';

function Customer() {
  const router = useRouter();
  const documentNumber = useSearchParams().get('documentNumber');
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomer = async (documentNumber: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${documentNumber}`
      );
      const { data } = await response.json();

      setCustomer(data);
    };

    if (!documentNumber) return;

    fetchCustomer(documentNumber);
  }, [documentNumber]);

  const onSubmit = async (values: z.infer<typeof customerFormSchema>) => {
    try {
      const { documentNumber, ...newData } = values;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${documentNumber}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar o cliente',
          description: `${response.status} - ${response.statusText} - ${error.message}`,
        });
        return;
      }

      router.back();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o cliente',
        description: `Erro inesperado - ${JSON.stringify(error)}`,
      });
    }
  };

  // Redirect to the transaction page if the id is not found
  if (!documentNumber) {
    if (typeof window !== 'undefined') {
      router.push('/customer');
    }
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {customer ? (
          <CustomerForm onSubmit={onSubmit} customer={customer} />
        ) : (
          <div className='flex items-center justify-center h-screen'>
            <Loader2 className='animate-spin w-12 h-12' />
            <p className='text-center'>Carregando o cliente...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CustomerWrapper() {
  return (
    <Suspense fallback={<Loader2 className='animate-spin' />}>
      <Customer />
    </Suspense>
  );
}
