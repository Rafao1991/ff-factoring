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
import { Textarea } from '@/components/ui/textarea';
import useListCustomers from '@/hooks/api/customers/use-list-customers';
import { cn, formatCpfCnpj } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from 'react-oidc-context';
import { z } from 'zod';

const today = new Date();
const minDate = new Date(today.getFullYear(), 0, 1);

const typeTitle = 'Qual o tipo da operação? *';
const typeIsMandatory = 'O tipo da operação é obrigatório';

const assignorTitle = 'Cedente *';
const assignorIsMandatory = 'O cedente é obrigatório';
const assignorIsTooShort = 'O cedente deve ter pelo menos 2 caracteres';
const assignorSelect = 'Selecione um cedente';
const assignorSearchTitle = 'Buscar por cedente...';
const assignorNotFound = 'Nenhum cedente encontrado';

const payerTitle = 'Sacado *';
const payerIsMandatory = 'O sacado é obrigatório';
const payerIsTooShort = 'O sacado deve ter pelo menos 2 caracteres';
const payerSelect = 'Selecione um sacado';
const payerSearchTitle = 'Buscar por sacado...';
const payerNotFound = 'Nenhum sacado encontrado';

const investorTitle = 'Investidor';
const investorSelect = 'Selecione um investidor';
const investorSearchTitle = 'Buscar por investidor...';
const investorNotFound = 'Nenhum investidor encontrado';

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

interface SelectData {
  label: string;
  value: string;
}

interface PageData {
  assignors: SelectData[];
  payers: SelectData[];
  investors: SelectData[];
}

