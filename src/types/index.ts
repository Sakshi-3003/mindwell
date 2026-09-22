// Types for the Teacher Wellbeing Dashboard

export interface RawRespondent {
  Gender: number;
  Age: number;
  'Academic Title': number;
  'Educational Level': number;
  Experience: number;
  City: number;
  JI1: number; JI2: number; JI3: number; JI4: number;
  JI5: number; JI6: number; JI7: number; JI8: number;
  WE1: number; WE2: number; WE3: number; WE4: number;
  WE5: number; WE6: number;
  IR1: number; IR2: number; IR3: number; IR4: number;
  IR5: number; IR6: number;
  RA1: number; RA2: number; RA3: number; RA4: number;
  RA5: number; RA6: number;
  RO1: number; RO2: number; RO3: number; RO4: number;
  RO5: number; RO6: number;
  OC1: number; OC2: number; OC3: number; OC4: number;
  OC5: number; OC6: number;
  JB1: number; JB2: number; JB3: number; JB4: number;
  JB5: number; JB6: number; JB7: number; JB8: number;
  PWB1: number; PWB2: number; PWB3: number; PWB4: number;
  PWB5: number; PWB6: number; PWB7: number; PWB8: number;
}

export interface ProcessedRespondent {
  id: number;
  gender: string;
  ageGroup: string;
  academicTitle: string;
  educationalLevel: string;
  experienceGroup: string;
  city: string;
  // Composite scores (average of items, scale 1-5)
  jobInsecurity: number;
  workEnvironment: number;
  interpersonalRelations: number;
  roleAmbiguity: number;
  roleOverload: number;
  organizationalClimate: number;
  jobBurnout: number;
  psychologicalWellbeing: number;
  // Derived composite scores
  overallStress: number;     // Average of all 6 stress factors
  supportPriority: number;   // 0-100 composite score
  supportCategory: 'Lower' | 'Moderate' | 'Higher';
}

export interface FilterState {
  [key: string]: string[];
  gender: string[];
  ageGroup: string[];
  academicTitle: string[];
  educationalLevel: string[];
  experienceGroup: string[];
  city: string[];
}

export interface DataStats {
  totalRespondents: number;
  avgWellbeing: number;
  avgStress: number;
  avgJobBurnout: number;
  avgJobInsecurity: number;
  highStressCount: number;
  highStressPercent: number;
  missingValues: number;
  duplicateRecords: number;
  variablesAnalyzed: number;
}

export interface StressorData {
  name: string;
  fullName: string;
  avgScore: number;
  normalizedScore: number;
  description: string;
}

export interface DemographicBreakdown {
  category: string;
  avgWellbeing: number;
  avgStress: number;
  avgBurnout: number;
  count: number;
}

export interface InsightData {
  title: string;
  description: string;
  type: 'observation' | 'pattern' | 'recommendation';
  severity: 'info' | 'attention' | 'concern';
}

export interface CorrelationPoint {
  x: number;
  y: number;
  xLabel: string;
  yLabel: string;
}
