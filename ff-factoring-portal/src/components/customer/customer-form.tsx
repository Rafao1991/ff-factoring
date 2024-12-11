'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { validateCpfCnpj } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const documentNumberTitle = 'Documento (CPF/CNPJ) *';
const documentNumberIsMandatory = 'O documento deve ser informado';
const documentNumberIsTooShort = 'O documento deve ter pelo menos 11 dígitos';
const documentNumberIsTooLong = 'O documento deve ter no máximo 14 dígitos';
const documentNumberIsNotValid = 'O documento deve ser um CPF ou CNPJ';

const nameTitle = 'Nome *';
const nameIsMandatory = 'O nome deve ser informado';
const nameIsTooShort = 'O nome deve ter pelo menos 2 caracteres';

const emailTitle = 'Emails';
const emailPlaceholder = 'email@exemplo.com';
const emailIsNotValid = 'O email é inválido';

const phoneTitle = 'Telefones (somente números)';
const phonePlaceholder = '11999999999';
const phoneIsTooShort = 'O telefone deve ter pelo menos 10 dígitos';
const phoneIsTooLong = 'O telefone deve ter no máximo 11 dígitos';

export const customerFormSchema = z.object({
  documentNumber: z
    .string({
      required_error: documentNumberIsMandatory,
    })
    .min(11, {
      message: documentNumberIsTooShort,
    })
    .max(14, {
      message: documentNumberIsTooLong,
    })
    .refine((value) => validateCpfCnpj(value), {
      message: documentNumberIsNotValid,
    }),
  name: z
    .string({
      required_error: nameIsMandatory,
    })
    .min(2, {
      message: nameIsTooShort,
    }),
  emails: z
    .string()
    .trim()
    .email({
      message: emailIsNotValid,
    })
    .array(),
  phones: z
    .string()
    .trim()
    .min(10, { message: phoneIsTooShort })
    .max(11, { message: phoneIsTooLong })
    .array(),
});

export default function CustomerForm({
  onSubmit,
  isLoading,
  customer,
}: {
  onSubmit: (customer: CustomerSchema) => void;
  isLoading: boolean;
  customer?: Customer;
}) {
  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer
      ? {
          documentNumber: customer.documentNumber,
          name: customer.name,
          emails: customer.emails,
          phones: customer.phones,
        }
      : {
          documentNumber: '',
          name: '',
          emails: [],
          phones: [],
        },
  });

  const {
    fields: emailsFields,
    append: appendEmails,
    remove: removeEmails,
  } = useFieldArray({
    control: form.control,
    name: 'emails' as never,
  });

  const {
    fields: phonesFields,
    append: appendPhones,
    remove: removePhones,
  } = useFieldArray({
    control: form.control,
    name: 'phones' as never,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          name='documentNumber'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{documentNumberTitle}</FormLabel>
              <FormControl>
                <Input
                  placeholder={documentNumberTitle}
                  maxLength={14}
                  minLength={11}
                  disabled={!!customer}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{nameTitle}</FormLabel>
              <FormControl>
                <Input placeholder={nameTitle} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div id='emails' className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <FormLabel>{emailTitle}</FormLabel>
            <Button
              type='button'
              variant='outline'
              className='px-8'
              onClick={() => {
                appendEmails('');
              }}
            >
              <Plus />
            </Button>
          </div>
          {emailsFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`emails.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center space-x-2'>
                    <FormControl>
                      <Input {...field} placeholder={emailPlaceholder} />
                    </FormControl>
                    <Button
                      variant='destructive'
                      type='button'
                      className='px-8'
                      onClick={() => removeEmails(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div id='phones' className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <FormLabel>{phoneTitle}</FormLabel>
            <Button
              type='button'
              variant='outline'
              className='px-8'
              onClick={() => {
                appendPhones('');
              }}
            >
              <Plus />
            </Button>
          </div>
          {phonesFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`phones.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center space-x-2'>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={phonePlaceholder}
                        maxLength={11}
                        minLength={10}
                      />
                    </FormControl>
                    <Button
                      variant='destructive'
                      type='button'
                      className='px-8'
                      onClick={() => removePhones(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type='submit' disabled={!form.formState.isDirty || isLoading}>
          Salvar
        </Button>
      </form>
    </Form>
  );
}

export type CustomerSchema = z.infer<typeof customerFormSchema>;
