'use client';

import CustomerForm, {
  CustomerSchema,
} from '@/components/customer/customer-form';
import { Loading } from '@/components/loading';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useCreateCustomer from '@/hooks/api/customers/use-create-customer';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

const title = 'Novo Cedente';
const description = 'Cadastre um novo cedente.';

export default function NewAssignor() {
  const auth = useAuth();
  const router = useRouter();
  const {
    mutate: createCustomer,
    isError: isCreationError,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
    error: creationError,
  } = useCreateCustomer(auth.user?.access_token || '');

  useEffect(() => {
    if (isCreationSuccess) {
      router.back();
    }
  }, [isCreationSuccess, router]);

  useEffect(() => {
    if (isCreationError) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar o cedente',
        description: `Erro inesperado - ${creationError.message}`,
      });
    }
  }, [isCreationError, creationError]);

  const onSubmit = async (customer: CustomerSchema) => {
    createCustomer(customer);
  };

  if (!auth.isAuthenticated) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerForm
          onSubmit={onSubmit}
          isLoading={isCreationLoading}
          type='A'
        />
      </CardContent>
    </Card>
  );
}
