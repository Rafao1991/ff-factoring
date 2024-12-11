'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useListCustomers from '@/hooks/api/customers/use-list-customers';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from 'react-oidc-context';
import { z } from 'zod';

const today = new Date();
const minDate = new Date(today.getFullYear(), 0, 1);

const typeTitle = 'Qual o tipo da operação? *';
const typeIsMandatory = 'O tipo da operação é obrigatório';

const customerTitle = 'Nome do cliente *';
const customerIsMandatory = 'O nome do cliente é obrigatório';
const customerIsTooShort = 'O nome do cliente deve ter pelo menos 2 caracteres';
const customerSelect = 'Selecione um cliente';
const customerSearchTitle = 'Buscar por nome do cliente...';
const customerNotFound = 'Nenhum cliente encontrado';

const amountTitle = 'Valor *';
const amountIsMandatory = 'O valor da operação é obrigatório';
const amountIsTooLow = 'O valor da operação deve ser maior que 0';

const dateTitle = 'Data *';
const dateIsMandatory = 'A data da operação é obrigatória';
const dateIsTooLow = `A data da operação deve ser maior que ${format(
  minDate,
  'PPP'
)}`;

const dueDateTitle = 'Data de vencimento *';
const dueDateIsMandatory = 'A data de vencimento da operação é obrigatória';
const dueDateIsTooLow = `A data de vencimento deve ser maior que ${format(
  minDate,
  'PPP'
)}`;

const pickADate = 'Escolha uma data';

enum TransactionType {
  Check = 'cheque',
  Ticket = 'duplicata',
}

interface CustomerSelect {
  label: string;
  value: string;
}

const transactionFormSchema = z.object({
  customerDocumentNumber: z.string(),
  customerName: z
    .string({
      required_error: customerIsMandatory,
    })
    .trim()
    .min(2, {
      message: customerIsTooShort,
    }),
  date: z
    .date({
      required_error: dateIsMandatory,
    })
    .min(minDate, {
      message: dateIsTooLow,
    }),
  dueDate: z
    .date({
      required_error: dueDateIsMandatory,
    })
    .min(minDate, {
      message: dueDateIsTooLow,
    }),
  amount: z.coerce
    .number({
      required_error: amountIsMandatory,
    })
    .gt(0, {
      message: amountIsTooLow,
    }),
  type: z.nativeEnum(TransactionType, {
    required_error: typeIsMandatory,
  }),
});

export default function TransactionForm({
  onSubmit,
  isLoading,
  transaction,
}: {
  onSubmit: (values: TransactionSchema) => void;
  isLoading: boolean;
  transaction?: Transaction;
}) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const { data, isSuccess } = useListCustomers(auth.user?.access_token || '');
  const [customers, setCustomers] = useState<CustomerSelect[] | null>(null);

  useEffect(() => {
    if (!isSuccess) return;
    const customers = data.map<CustomerSelect>((customerData) => {
      return {
        label: customerData.name,
        value: customerData.documentNumber,
      };
    });

    setCustomers(customers);
  }, [isSuccess, data]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: ['listCustomers'] });
    }
  }, [auth.isAuthenticated, queryClient]);

  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transaction
      ? {
          amount: transaction.amount,
          date: new Date(transaction.date),
          dueDate: new Date(transaction.dueDate),
          type: transaction.type as TransactionType,
          customerName: transaction.customerName,
          customerDocumentNumber: transaction.customerDocumentNumber,
        }
      : {
          amount: 0,
          date: new Date(),
        },
  });

  return (
    <>
      {customers ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              name='type'
              control={form.control}
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>{typeTitle}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value={TransactionType.Check} />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          {TransactionType.Check}
                        </FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value={TransactionType.Ticket} />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          {TransactionType.Ticket}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='customerName'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>{customerTitle}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} role='combobox'>
                          {field.value
                            ? customers.find(
                                (customer) => customer.label === field.value
                              )?.label
                            : customerSelect}
                          <ChevronsUpDown className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto p-0 bg-white shadow-lg'
                      align='start'
                    >
                      <Command>
                        <CommandInput
                          placeholder={customerSearchTitle}
                          className='h-9'
                        />
                        <CommandList>
                          <CommandEmpty>{customerNotFound}</CommandEmpty>
                          <CommandGroup>
                            {customers?.map((customer) => (
                              <CommandItem
                                value={customer.label}
                                key={customer.value}
                                onSelect={() => {
                                  form.setValue('customerName', customer.label);
                                  form.setValue(
                                    'customerDocumentNumber',
                                    customer.value
                                  );
                                }}
                              >
                                {customer.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    customer.label === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='amount'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{amountTitle}</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='date'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>{dateTitle}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'}>
                          {field.value ? format(field.value, 'PPP') : pickADate}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto p-0 bg-white shadow-lg'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) => date < minDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='dueDate'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>{dueDateTitle}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'}>
                          {field.value ? format(field.value, 'PPP') : pickADate}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto p-0 bg-white shadow-lg'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date < (form.getValues().date || new Date())
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={!form.formState.isDirty || isLoading}
            >
              Salvar
            </Button>
          </form>
        </Form>
      ) : (
        <div className='flex items-center justify-center h-screen'>
          <Loader2 className='animate-spin w-12 h-12' />
          <p className='text-center'>Carregando clientes...</p>
        </div>
      )}
    </>
  );
}

export type TransactionSchema = z.infer<typeof transactionFormSchema>;
