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
import { Error } from '@/components/error';
import { Loading } from '@/components/loading';
import useListCustomers from '@/hooks/api/customers/use-list-customers';
import { formatCpfCnpj } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'react-oidc-context';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const filter = {
  placeholder: 'Filtrar pelo nome do sacado...',
  column: 'name',
};

const title = 'Sacados';
const description = 'Lista de sacados cadastrados.';

const newTransactionButton = 'Novo sacado';

export default function Payers() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    data: payers,
    isLoading,
    isError,
  } = useListCustomers(auth.user?.access_token || '');

  useEffect(() => {
    if (auth.isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: ['listCustomers'] });
    }
  }, [auth.isAuthenticated, queryClient]);

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
                `/dashboard/payer/detail?documentNumber=${row.getValue(
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

  if (!auth.isAuthenticated) {
    return <Loading />;
  }

  return (
    <>
      {!isError ? (
        !isLoading && payers ? (
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
                  onClick={() => router.push('/dashboard/payer/new')}
                >
                  {newTransactionButton}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={payers.filter((assignor) => assignor.type === 'P')}
                filter={filter}
              />
            </CardContent>
          </Card>
        ) : (
          <Loading />
        )
      ) : (
        <Error />
      )}
    </>
  );
}
