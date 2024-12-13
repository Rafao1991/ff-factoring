type CustomerEarnings = TotalEarnings & {
  name: string;
};

type TotalEarnings = {
  check: number;
  ticket: number;
  total: number;
};

type LastSixMonthsEarnings = {
  startDate: string;
  endDate: string;
  totalEarnings: TotalEarnings;
  totalEarningsByMonth: Record<string, TotalEarnings>;
  totalEarningsByCustomer: Record<string, CustomerEarnings>;
};

type DailyTransaction = {
  name: string;
  checks: Transaction[];
  tickets: Transaction[];
  total: number;
};

type DailyTransactions = {
  startDate: string;
  endDate: string;
  transactionsByCustomer: Record<string, DailyTransaction>;
};
