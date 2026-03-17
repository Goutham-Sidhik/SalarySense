import React from 'react';
import { formatCurrency } from '../utils/calculations';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  format?: boolean;
  suffix?: string;
  helperText?: string;
}

const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = true,
  suffix = '',
  helperText
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center">
          <input
            type="number"
            className="text-right font-bold text-indigo-600 bg-indigo-50 border-0 rounded px-2 py-1 w-32 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={value}
            onChange={(e) => {
                const val = parseFloat(e.target.value);
                if(!isNaN(val)) onChange(val);
            }}
          />
          {suffix && <span className="ml-1 text-sm text-gray-500">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{format ? formatCurrency(min) : min + suffix}</span>
        <span>{format ? formatCurrency(max) : max + suffix}</span>
      </div>
      {helperText && <p className="mt-1 text-xs text-gray-500 italic">{helperText}</p>}
    </div>
  );
};

export default InputSlider;