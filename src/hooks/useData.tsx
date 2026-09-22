import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { ProcessedRespondent, FilterState, DataStats, StressorData, InsightData } from '../types';
import {
  processRawData,
  calculateStats,
  getStressorData,
  generateInsights,
  applyFilters,
  emptyFilters,
} from '../utils/dataProcessor';
import rawDataJson from '../data/teacher_wellbeing_data.json';

interface DataContextType {
  allData: ProcessedRespondent[];
  filteredData: ProcessedRespondent[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  stats: DataStats;
  stressors: StressorData[];
  insights: InsightData[];
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [allData, setAllData] = useState<ProcessedRespondent[]>([]);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const processed = processRawData(rawDataJson as any[]);
      setAllData(processed);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process dataset. Please check the data file.');
      setIsLoading(false);
    }
  }, []);

  const filteredData = useMemo(() => applyFilters(allData, filters), [allData, filters]);
  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);
  const stressors = useMemo(() => getStressorData(filteredData), [filteredData]);
  const insights = useMemo(() => generateInsights(filteredData), [filteredData]);

  const resetFilters = () => setFilters(emptyFilters);

  return (
    <DataContext.Provider value={{
      allData, filteredData, filters, setFilters, resetFilters,
      stats, stressors, insights, isLoading, error,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}
