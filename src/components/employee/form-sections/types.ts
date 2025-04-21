export interface PayRate {
  id: string;
  position_title: string;
  default_pay_rate: number;
  custom_pay_rate?: number;
  branch_position_id: string;
  effective_from?: string;
}