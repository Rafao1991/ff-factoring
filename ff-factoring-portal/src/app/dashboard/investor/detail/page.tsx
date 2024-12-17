'use client';

import CustomerForm, {
  CustomerSchema,
} from '@/components/customer/customer-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Error } from '@/components/error';
import useGetCustomer from '@/hooks/api/customers/use-get-customer';
import { toast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import useUpdateCustomer from '@/hooks/api/customers/use-update-customer';
import { useAuth } from 'react-oidc-context';
import { useQueryClient } from '@tanstack/react-query';
import { Loading } from '@/components/loading';

const title = 'Detalhe do Investidor';

function Investor() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const documentNumber = useSearchParams().get('documentNumber');
  const {
    data: investor,
    isError,
    isLoading,
  } = useGetCustomer(documentNumber || '', 'I', auth.user?.access_token || '');
  const {
    mutate: updateCustomer,
    isError: isUpdateError,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    error: updateError,
  } = useUpdateCustomer(auth.user?.access_token || '');

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

  useEffect(() => {
    if (auth.isAuthenticated) {
      queryClient.invalidateQueries({
        queryKey: ['getCustomer', documentNumber],
      });
    }
  }, [auth.isAuthenticated, queryClient, documentNumber]);

  const onSubmit = async (customer: CustomerSchema) => {
    if (!documentNumber) return;
    updateCustomer({ documentNumber, customer });
  };

  // Redirect to the transaction page if the id is not found
  if (!documentNumber) {
    if (typeof window !== 'undefined') {
      router.push('/dashboard/customer');
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
          !isLoading && investor ? (
            <CustomerForm
              onSubmit={onSubmit}
              isLoading={isUpdateLoading}
              type='I'
              customer={investor}
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

export default function CustomerWrapper() {
  return (
    <Suspense>
      <Investor />
    </Suspense>
  );
}
