export type ProductType = 'Cru' | 'Past' | 'Conc' | '';

export interface TankConfig {
  id: string;
  maxVolume: number;
}

export interface TankEntry {
  id: string;
  volume: string; // Keeping as string to handle formatting (15.000) easily during input
  type: ProductType;
  date: string; // YYYY-MM-DD for input type="date"
  date2?: string; // Optional second date
  isSelected: boolean;
}