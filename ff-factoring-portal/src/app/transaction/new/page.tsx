'use client';

import TransactionForm, {
  transactionFormSchema,
} from '@/components/transaction/transaction-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { z } from 'zod';

const title = 'Nova operação';
const description = 'Crie uma nova operação.';

export default function NewTransaction() {
  function onSubmit(values: z.infer<typeof transactionFormSchema>) {
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
        <TransactionForm onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
