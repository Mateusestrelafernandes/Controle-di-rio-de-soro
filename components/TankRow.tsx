import React from 'react';
import { TankConfig, TankEntry, ProductType } from '../types';
import { Plus, X } from 'lucide-react';

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

  const handleAddDate2 = () => {
    // Set second date to same as first date initially for convenience
    onChange(config.id, 'date2', entry.date);
  };

  const handleRemoveDate2 = () => {
    onChange(config.id, 'date2', '');
  };

  const productTypes: ProductType[] = ['Cru', 'Past', 'Conc'];

  return (
    <div className={`flex flex-col xl:flex-row items-start xl:items-center gap-4 p-4 rounded-lg border shadow-sm transition-colors ${entry.isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
      
      {/* Top Row on Mobile: Checkbox and ID */}
      <div className="w-full xl:w-auto flex items-center gap-4 border-b xl:border-b-0 pb-3 xl:pb-0 border-gray-100">
        <label className="flex items-center cursor-pointer relative">
          <input
            type="checkbox"
            className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
            checked={entry.isSelected}
            onChange={(e) => onChange(config.id, 'isSelected', e.target.checked)}
          />
        </label>
        <div className="font-bold text-xl text-gray-800 w-12">
          {config.id}
        </div>
      </div>

      {/* Main Controls Section */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-start md:items-center flex-1">
        
        {/* Volume Group */}
        <div className="w-full md:flex-1 flex flex-wrap items-center gap-2">
          <div className="relative flex-grow md:flex-grow-0 md:w-32">
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
          
          <div className="flex gap-2 flex-grow md:flex-grow-0 justify-between md:justify-start">
            <button
              onClick={add2000}
              title="Adicionar 2000"
              className="px-3 py-2 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors flex items-center justify-center font-bold text-xs flex-1 md:flex-none whitespace-nowrap"
            >
              +2000
            </button>

            <button
              onClick={subtract1000}
              title="Subtrair 1000"
              className="px-3 py-2 text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-md transition-colors flex items-center justify-center font-bold text-xs flex-1 md:flex-none whitespace-nowrap"
            >
              -1000
            </button>

            <button
              onClick={setMaxVolume}
              title={`Máximo: ${formatNumber(config.maxVolume)}`}
              className="px-3 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors flex items-center justify-center font-bold text-xs flex-1 md:flex-none"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Type Toggle */}
        <div className="w-full md:w-auto min-w-[180px]">
          <div className="bg-slate-800 rounded-md p-1 flex gap-1 h-10 border border-slate-600 w-full">
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
        </div>

        {/* Date Inputs */}
        <div className="w-full md:w-auto min-w-[170px] flex flex-col gap-2">
          <div className="flex items-center gap-1 w-full">
            <input
              type="date"
              className="flex-1 p-2 border border-slate-600 bg-slate-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
              value={entry.date}
              onChange={(e) => onChange(config.id, 'date', e.target.value)}
            />
            {!entry.date2 && (
              <button
                onClick={handleAddDate2}
                className="p-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md transition-colors flex-shrink-0"
                title="Adicionar segunda data"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          
          {entry.date2 && (
            <div className="flex items-center gap-1 w-full animate-in slide-in-from-top-1 duration-200">
              <input
                type="date"
                className="flex-1 p-2 border border-slate-600 bg-slate-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
                value={entry.date2}
                onChange={(e) => onChange(config.id, 'date2', e.target.value)}
              />
              <button
                onClick={handleRemoveDate2}
                className="p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-md transition-colors flex-shrink-0"
                title="Remover segunda data"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};