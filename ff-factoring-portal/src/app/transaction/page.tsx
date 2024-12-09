'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatCpfCnpj } from '@/lib/utils';

enum TransactionType {
  Check = 'cheque',
  Ticket = 'duplicata',
}

const customers: Customer[] = [
  {
    name: 'Rafael Sousa',
    documentNumber: '12345678901',
    emails: [],
    phones: [],
  },
  {
    name: 'João Silva',
    documentNumber: '12345678000101',
    emails: [],
    phones: [],
  },
  {
    name: 'Maria Silva',
    documentNumber: '12345678901',
    emails: [],
    phones: [],
  },
  {
    name: 'Pedro Sousa',
    documentNumber: '12345678000101',
    emails: [],
    phones: [],
  },
];

const transactions: Transaction[] = [
  {
    id: '1',
    customerDocumentNumber: customers[0].documentNumber,
    customerName: customers[0].name,
    amount: 100,
    date: new Date(2024, 6, 1),
    dueDate: new Date(2024, 9, 1),
    type: TransactionType.Check,
    completed: true,
  },
  {
    id: '2',
    customerDocumentNumber: customers[1].documentNumber,
    customerName: customers[1].name,
    amount: 100,
    date: new Date(2024, 9, 1),
    dueDate: new Date(2024, 11, 1),
    type: TransactionType.Ticket,
    completed: true,
  },
  {
    id: '3',
    customerDocumentNumber: customers[2].documentNumber,
    customerName: customers[2].name,
    amount: 100,
    date: new Date(2024, 10, 1),
    dueDate: new Date(2025, 2, 1),
    type: TransactionType.Check,
    completed: false,
  },
  {
    id: '4',
    customerDocumentNumber: customers[3].documentNumber,
    customerName: customers[3].name,
    amount: 100,
    date: new Date(2024, 11, 1),
    dueDate: new Date(2025, 5, 1),
    type: TransactionType.Ticket,
    completed: false,
  },
  {
    id: '5',
    customerDocumentNumber: customers[2].documentNumber,
    customerName: customers[2].name,
    amount: 100,
    date: new Date(2024, 11, 1),
    dueDate: new Date(2025, 2, 1),
    type: TransactionType.Check,
    completed: false,
  },
  {
    id: '6',
    customerDocumentNumber: customers[1].documentNumber,
    customerName: customers[1].name,
    amount: 100,
    date: new Date(2025, 1, 1),
    dueDate: new Date(2025, 3, 1),
    type: TransactionType.Ticket,
    completed: false,
  },
  {
    id: '7',
    customerDocumentNumber: customers[3].documentNumber,
    customerName: customers[3].name,
    amount: 100,
    date: new Date(2024, 11, 1),
    dueDate: new Date(2025, 5, 1),
    type: TransactionType.Ticket,
    completed: false,
  },
  {
    id: '8',
    customerDocumentNumber: customers[2].documentNumber,
    customerName: customers[2].name,
    amount: 100,
    date: new Date(2024, 10, 1),
    dueDate: new Date(2025, 2, 1),
    type: TransactionType.Check,
    completed: false,
  },
  {
    id: '9',
    customerDocumentNumber: customers[1].documentNumber,
    customerName: customers[1].name,
    amount: 100,
    date: new Date(2025, 1, 1),
    dueDate: new Date(2025, 3, 1),
    type: TransactionType.Ticket,
    completed: false,
  },
  {
    id: '10',
    customerDocumentNumber: customers[0].documentNumber,
    customerName: customers[0].name,
    amount: 100,
    date: new Date(2024, 6, 1),
    dueDate: new Date(2024, 9, 1),
    type: TransactionType.Check,
    completed: true,
  },
  {
    id: '11',
    customerDocumentNumber: customers[1].documentNumber,
    customerName: customers[1].name,
    amount: 100,
    date: new Date(2024, 9, 1),
    dueDate: new Date(2024, 11, 1),
    type: TransactionType.Ticket,
    completed: true,
  },
  {
    id: '12',
    customerDocumentNumber: customers[2].documentNumber,
    customerName: customers[2].name,
    amount: 100,
    date: new Date(2024, 10, 1),
    dueDate: new Date(2025, 2, 1),
    type: TransactionType.Check,
    completed: false,
  },
  {
    id: '13',
    customerDocumentNumber: customers[3].documentNumber,
    customerName: customers[3].name,
    amount: 1000,
    date: new Date(2024, 10, 1),
    dueDate: new Date(2025, 2, 1),
    type: TransactionType.Ticket,
    completed: false,
  },
  {
    id: '14',
    customerDocumentNumber: customers[2].documentNumber,
    customerName: customers[2].name,
    amount: 100,
    date: new Date(2024, 10, 1),
    dueDate: new Date(2025, 2, 1),
    type: TransactionType.Check,
    completed: false,
  },
];

const filter = {
  placeholder: 'Filtrar pelo nome do cliente...',
  column: 'customerName',
};

const title = 'Operações';
const description = 'Lista de operações.';

const newTransactionButton = 'Nova operação';

export default function Transactions() {
  const router = useRouter();

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'type',
      header: 'Tipo',
    },
    {
      accessorKey: 'customerDocumentNumber',
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
        const value: string = row.getValue('customerDocumentNumber');
        const formattedValue = formatCpfCnpj(value ?? '');

        return <>{formattedValue}</>;
      },
    },
    {
      accessorKey: 'customerName',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cliente
            <ArrowUpDown />
          </Button>
        );
      },
    },
    {
      accessorKey: 'date',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date: Date = row.getValue('date');
        const formatted = format(date, 'PPP');

        return <>{formatted}</>;
      },
    },
    {
      accessorKey: 'dueDate',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Vencimento
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date: Date = row.getValue('dueDate');
        const formatted = format(date, 'PPP');

        return <>{formatted}</>;
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Valor
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('pt-Br', {
          style: 'currency',
          currency: 'BRL',
        }).format(amount);

        return <>{formatted}</>;
      },
    },
    {
      accessorKey: 'completed',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Baixado
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const completed: boolean = row.getValue('completed');

        return <>{completed ? 'Sim' : 'Não'}</>;
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
            onClick={() => router.push(`/transaction/detail?id=${row.id}`)}
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
            onClick={() => router.push('/transaction/new')}
          >
            {newTransactionButton}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={transactions} filter={filter} />
      </CardContent>
    </Card>
  );
}
