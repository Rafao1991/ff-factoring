'use client';

import CustomerForm, {
  customerFormSchema,
} from '@/components/customer/customer-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      setTimeout(() => {
        setCustomer({
          documentNumber,
          name: 'Rafael Sousa',
          emails: ['rafaelsousa@example.com', 'rafaelsousa@gmail.com'],
          phones: ['11999999999'],
        });
      }, 3000);
    };

    if (!documentNumber) return;

    fetchCustomer(documentNumber);
  }, [documentNumber]);

  function onSubmit(values: z.infer<typeof customerFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

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
