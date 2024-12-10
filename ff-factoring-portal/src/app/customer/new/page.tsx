'use client';

import CustomerForm, {
  CustomerSchema,
} from '@/components/customer/customer-form';

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

const title = 'Novo cliente';
const description = 'Cadastre um novo cliente.';

export default function NewCustomer() {
  const router = useRouter();
  const {
    mutate: createCustomer,
    isError: isCreationError,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
    error: creationError,
  } = useCreateCustomer();

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

  const onSubmit = async (customer: CustomerSchema) => {
    createCustomer(customer);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerForm onSubmit={onSubmit} isLoading={isCreationLoading} />
      </CardContent>
    </Card>
  );
}
