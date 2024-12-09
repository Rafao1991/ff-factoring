'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { formatCpfCnpj, formatPhone } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const filter = {
  placeholder: 'Filtrar pelo nome do cliente...',
  column: 'name',
};

const title = 'Clientes';
const description = 'Lista de clientes cadastrados.';

const newTransactionButton = 'Novo cliente';

export default function Customers() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers`
      );
      const { data } = await response.json();

      setCustomers(data);
    };

    fetchCustomers();
  }, []);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'documentNumber',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            CPF/CNPJ
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value: string = row.getValue('documentNumber');
        const formattedValue = formatCpfCnpj(value ?? '');

        return <>{formattedValue}</>;
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nome
            <ArrowUpDown />
          </Button>
        );
      },
    },
    {
      accessorKey: 'emails',
      header: 'Emails',
      cell: ({ row }) => {
        const emails: string[] = row.getValue('emails');

        return (
          <div className='flex flex-col gap-2'>
            {emails.map((email) => (
              <p key={email}>{email}</p>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'phones',
      header: 'Telefones',
      cell: ({ row }) => {
        const phones: string[] = row.getValue('phones');

        return (
          <div className='flex flex-col gap-2'>
            {phones.map((phone) => (
              <p key={phone}>{formatPhone(phone)}</p>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() =>
              router.push(
                `/customer/detail?documentNumber=${row.getValue(
                  'documentNumber'
                )}`
              )
            }
          >
            <ChevronRight />
          </Button>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between space-x-2'>
          <div className='flex flex-col space-y-1.5'>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            variant='default'
            size='lg'
            onClick={() => router.push('/customer/new')}
          >
            {newTransactionButton}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {customers ? (
          <DataTable columns={columns} data={customers} filter={filter} />
        ) : (
          <div className='flex items-center justify-center h-screen'>
            <Loader2 className='animate-spin w-12 h-12' />
            <p className='text-center'>Carregando a lista de clientes...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
