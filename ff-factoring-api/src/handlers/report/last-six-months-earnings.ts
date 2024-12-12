import {
  getInternalServerErrorResponse,
  getNotFoundResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { getTransactionsByDateRange } from '@/services/transaction';
import { addDays, format } from 'date-fns';
import { subMonths } from 'date-fns/subMonths';

const getTransactions = async (
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  console.info({
    action: 'getTransactions',
    message: 'Getting transactions by date range',
    startDate: format(startDate, 'PPP'),
    endDate: format(endDate, 'PPP'),
  });
  const transactions = await getTransactionsByDateRange(startDate, endDate);
  console.info({
    action: 'getTransactions',
    message: 'Transactions by date range retrieved',
    transactions,
  });
  return transactions;
};

const getMonthObject = (transactions: Transaction[]) => {
  console.info({
    action: 'getMonthObject',
    message: 'Months object creation started',
  });

  const months = Array.from(
    new Set(
      transactions.map(
        (transaction) => new Date(transaction.date).getMonth() + 1
      )
    )
  ).sort((a, b) => a - b);

  if (months.length < 6) {
    const minMonth = months[0];
    const maxMonth = months[months.length - 1];
    console.info({
      action: 'getMonthObject',
      message: 'Number of months is less than 6, adding missing months',
      minMonth,
      maxMonth,
    });

    for (let i = minMonth; i <= maxMonth; i++) {
      if (!months.includes(i)) {
        months.push(i);
      }
    }
  }

  const monthsObject = Object.fromEntries(
    months.map((month) => [
      month,
      {
        check: 0,
        ticket: 0,
        total: 0,
      },
    ])
  );
  console.info({
    action: 'getMonthObject',
    message: 'Months object creation finished',
    monthsObject,
  });

  return monthsObject;
};

const getTotalEarningsByMonth = async (transactions: Transaction[]) => {
  console.info({
    action: 'getTotalEarningsByMonth',
    message: 'Total earnings by month started',
  });

  const totalEarningsByMonth = getMonthObject(transactions);

  const totalEarnings = {
    check: 0,
    ticket: 0,
    total: 0,
  };

  transactions.forEach((transaction) => {
    console.info({
      action: 'getTotalEarningsByMonth',
      message: `Processing transaction ${transaction.id}`,
    });

    const month = new Date(transaction.date).getMonth() + 1;

    totalEarnings.total += transaction.amount;
    totalEarningsByMonth[month].total += transaction.amount;

    if (transaction.type === 'cheque') {
      totalEarnings.check += transaction.amount;
      totalEarningsByMonth[month].check += transaction.amount;
      return;
    }

    if (transaction.type === 'duplicata') {
      totalEarnings.ticket += transaction.amount;
      totalEarningsByMonth[month].ticket += transaction.amount;
      return;
    }
  });

  console.info({
    action: 'getTotalEarningsByMonth',
    message: 'Total earnings by month finished',
    totalEarnings,
    totalEarningsByMonth,
  });

  return { totalEarnings, totalEarningsByMonth };
};

const getTotalEarningsByCustomer = async (transactions: Transaction[]) => {
  console.info({
    action: 'getTotalEarningsByCustomer',
    message: 'Total earnings by customer started',
  });

  let totalEarningsByCustomer = Object.fromEntries(
    transactions.map((transaction) => [
      transaction.customerDocumentNumber,
      {
        name: transaction.customerName,
        check: 0,
        ticket: 0,
        total: 0,
      },
    ])
  );

  transactions.forEach((transaction) => {
    console.info({
      action: 'getTotalEarningsByCustomer',
      message: `Processing transaction ${transaction.id}`,
    });

    const customerDocumentNumber = transaction.customerDocumentNumber;
    totalEarningsByCustomer[customerDocumentNumber].total += transaction.amount;

    if (transaction.type === 'cheque') {
      totalEarningsByCustomer[customerDocumentNumber].check +=
        transaction.amount;
      return;
    }

    if (transaction.type === 'duplicata') {
      totalEarningsByCustomer[customerDocumentNumber].ticket +=
        transaction.amount;
      return;
    }
  });

  totalEarningsByCustomer = Object.fromEntries(
    Object.entries(totalEarningsByCustomer).sort((a, b) => {
      return b[1].total - a[1].total;
    })
  );

  console.info({
    action: 'getTotalEarningsByCustomer',
    message: 'Total earnings by customer finished',
    totalEarningsByCustomer,
  });

  return totalEarningsByCustomer;
};

export const lastSixMonthsEarningsHandler = async () => {
  console.info({
    action: 'lastSixMonthsEarningsHandler',
    message: 'Last 6 months earnings handler started',
  });

  try {
    const today = new Date();
    const endDate = addDays(today, 1);
    const startDate = subMonths(today, 6);
    const transactions = await getTransactions(startDate, endDate);

    if (transactions.length === 0) {
      return getNotFoundResponse('Transactions not found');
    }

    const [{ totalEarnings, totalEarningsByMonth }, totalEarningsByCustomer] =
      await Promise.all([
        getTotalEarningsByMonth(transactions),
        getTotalEarningsByCustomer(transactions),
      ]);

    const response = {
      startDate: format(startDate, 'PP'),
      endDate: format(endDate, 'PP'),
      totalEarnings,
      totalEarningsByMonth,
      totalEarningsByCustomer,
    };

    console.info({
      action: 'lastSixMonthsEarningsHandler',
      message: 'Last 6 months earnings handler finished',
      response,
    });

    return getSuccessResponse('Last 6 months earnings', response);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error getting transaction', error);
  }
};
