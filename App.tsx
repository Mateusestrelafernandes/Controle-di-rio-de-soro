import React, { useState, useCallback } from 'react';
import { TANKS_CONFIG } from './constants';
import { TankEntry, ProductType } from './types';
import { TankRow } from './components/TankRow';
import { ClipboardCopy, RefreshCw, CheckCircle2 } from 'lucide-react';

// Initialize default state based on constants
const getInitialState = (): TankEntry[] => {
  // Calculate Today (Local Time)
  const todayDate = new Date();
  const offset = todayDate.getTimezoneOffset();
  const todayLocal = new Date(todayDate.getTime() - (offset*60*1000));
  const today = todayLocal.toISOString().split('T')[0];

  // Calculate Yesterday
  const yesterdayDate = new Date(todayLocal);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  // Configuration sets
  const tanksWithToday = ['B1', 'B2', 'B3', 'B4', 'B5'];
  const tanksWithPast = ['B5'];
  const tanksWithConc = ['B6', 'B7', 'B8', 'B9'];

  return TANKS_CONFIG.map((config) => {
    // Determine Date
    // B1-B5 get Today, others get Yesterday
    const date = tanksWithToday.includes(config.id) ? today : yesterday;

    // Determine Type
    let type: ProductType = 'Cru'; // Default
    if (tanksWithPast.includes(config.id)) {
      type = 'Past';
    } else if (tanksWithConc.includes(config.id)) {
      type = 'Conc';
    }

    return {
      id: config.id,
      volume: '',
      type: type,
      date: date,
      date2: '', // Initialize second date as empty
      isSelected: false,
    };
  });
};

const App: React.FC = () => {
  const [entries, setEntries] = useState<TankEntry[]>(getInitialState());
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleEntryChange = useCallback((id: string, field: keyof TankEntry, value: any) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          // If editing volume/type/date, auto-select the row for convenience
          const shouldAutoSelect = field === 'volume' || field === 'type' || field === 'date' || field === 'date2';
          return { ...entry, [field]: value, isSelected: shouldAutoSelect ? true : entry.isSelected };
        }
        return entry;
      })
    );
  }, []);

  const handleReset = () => {
    if (window.confirm('Deseja atualizar a página e limpar todos os dados?')) {
      window.location.reload();
    }
  };

  const handleCopy = async () => {
    const selectedEntries = entries.filter((e) => e.isSelected);
    
    if (selectedEntries.length === 0) {
      alert('Selecione pelo menos uma linha para copiar.');
      return;
    }

    const listText = selectedEntries.map((entry) => {
      // Parse date 1 from YYYY-MM-DD to DD/MM
      const [year1, month1, day1] = entry.date.split('-');
      let dateStr = `${day1}/${month1}`;

      // Handle second date if present
      if (entry.date2) {
        const [year2, month2, day2] = entry.date2.split('-');
        if (month1 === month2) {
          // Same month: "05 e 06/12"
          dateStr = `${day1} e ${day2}/${month1}`;
        } else {
          // Different month: "30/11 e 01/12"
          dateStr = `${day1}/${month1} e ${day2}/${month2}`;
        }
      }
      
      const typeLower = entry.type.toLowerCase();
      
      // Format: ID VOLUME TYPE DATE
      // Example: B1 15.000 cru 05/12
      return `${entry.id} ${entry.volume || '0'} ${typeLower} ${dateStr}`;
    }).join('\n');

    // Determine greeting based on current hour
    const hour = new Date().getHours();
    let greeting = 'Bom dia';
    if (hour >= 12 && hour < 18) {
      greeting = 'Boa tarde';
    } else if (hour >= 18) {
      greeting = 'Boa noite';
    }

    const textToCopy = `${greeting}\n\n${listText}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Falha ao copiar', err);
      alert('Erro ao copiar para a área de transferência.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Controle de Tanques</h1>
            <p className="text-sm text-gray-500">Registro diário de volumes</p>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Atualizar / Limpar tudo"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="flex flex-col gap-3">
          {TANKS_CONFIG.map((config) => {
            const entry = entries.find((e) => e.id === config.id);
            if (!entry) return null;
            return (
              <TankRow
                key={config.id}
                config={config}
                entry={entry}
                onChange={handleEntryChange}
              />
            );
          })}
        </div>
      </main>

      {/* Sticky Footer Action */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            {entries.filter(e => e.isSelected).length} linhas selecionadas
          </div>
          
          <button
            onClick={handleCopy}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
              copyStatus === 'copied' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {copyStatus === 'copied' ? (
              <>
                <CheckCircle2 size={20} />
                Copiado com Sucesso!
              </>
            ) : (
              <>
                <ClipboardCopy size={20} />
                Copiar Informações Selecionadas
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;