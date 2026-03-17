import { SalaryInputs, SalaryBreakup, TaxSlab } from '../types';

export const STANDARD_DEDUCTION = 75000;
export const CESS_RATE = 0.04;
export const TAX_REBATE_LIMIT = 1275000;
export const FIXED_PROFESSIONAL_TAX_MONTHLY = 200;

// New Tax Regime Slabs (FY 2025-26)
const TAX_SLABS: TaxSlab[] = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.10 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.20 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: null, rate: 0.30 },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateSalary = (inputs: SalaryInputs): SalaryBreakup => {
  const {
    annualCTC,
    variablePayType,
    variablePayAmount,
    variablePayPercentage,
    otherDeductionsMonthly,
    pfRatePercentage,
  } = inputs;

  // 1. Calculate Variable Pay
  let variablePayYearly = 0;
  if (variablePayType === 'FIXED') {
    variablePayYearly = variablePayAmount;
  } else {
    variablePayYearly = (annualCTC * variablePayPercentage) / 100;
  }

  // 2. Fixed CTC
  const fixedCTC = Math.max(0, annualCTC - variablePayYearly);

  // 3. Components Breakup
  // Basic is 25% of Overall CTC
  const basicSalary = annualCTC * 0.25;

  // PF Calculations
  const pfRate = pfRatePercentage / 100;
  const employerPF = basicSalary * pfRate;
  const employeePFYearly = basicSalary * pfRate;

  // Special Allowance
  const specialAllowance = Math.max(0, fixedCTC - (basicSalary + employerPF));

  const grossSalaryYearly = basicSalary + specialAllowance;

  // 4. Taxable Income (User requested: whole CTC - standard deduction)
  const taxableIncome = Math.max(0, annualCTC - STANDARD_DEDUCTION);

  // 5. Income Tax Calculation
  let incomeTaxYearly = 0;

  if (taxableIncome > TAX_REBATE_LIMIT) {
    for (const slab of TAX_SLABS) {
      const previousSlabMax = slab.min;
      const currentSlabMax = slab.max || Infinity;
      
      if (taxableIncome > previousSlabMax) {
        const taxableAmountInSlab = Math.min(taxableIncome, currentSlabMax) - previousSlabMax;
        incomeTaxYearly += taxableAmountInSlab * slab.rate;
      }
    }
  }

  // Add Cess
  incomeTaxYearly = incomeTaxYearly * (1 + CESS_RATE);

  // 6. Monthly Calculations
  const grossSalaryMonthly = grossSalaryYearly / 12;
  const employeePFMonthly = employeePFYearly / 12;
  const incomeTaxMonthly = incomeTaxYearly / 12;
  const professionalTaxYearly = FIXED_PROFESSIONAL_TAX_MONTHLY * 12;
  const otherDeductionsYearly = otherDeductionsMonthly * 12;

  const inHandMonthly = 
    grossSalaryMonthly - 
    employeePFMonthly - 
    FIXED_PROFESSIONAL_TAX_MONTHLY - 
    incomeTaxMonthly - 
    otherDeductionsMonthly;

  const inHandYearly = inHandMonthly * 12;

  return {
    annualCTC,
    fixedCTC,
    basicSalary,
    specialAllowance,
    employerPF,
    grossSalaryYearly,
    grossSalaryMonthly,
    taxableIncome,
    incomeTaxYearly,
    incomeTaxMonthly,
    employeePFYearly,
    employeePFMonthly,
    professionalTaxYearly,
    professionalTaxMonthly: FIXED_PROFESSIONAL_TAX_MONTHLY,
    otherDeductionsYearly,
    inHandMonthly,
    inHandYearly,
    variablePayYearly
  };
};