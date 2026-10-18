import type { EntityDto, ExtensibleObject } from '@abp/ng.core';
import type { ExpenseStatus } from './expense-status.enum';

export interface CreateOrUpdateExpense extends ExtensibleObject {
  housingId?: string;
  title: string;
  category: string;
  amount: number;
  paidAmount: number;
  expenseDate: string;
  dueDate?: string;
  paymentDate?: string;
  supplier?: string;
  currentAccount?: string;
  cashDesk?: string;
  documentNo?: string;
  description?: string;
  status: ExpenseStatus;
  isRecurring: boolean;
  recurringPeriod?: string;
  invoiceFile?: string;
  invoiceFileName?: string;
}

export interface ExpenseDto extends EntityDto<string> {
  housingId?: string;
  title?: string;
  category?: string;
  amount: number;
  paidAmount: number;
  expenseDate?: string;
  dueDate?: string;
  paymentDate?: string;
  supplier?: string;
  currentAccount?: string;
  cashDesk?: string;
  documentNo?: string;
  description?: string;
  status: ExpenseStatus;
  isRecurring: boolean;
  recurringPeriod?: string;
  invoiceFile?: string;
  invoiceFileName?: string;
}
