import React, { useState, useMemo } from 'react';
import { Calculator, Info, ChevronDown, ChevronUp, AlertCircle, IndianRupee, Layers, ArrowDownCircle, ArrowUpCircle, Minus } from 'lucide-react';
import { SalaryInputs, SalaryBreakup } from './types';
import { calculateSalary, formatCurrency } from './utils/calculations';
import InputSlider from './components/InputSlider';
import SalaryChart from './components/SalaryChart';

const App: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputs, setInputs] = useState<SalaryInputs>({
    annualCTC: 1200000,
    variablePayType: 'PERCENTAGE',
    variablePayAmount: 0,
    variablePayPercentage: 10,
    otherDeductionsMonthly: 3000,
    pfRatePercentage: 12,
  });

  const salaryData: SalaryBreakup = useMemo(() => calculateSalary(inputs), [inputs]);

  const updateInput = (key: keyof SalaryInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Calculator size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">SalarySense</h1>
              <p className="text-xs text-gray-500 font-medium">India • FY 2025-26 • New Regime</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <IndianRupee size={20} className="text-indigo-600" />
                Salary Details
              </h2>

              <InputSlider
                label="Annual CTC"
                value={inputs.annualCTC}
                onChange={(val) => updateInput('annualCTC', val)}
                min={500000}
                max={10000000}
                step={50000}
              />

              {/* Variable Pay Toggle */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Variable Pay / Bonus</label>
                  </div>
                  <div className="flex bg-gray-100 rounded-lg p-1 h-fit">
                    <button
                      onClick={() => updateInput('variablePayType', 'FIXED')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        inputs.variablePayType === 'FIXED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      Amount
                    </button>
                    <button
                      onClick={() => updateInput('variablePayType', 'PERCENTAGE')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        inputs.variablePayType === 'PERCENTAGE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      %
                    </button>
                  </div>
                </div>
                
                {inputs.variablePayType === 'FIXED' ? (
                   <InputSlider
                    label="Variable Amount (Yearly)"
                    value={inputs.variablePayAmount}
                    onChange={(val) => updateInput('variablePayAmount', val)}
                    min={0}
                    max={Math.floor(inputs.annualCTC * 0.5)}
                    step={10000}
                  />
                ) : (
                  <InputSlider
                    label="Percentage of CTC"
                    value={inputs.variablePayPercentage}
                    onChange={(val) => updateInput('variablePayPercentage', val)}
                    min={0}
                    max={50}
                    step={1}
                    format={false}
                    suffix="%"
                  />
                )}
              </div>

              {/* Advanced Settings */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {showAdvanced ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                  Adjust Deductions
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4 animate-fadeIn">
                      <InputSlider
                        label="Other Monthly Deductions"
                        value={inputs.otherDeductionsMonthly}
                        onChange={(val) => updateInput('otherDeductionsMonthly', val)}
                        min={0}
                        max={10000}
                        step={500}
                        helperText="E.g. Transport, Canteen, Insurance deductions."
                      />
                      <InputSlider
                        label="PF Contribution Rate"
                        value={inputs.pfRatePercentage}
                        onChange={(val) => updateInput('pfRatePercentage', val)}
                        min={12}
                        max={24}
                        step={1}
                        format={false}
                        suffix="% of Basic"
                      />
                  </div>
                )}
              </div>
            </div>

            {/* Assumptions Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <h3 className="font-semibold mb-2 flex items-center gap-1">
                <Info size={16} /> Calculation Assumptions
              </h3>
              <ul className="space-y-1 list-disc list-inside opacity-80 text-xs sm:text-sm">
                <li>Basic Salary = 50% of Overall CTC</li>
                <li>Employer PF = 12% of Basic (Deducted from CTC)</li>
                <li>Professional Tax = Fixed at ₹200/month</li>
                <li>Standard Deduction = ₹75,000</li>
                <li>Tax Regime = New Regime (FY 2025-26)</li>
                <li>Taxable Base = CTC - Standard Deduction</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-100 p-4 rounded-xl border border-gray-200">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
              <p>
                <strong>Disclaimer:</strong> This tool provides an estimate based on the New Tax Regime (FY 2025-26). 
                Actual salary may vary based on your company's specific salary structure, HR policies (HRA, LTA usage), 
                and investment declarations. Variable pay is assumed to be paid annually but is excluded from the monthly in-hand calculation (it affects the taxable income).
              </p>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary Result Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <IndianRupee size={150} />
              </div>
              
              <div className="relative z-10">
                <p className="text-indigo-100 font-medium text-lg mb-1">Estimated Monthly In-Hand</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl sm:text-6xl font-bold tracking-tight">
                    {formatCurrency(salaryData.inHandMonthly)}
                  </h2>
                </div>
                
                {/* Range */}
                <div className="mt-4 flex items-center gap-2 text-indigo-100 bg-white/10 w-fit px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                  <span>Range:</span>
                  <span className="font-semibold">
                    {formatCurrency(salaryData.inHandMonthly - 1500)} 
                    {' - '} 
                    {formatCurrency(salaryData.inHandMonthly + 1500)}
                  </span>
                </div>
              </div>
            </div>

            {/* Charts & Table Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visual Breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
                 <h3 className="text-gray-900 font-semibold w-full mb-4">Salary Distribution</h3>
                 <SalaryChart data={salaryData} />
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center gap-6">
                 <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                   <div className="border-l-2 border-indigo-100 pl-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Fixed CTC</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(salaryData.fixedCTC)}</p>
                   </div>
                   <div className="border-l-2 border-indigo-100 pl-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Variable Pay</p>
                      <p className="text-base font-bold text-gray-600">{formatCurrency(salaryData.variablePayYearly)}</p>
                   </div>
                   <div className="border-l-2 border-indigo-100 pl-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Gross Salary</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(salaryData.grossSalaryYearly)}</p>
                   </div>
                   <div className="border-l-2 border-amber-100 pl-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Employer PF</p>
                      <p className="text-base font-bold text-amber-600">{formatCurrency(salaryData.employerPF)}</p>
                   </div>
                 </div>
                 
                 <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                   <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Taxable Income</p>
                      <p className="text-sm font-bold text-gray-700">
                        {formatCurrency(salaryData.taxableIncome)}
                      </p>
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Annual Tax</p>
                      <p className={`text-sm font-bold ${salaryData.incomeTaxYearly > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(salaryData.incomeTaxYearly)}
                      </p>
                   </div>
                 </div>
              </div>
            </div>

            {/* Detailed Breakdown Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Breakdown</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
                  CTC: {formatCurrency(salaryData.annualCTC)}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-[10px] text-gray-400 uppercase bg-gray-50/30">
                    <tr>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">Components</th>
                      <th className="px-6 py-4 font-bold text-right border-b border-gray-100">Monthly</th>
                      <th className="px-6 py-4 font-bold text-right border-b border-gray-100">Yearly</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* EARNINGS */}
                    <tr className="bg-indigo-50/20">
                      <td colSpan={3} className="px-6 py-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest border-y border-indigo-50">Earnings Summary</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ArrowUpCircle size={14} className="text-green-500" />
                          <span className="font-medium text-gray-900">Gross Salary</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(salaryData.grossSalaryMonthly)}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(salaryData.grossSalaryYearly)}</td>
                    </tr>
                    
                    {/* DEDUCTIONS */}
                    <tr className="bg-red-50/20">
                      <td colSpan={3} className="px-6 py-2 text-[10px] font-black text-red-400 uppercase tracking-widest border-y border-red-50">Total Deductions</td>
                    </tr>
                    <tr className="text-gray-600 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 pl-10">
                        <div className="flex items-center gap-2">
                          <Minus size={12} className="text-amber-500" />
                          <span>Employee PF Contribution</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right text-red-500 font-medium">-{formatCurrency(salaryData.employeePFMonthly)}</td>
                      <td className="px-6 py-3 text-right text-red-500 font-medium">-{formatCurrency(salaryData.employeePFYearly)}</td>
                    </tr>
                    
                    <tr className="text-gray-600 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 pl-10">
                        <div className="flex items-center gap-2">
                          <Minus size={12} className="text-red-400" />
                          <span>Professional Tax</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right text-red-500 font-medium">-{formatCurrency(salaryData.professionalTaxMonthly)}</td>
                      <td className="px-6 py-3 text-right text-red-500 font-medium">-{formatCurrency(salaryData.professionalTaxYearly)}</td>
                    </tr>

                    <tr className="text-gray-600 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 pl-10">
                        <div className="flex items-center gap-2">
                          <Minus size={12} className="text-rose-600" />
                          <span>Income Tax (TDS)</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right text-red-600 font-medium">-{formatCurrency(salaryData.incomeTaxMonthly)}</td>
                      <td className="px-6 py-3 text-right text-red-600 font-medium">-{formatCurrency(salaryData.incomeTaxYearly)}</td>
                    </tr>

                    {inputs.otherDeductionsMonthly > 0 && (
                      <tr className="text-gray-600 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3 pl-10">
                           <div className="flex items-center gap-2">
                            <Minus size={12} className="text-gray-400" />
                            <span>Other Monthly Deductions</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 text-right text-red-500 font-medium">-{formatCurrency(inputs.otherDeductionsMonthly)}</td>
                        <td className="px-6 py-3 text-right text-red-500 font-medium">-{formatCurrency(salaryData.otherDeductionsYearly)}</td>
                      </tr>
                    )}

                    {/* FINAL NET */}
                    <tr className="bg-indigo-600 text-white font-black">
                      <td className="px-6 py-6 border-none">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 p-2 rounded-lg">
                            <Layers size={20} />
                          </div>
                          <div>
                            <span className="block text-sm opacity-80 font-medium">Final Net</span>
                            <span className="text-base">In-Hand Salary</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right text-2xl border-none align-middle">{formatCurrency(salaryData.inHandMonthly)}</td>
                      <td className="px-6 py-6 text-right text-2xl border-none align-middle">{formatCurrency(salaryData.inHandYearly)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;