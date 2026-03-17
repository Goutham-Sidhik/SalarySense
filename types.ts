export interface SalaryInputs {
  annualCTC: number;
  variablePayAmount: number;
  variablePayType: 'FIXED' | 'PERCENTAGE';
  variablePayPercentage: number;
  otherDeductionsMonthly: number;
  pfRatePercentage: number;
}

export interface SalaryBreakup {
  annualCTC: number;
  fixedCTC: number;
  basicSalary: number;
  specialAllowance: number;
  employerPF: number;
  grossSalaryYearly: number;
  grossSalaryMonthly: number;
  taxableIncome: number;
  incomeTaxYearly: number;
  incomeTaxMonthly: number;
  employeePFYearly: number;
  employeePFMonthly: number;
  professionalTaxYearly: number;
  professionalTaxMonthly: number;
  otherDeductionsYearly: number;
  inHandMonthly: number;
  inHandYearly: number;
  variablePayYearly: number;
}

export interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}