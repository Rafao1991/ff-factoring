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

const typeIsMandatory = 'O tipo de cliente é obrigatório';
const typeIsNotValid = 'O tipo de cliente deve ser A, P ou I';

const nameTitle = 'Nome *';
const nameIsMandatory = 'O nome deve ser informado';
const nameIsTooShort = 'O nome deve ter pelo menos 2 caracteres';

const addressTitle = 'Endereço';
const addressNumberTitle = 'Número';
const addressComplementTitle = 'Complemento';
const cityTitle = 'Cidade';
const stateTitle = 'Estado';
const zipTitle = 'CEP';

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
    .trim()
    .min(11, {
      message: documentNumberIsTooShort,
    })
    .max(14, {
      message: documentNumberIsTooLong,
    })
    .refine((value) => validateCpfCnpj(value), {
      message: documentNumberIsNotValid,
    }),
  type: z
    .string({
      required_error: typeIsMandatory,
    })
    .trim()
    .refine((value) => value === 'A' || value === 'P' || value === 'I', {
      message: typeIsNotValid,
    }),
  name: z
    .string({
      required_error: nameIsMandatory,
    })
    .trim()
    .min(2, {
      message: nameIsTooShort,
    }),
  address: z.string().trim().optional(),
  addressNumber: z.string().trim().optional(),
  addressComplement: z.string().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  zip: z.string().trim().optional(),
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

interface CustomerFormProps {
  onSubmit: (customer: CustomerSchema) => void;
  isLoading: boolean;
  type: CustomerType;
  customer?: Customer;
}

export default function CustomerForm({
  onSubmit,
  isLoading,
  type,
  customer,
}: CustomerFormProps) {
  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer
      ? {
          documentNumber: customer.documentNumber,
          type,
          name: customer.name,
          address: customer.address,
          addressNumber: customer.addressNumber,
          addressComplement: customer.addressComplement,
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          emails: customer.emails,
          phones: customer.phones,
        }
      : {
          documentNumber: '',
          type,
          name: '',
          address: '',
          addressNumber: '',
          addressComplement: '',
          city: '',
          state: '',
          zip: '',
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

  if (!type) return <>O tipo de cliente é obrigatório</>;

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

        {type === 'A' && (
          <>
            <FormField
              name='address'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{addressTitle}</FormLabel>
                  <FormControl>
                    <Input placeholder={addressTitle} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='addressNumber'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{addressNumberTitle}</FormLabel>
                  <FormControl>
                    <Input placeholder={addressNumberTitle} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='addressComplement'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{addressComplementTitle}</FormLabel>
                  <FormControl>
                    <Input placeholder={addressComplementTitle} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='city'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{cityTitle}</FormLabel>
                  <FormControl>
                    <Input placeholder={cityTitle} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='state'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{stateTitle}</FormLabel>
                  <FormControl>
                    <Input placeholder={stateTitle} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='zip'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{zipTitle}</FormLabel>
                  <FormControl>
                    <Input placeholder={zipTitle} {...field} />
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
          </>
        )}

        <Button type='submit' disabled={!form.formState.isDirty || isLoading}>
          Salvar
        </Button>
      </form>
    </Form>
  );
}

export type CustomerSchema = z.infer<typeof customerFormSchema>;
