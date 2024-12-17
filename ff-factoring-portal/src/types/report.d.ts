type AssignorEarnings = TotalEarnings & {
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
  totalEarningsByAssignor: Record<string, AssignorEarnings>;
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
  transactionsByAssignor: Record<string, DailyTransaction>;
};
