import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SalaryBreakup } from '../types';

interface SalaryChartProps {
  data: SalaryBreakup;
}

const SalaryChart: React.FC<SalaryChartProps> = ({ data }) => {
  const chartData = [
    { name: 'In-Hand Salary', value: data.inHandYearly, color: '#10B981' }, // Emerald-500
    { name: 'Income Tax', value: data.incomeTaxYearly, color: '#EF4444' }, // Red-500
    { name: 'Employee PF', value: data.employeePFYearly, color: '#F59E0B' }, // Amber-500
    { name: 'Other Deductions', value: data.professionalTaxYearly + data.otherDeductionsYearly, color: '#6366F1' }, // Indigo-500
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-sm">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-gray-600">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(payload[0].value)}
            <span className="text-xs text-gray-400 ml-1">/yr</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
        <div className="text-xs text-gray-500 font-medium">Net Salary</div>
        <div className="text-sm font-bold text-gray-800">{((data.inHandYearly / data.grossSalaryYearly) * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
};

export default SalaryChart;