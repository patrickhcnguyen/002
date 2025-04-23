// types for the invoicing

export type Invoice = {
  id: string;
  requestId: string;
  branch: string;
  client_name: string;
  due_date: string;
  amount: number;
  balance: number;
  status: 'unpaid' | 'partially_paid' | 'paid';
}