const transactionFormSchema = z.object({
  assignorDocumentNumber: z.string().trim(),
  assignorName: z
    .string({
      required_error: assignorIsMandatory,
    })
    .trim()
    .min(2, {
      message: assignorIsTooShort,
    }),
  payerDocumentNumber: z.string().trim(),
  payerName: z
    .string({
      required_error: payerIsMandatory,
    })
    .trim()
    .min(2, {
      message: payerIsTooShort,
    }),
  investorDocumentNumber: z.string().trim().optional(),
  investorName: z.string().trim().optional(),
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
  description: z.string().trim().optional(),
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
  const [selectData, setSelectData] = useState<PageData>({
    assignors: [],
    payers: [],
    investors: [],
  });

  useEffect(() => {
    if (!isSuccess) return;

    const assignors: SelectData[] = [];
    const payers: SelectData[] = [];
    const investors: SelectData[] = [
      {
        label: 'Selecione um investidor',
        value: '',
      },
    ];

    data.forEach((customer: Customer) => {
      switch (customer.type) {
        case 'A': {
          assignors.push({
            label: `${formatCpfCnpj(customer.documentNumber)} : ${
              customer.name
            }`,
            value: customer.documentNumber,
          });
          return;
        }
        case 'P': {
          payers.push({
            label: `${formatCpfCnpj(customer.documentNumber)} : ${
              customer.name
            }`,
            value: customer.documentNumber,
          });
          return;
        }
        case 'I': {
          investors.push({
            label: `${formatCpfCnpj(customer.documentNumber)} : ${
              customer.name
            }`,
            value: customer.documentNumber,
          });
          return;
        }
      }
    });

    setSelectData({
      assignors,
      payers,
      investors,
    });
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
          assignorName: transaction.assignorName,
          assignorDocumentNumber: transaction.assignorDocumentNumber,
          payerName: transaction.payerName,
          payerDocumentNumber: transaction.payerDocumentNumber,
          investorName: transaction.investorName,
          investorDocumentNumber: transaction.investorDocumentNumber,
          description: transaction.description,
        }
      : {
          amount: 0,
          date: new Date(new Date().setHours(0, 0, 0, 0)),
        },
  });

  return (
    <>
      {selectData?.assignors && (
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
              name='assignorName'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>{assignorTitle}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} role='combobox'>
                          {field.value
                            ? selectData.assignors.find(
                                (assignor) =>
                                  assignor.value ===
                                  form.getValues('assignorDocumentNumber')
                              )?.label
                            : assignorSelect}
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
                          placeholder={assignorSearchTitle}
                          className='h-9'
                        />
                        <CommandList>
                          <CommandEmpty>{assignorNotFound}</CommandEmpty>
                          <CommandGroup>
                            {selectData.assignors?.map((assignor) => (
                              <CommandItem
                                value={assignor.label}
                                key={assignor.value}
                                onSelect={() => {
                                  if (!data) return;

                                  const found = data.find(
                                    (item) =>
                                      item.documentNumber === assignor.value &&
                                      item.type === 'A'
                                  );

                                  if (!found) return;

                                  form.setValue('assignorName', found.name, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                    shouldTouch: true,
                                  });
                                  form.setValue(
                                    'assignorDocumentNumber',
                                    found.documentNumber,
                                    {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                      shouldTouch: true,
                                    }
                                  );
                                }}
                              >
                                {assignor.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    assignor.value ===
                                      form.getValues('assignorDocumentNumber')
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
              name='payerName'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>{payerTitle}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} role='combobox'>
                          {field.value
                            ? selectData.payers.find(
                                (payer) =>
                                  payer.value ===
                                  form.getValues('payerDocumentNumber')
                              )?.label
                            : payerSelect}
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
                          placeholder={payerSearchTitle}
                          className='h-9'
                        />
                        <CommandList>
                          <CommandEmpty>{payerNotFound}</CommandEmpty>
                          <CommandGroup>
                            {selectData.payers?.map((payer) => (
                              <CommandItem
                                value={payer.label}
                                key={payer.value}
                                onSelect={() => {
                                  if (!data) return;

                                  const found = data.find(
                                    (item) =>
                                      item.documentNumber === payer.value &&
                                      item.type === 'P'
                                  );

                                  if (!found) return;

                                  form.setValue('payerName', found.name, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                    shouldTouch: true,
                                  });
                                  form.setValue(
                                    'payerDocumentNumber',
                                    found.documentNumber,
                                    {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                      shouldTouch: true,
                                    }
                                  );
                                }}
                              >
                                {payer.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    payer.value ===
                                      form.getValues('payerDocumentNumber')
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
              name='investorName'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>{investorTitle}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} role='combobox'>
                          {field.value
                            ? selectData.investors.find(
                                (investor) =>
                                  investor.value ===
                                  form.getValues('investorDocumentNumber')
                              )?.label
                            : investorSelect}
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
                          placeholder={investorSearchTitle}
                          className='h-9'
                        />
                        <CommandList>
                          <CommandEmpty>{investorNotFound}</CommandEmpty>
                          <CommandGroup>
                            {selectData.investors?.map((investor) => (
                              <CommandItem
                                value={investor.label}
                                key={investor.value}
                                onSelect={() => {
                                  if (
                                    investor.value === '' &&
                                    investor.label === 'Selecione um investidor'
                                  ) {
                                    form.setValue('investorName', '', {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                      shouldTouch: true,
                                    });
                                    form.setValue(
                                      'investorDocumentNumber',
                                      '',
                                      {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                        shouldTouch: true,
                                      }
                                    );
                                    return;
                                  }

                                  if (!data) return;

                                  const found = data.find(
                                    (item) =>
                                      item.documentNumber === investor.value &&
                                      item.type === 'I'
                                  );

                                  if (!found) return;

                                  form.setValue('investorName', found.name, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                    shouldTouch: true,
                                  });
                                  form.setValue(
                                    'investorDocumentNumber',
                                    found.documentNumber,
                                    {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                      shouldTouch: true,
                                    }
                                  );
                                }}
                              >
                                {investor.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    investor.value ===
                                      form.getValues('investorDocumentNumber')
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
            <FormField
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
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
      )}
    </>
  );
}

export type TransactionSchema = z.infer<typeof transactionFormSchema>;
