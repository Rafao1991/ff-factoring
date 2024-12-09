'use client';

import CustomerForm, {
  customerFormSchema,
} from '@/components/customer/customer-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { z } from 'zod';

const title = 'Novo cliente';
const description = 'Cadastre um novo cliente.';

export default function NewCustomer() {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof customerFormSchema>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerForm onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
