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

import { z } from 'zod';

const title = 'Novo cliente';
const description = 'Cadastre um novo cliente.';

export default function NewCustomer() {
  function onSubmit(values: z.infer<typeof customerFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

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
