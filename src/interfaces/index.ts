export interface IDefaultResponse {
  message: string;
  status: number;
}

export interface IUser {
  _id: any;
  username: string;
  email: string;
  password?: string;
  created_date: string;
  updated_date: string;
}

export interface IUserJWT {
  _id: any;
  username: string;
  email: string;
}

export interface ICategory {
  _id: any;
  name: string;
  user_id: string;
  icon: string;
}

export interface IBudget {
  _id: any;
  name: string;
  user_id: string;
  category_id: string;
  amount: number;
  spent: number;
  start_date: Date;
  end_date: Date;
  created_date: Date;
  updated_date: Date;
}

export interface ICashflow {
  _id: any;
  user_id: string;
  amount: number;
  budget_id?: string;
  category_id?: string;
  type: string;
  notes: string;
  input_date: Date;
  created_date: Date;
  updated_date: Date;
}

export interface IBudgetCashflowReport {
  cashflows: any;
  totalExpenses: number;
  totalIncome: number;
  totalBalance: number;
  budget: IBudget;
}

export interface IBudgetCashflowPortion {
  expensePercentage: number;
  incomePercentage: number;
  totalExpenses: number;
  totalIncome: number;
  budget: IBudget;
}

export interface IBudgetDailyReport {
  totalExpenses: number;
  totalIncome: number;
  totalBalance: number;
  date: string;
  details: ICashflowExport[];
}

export interface ICashflowReport {
  cashflows: ICashflow[];
  budgetReport: IBudgetCashflowPortion[];
  dailyReport: IBudgetDailyReport[];
  totalExpenses: number;
  totalIncome: number;
  totalBalance: number;
}

// exported format
export interface IBudgetExport {
  _id: any;
  name: string;
  user_id: string;
  category: ICategory;
  amount: number;
  spent: number;
  start_date: Date;
  end_date: Date;
  created_date: Date;
  updated_date: Date;
}

export interface ICashflowExport {
  _id: any;
  user_id: string;
  amount: number;
  budget?: IBudget;
  category?: ICategory;
  type: string;
  notes: string;
  input_date: Date;
  created_date: Date;
  updated_date: Date;
}

export function ICashflowToExport(
  cashflow: ICashflow,
  budget: IBudget | undefined,
  category: ICategory | undefined
): ICashflowExport {
  const cashflowExport: ICashflowExport = {
    _id: cashflow._id,
    user_id: cashflow.user_id,
    amount: cashflow.amount,
    budget: budget,
    category: category,
    type: cashflow.type,
    notes: cashflow.notes,
    input_date: cashflow.input_date,
    created_date: cashflow.created_date,
    updated_date: cashflow.updated_date,
  };
  return cashflowExport;
}

export function IBudgetToExport(
  budgetItem: IBudget,
  category: ICategory
): IBudgetExport {
  const budgetExport: IBudgetExport = {
    _id: budgetItem._id,
    name: budgetItem.name,
    user_id: budgetItem.user_id,
    category: category,
    amount: budgetItem.amount,
    spent: budgetItem.spent,
    start_date: budgetItem.start_date,
    end_date: budgetItem.end_date,
    created_date: budgetItem.created_date,
    updated_date: budgetItem.updated_date,
  };
  return budgetExport;
}
