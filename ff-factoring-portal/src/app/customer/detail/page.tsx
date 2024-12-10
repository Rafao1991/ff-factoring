'use client';

import CustomerForm, {
  CustomerSchema,
} from '@/components/customer/customer-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Error } from '@/components/error';
import useGetCustomer from '@/hooks/api/customers/use-get-customer';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import useUpdateCustomer from '@/hooks/api/customers/use-update-customer';

const title = 'Detalhe do cliente';

function Customer() {
  const router = useRouter();
  const documentNumber = useSearchParams().get('documentNumber');
  const { data: customer, isError, isLoading } = useGetCustomer(documentNumber);
  const {
    mutate: updateCustomer,
    isError: isUpdateError,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    error: updateError,
  } = useUpdateCustomer();

  useEffect(() => {
    if (isUpdateSuccess) {
      router.back();
    }
  }, [isUpdateSuccess, router]);

  useEffect(() => {
    if (isUpdateError) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar o cliente',
        description: `Erro inesperado - ${updateError.message}`,
      });
    }
  }, [isUpdateError, updateError]);

  const onSubmit = async (customer: CustomerSchema) => {
    if (!documentNumber) return;
    updateCustomer({ documentNumber, customer });
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
        {!isError ? (
          !isLoading && customer ? (
            <CustomerForm
              onSubmit={onSubmit}
              isLoading={isUpdateLoading}
              customer={customer}
            />
          ) : (
            <div className='flex items-center justify-center h-screen'>
              <Loader2 className='animate-spin w-12 h-12' />
              <p className='text-center'>Carregando o cliente...</p>
            </div>
          )
        ) : (
          <Error />
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
