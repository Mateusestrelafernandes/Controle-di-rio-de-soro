import React from 'react';
import { TankConfig, TankEntry, ProductType } from '../types';

interface TankRowProps {
  config: TankConfig;
  entry: TankEntry;
  onChange: (id: string, field: keyof TankEntry, value: any) => void;
}

export const TankRow: React.FC<TankRowProps> = ({ config, entry, onChange }) => {
  
  // Format number with dots (e.g., 20000 -> 20.000)
  const formatNumber = (num: string | number) => {
    const n = typeof num === 'string' ? parseInt(num.replace(/\./g, ''), 10) : num;
    if (isNaN(n)) return '';
    return n.toLocaleString('pt-BR');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const rawValue = e.target.value.replace(/\D/g, '');
    const formatted = formatNumber(rawValue);
    onChange(config.id, 'volume', formatted);
  };

  const setMaxVolume = () => {
    onChange(config.id, 'volume', formatNumber(config.maxVolume));
  };

  const add2000 = () => {
    const current = typeof entry.volume === 'string' 
      ? parseInt(entry.volume.replace(/\./g, ''), 10) || 0 
      : 0;
    // Check max limit
    const newValue = Math.min(current + 2000, config.maxVolume);
    onChange(config.id, 'volume', formatNumber(newValue));
  };

  const subtract1000 = () => {
    const current = typeof entry.volume === 'string' 
      ? parseInt(entry.volume.replace(/\./g, ''), 10) || 0 
      : 0;
    // Check min limit (0)
    const newValue = Math.max(current - 1000, 0);
    onChange(config.id, 'volume', formatNumber(newValue));
  };

  const productTypes: ProductType[] = ['Cru', 'Past', 'Conc'];

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-2 p-3 rounded-lg border transition-colors ${entry.isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
      
      {/* ID Label */}
      <div className="w-full sm:w-12 font-bold text-lg text-gray-700 text-center sm:text-left">
        {config.id}
      </div>

      {/* Volume Input Group */}
      <div className="flex-1 w-full sm:w-auto flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            className="w-full pl-3 pr-16 py-2 border border-slate-600 bg-slate-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right font-mono placeholder-slate-400"
            value={entry.volume}
            onChange={handleVolumeChange}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">L</span>
        </div>
        
        <button
          onClick={add2000}
          title="Adicionar 2000"
          className="p-2 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors flex items-center justify-center font-bold text-xs min-w-[50px] whitespace-nowrap"
        >
          +2000
        </button>

        <button
          onClick={subtract1000}
          title="Subtrair 1000"
          className="p-2 text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-md transition-colors flex items-center justify-center font-bold text-xs min-w-[50px] whitespace-nowrap"
        >
          -1000
        </button>

        <button
          onClick={setMaxVolume}
          title={`Máximo: ${formatNumber(config.maxVolume)}`}
          className="p-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors flex items-center justify-center font-bold text-xs min-w-[50px]"
        >
          MAX
        </button>
      </div>

      {/* Type Toggle Buttons */}
      <div className="w-full sm:w-48 bg-slate-800 rounded-md p-1 flex gap-1 h-10 border border-slate-600">
        {productTypes.map((type) => (
          <button
            key={type}
            onClick={() => onChange(config.id, 'type', type)}
            className={`flex-1 rounded-sm text-sm font-medium transition-colors ${
              entry.type === type
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Date Input */}
      <div className="w-full sm:w-40">
        <input
          type="date"
          className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
          value={entry.date}
          onChange={(e) => onChange(config.id, 'date', e.target.value)}
        />
      </div>

      {/* Checkbox */}
      <div className="w-full sm:w-auto flex justify-center sm:justify-end pl-2">
        <label className="flex items-center cursor-pointer p-2 relative">
          <input
            type="checkbox"
            className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
            checked={entry.isSelected}
            onChange={(e) => onChange(config.id, 'isSelected', e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
};