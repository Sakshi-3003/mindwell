// Data processing utility for the Teacher Wellbeing Dataset
// Dataset: Mendeley Data — Survey data on the impact of Occupational Stress
// on Psychological Well-being of Teachers among Private Universities in India

import type { RawRespondent, ProcessedRespondent, DataStats, StressorData, InsightData, DemographicBreakdown, FilterState } from '../types';

// ─── Codebook Mappings ───────────────────────────────────────────
// Based on the dataset structure analysis:
// Gender: 1=Male, 2=Female
// Age: 1=Below 25, 2=25-30, 3=31-35, 4=36-40, 5=41-45, 6=Above 45
// Academic Title: 1=Professor, 2=Associate Professor, 3=Assistant Professor, 4=Lecturer
// Educational Level: 1=PhD, 2=Master's
// Experience: 1=Less than 5 years, 2=5-10, 3=11-15, 4=16-20, 5=More than 20
// City: 1-5 (various cities)
//
// Likert items are all 1-5 scale (Strongly Disagree to Strongly Agree)
// Higher scores = stronger agreement with the construct measured

export const GENDER_MAP: Record<number, string> = {
  1: 'Male',
  2: 'Female',
};

export const AGE_MAP: Record<number, string> = {
  1: 'Below 25',
  2: '25–30',
  3: '31–35',
  4: '36–40',
  5: '41–45',
  6: 'Above 45',
};

export const TITLE_MAP: Record<number, string> = {
  1: 'Professor',
  2: 'Associate Professor',
  3: 'Assistant Professor',
  4: 'Lecturer',
};

export const EDUCATION_MAP: Record<number, string> = {
  1: 'PhD',
  2: "Master's",
};

export const EXPERIENCE_MAP: Record<number, string> = {
  1: 'Less than 5 years',
  2: '5–10 years',
  3: '11–15 years',
  4: '16–20 years',
  5: 'More than 20 years',
};

export const CITY_MAP: Record<number, string> = {
  1: 'City A',
  2: 'City B',
  3: 'City C',
  4: 'City D',
  5: 'City E',
};

// ─── Construct Definitions ──────────────────────────────────────
export const CONSTRUCTS = {
  JI: {
    name: 'Job Insecurity',
    shortName: 'Job Insecurity',
    items: ['JI1', 'JI2', 'JI3', 'JI4', 'JI5', 'JI6', 'JI7', 'JI8'],
    description: 'Perceived insecurity about job stability and continuity',
    isStressor: true,
  },
  WE: {
    name: 'Work Environment Stress',
    shortName: 'Work Environment',
    items: ['WE1', 'WE2', 'WE3', 'WE4', 'WE5', 'WE6'],
    description: 'Stress related to workload and work environment conditions',
    isStressor: true,
  },
  IR: {
    name: 'Interpersonal Relations',
    shortName: 'Interpersonal',
    items: ['IR1', 'IR2', 'IR3', 'IR4', 'IR5', 'IR6'],
    description: 'Challenges in workplace interpersonal relationships',
    isStressor: true,
  },
  RA: {
    name: 'Role Ambiguity',
    shortName: 'Role Ambiguity',
    items: ['RA1', 'RA2', 'RA3', 'RA4', 'RA5', 'RA6'],
    description: 'Unclear role expectations and responsibilities',
    isStressor: true,
  },
  RO: {
    name: 'Role Overload',
    shortName: 'Role Overload',
    items: ['RO1', 'RO2', 'RO3', 'RO4', 'RO5', 'RO6'],
    description: 'Excessive role demands beyond capacity',
    isStressor: true,
  },
  OC: {
    name: 'Organizational Climate',
    shortName: 'Org. Climate',
    items: ['OC1', 'OC2', 'OC3', 'OC4', 'OC5', 'OC6'],
    description: 'Perceived organizational environment and support',
    isStressor: true,
  },
  JB: {
    name: 'Job Burnout',
    shortName: 'Job Burnout',
    items: ['JB1', 'JB2', 'JB3', 'JB4', 'JB5', 'JB6', 'JB7', 'JB8'],
    description: 'Emotional exhaustion and burnout from work',
    isStressor: false,
  },
  PWB: {
    name: 'Psychological Well-Being',
    shortName: 'Well-Being',
    items: ['PWB1', 'PWB2', 'PWB3', 'PWB4', 'PWB5', 'PWB6', 'PWB7', 'PWB8'],
    description: 'Overall psychological well-being and mental health',
    isStressor: false,
  },
} as const;

// ─── Helper Functions ───────────────────────────────────────────

function avg(values: number[]): number {
  const valid = values.filter(v => v != null && !isNaN(v));
  if (valid.length === 0) return 0;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

function getCompositeScore(row: RawRespondent, items: readonly string[]): number {
  const values = items.map(item => (row as unknown as Record<string, number>)[item]).filter(v => v != null && !isNaN(v));
  return avg(values);
}

/** Normalize a value from its original range to 0-100 */
function normalizeTo100(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return ((value - min) / (max - min)) * 100;
}

/** Classify support priority into categories */
function getSupportCategory(score: number): 'Lower' | 'Moderate' | 'Higher' {
  if (score < 40) return 'Lower';
  if (score < 60) return 'Moderate';
  return 'Higher';
}

// ─── Main Processing Function ────────────────────────────────────

export function processRawData(rawData: RawRespondent[]): ProcessedRespondent[] {
  return rawData.map((row, index) => {
    const jobInsecurity = getCompositeScore(row, CONSTRUCTS.JI.items);
    const workEnvironment = getCompositeScore(row, CONSTRUCTS.WE.items);
    const interpersonalRelations = getCompositeScore(row, CONSTRUCTS.IR.items);
    const roleAmbiguity = getCompositeScore(row, CONSTRUCTS.RA.items);
    const roleOverload = getCompositeScore(row, CONSTRUCTS.RO.items);
    const organizationalClimate = getCompositeScore(row, CONSTRUCTS.OC.items);
    const jobBurnout = getCompositeScore(row, CONSTRUCTS.JB.items);
    const psychologicalWellbeing = getCompositeScore(row, CONSTRUCTS.PWB.items);

    // Overall stress = average of all 6 occupational stress factors
    const overallStress = avg([
      jobInsecurity, workEnvironment, interpersonalRelations,
      roleAmbiguity, roleOverload, organizationalClimate,
    ]);

    // Support Priority Indicator (0-100)
    // Formula: higher stress + higher burnout + lower wellbeing
    // Each component normalized from 1-5 Likert scale to 0-100
    const normalizedStress = normalizeTo100(overallStress, 1, 5);
    const normalizedBurnout = normalizeTo100(jobBurnout, 1, 5);
    const inverseWellbeing = 100 - normalizeTo100(psychologicalWellbeing, 1, 5);

    const supportPriority = (
      0.35 * normalizedStress +
      0.35 * normalizedBurnout +
      0.30 * inverseWellbeing
    );

    return {
      id: index + 1,
      gender: GENDER_MAP[row.Gender] || 'Unknown',
      ageGroup: AGE_MAP[row.Age] || 'Unknown',
      academicTitle: TITLE_MAP[row['Academic Title']] || 'Unknown',
      educationalLevel: EDUCATION_MAP[row['Educational Level']] || 'Unknown',
      experienceGroup: EXPERIENCE_MAP[row.Experience] || 'Unknown',
      city: CITY_MAP[row.City] || 'Unknown',
      jobInsecurity,
      workEnvironment,
      interpersonalRelations,
      roleAmbiguity,
      roleOverload,
      organizationalClimate,
      jobBurnout,
      psychologicalWellbeing,
      overallStress,
      supportPriority: Math.round(supportPriority * 10) / 10,
      supportCategory: getSupportCategory(supportPriority),
    };
  });
}

// ─── Statistics ─────────────────────────────────────────────────

export function calculateStats(data: ProcessedRespondent[]): DataStats {
  const stressValues = data.map(d => d.overallStress);
  const wellbeingValues = data.map(d => d.psychologicalWellbeing);
  const burnoutValues = data.map(d => d.jobBurnout);
  const insecurityValues = data.map(d => d.jobInsecurity);

  // High stress threshold: score above 3.5 on 1-5 scale (top 30% of range)
  const highStressCount = data.filter(d => d.overallStress > 3.5).length;

  return {
    totalRespondents: data.length,
    avgWellbeing: Math.round(avg(wellbeingValues) * 100) / 100,
    avgStress: Math.round(avg(stressValues) * 100) / 100,
    avgJobBurnout: Math.round(avg(burnoutValues) * 100) / 100,
    avgJobInsecurity: Math.round(avg(insecurityValues) * 100) / 100,
    highStressCount,
    highStressPercent: Math.round((highStressCount / data.length) * 1000) / 10,
    missingValues: 0, // Pre-cleaned dataset
    duplicateRecords: 0,
    variablesAnalyzed: 60,
  };
}

// ─── Stressor Analysis ──────────────────────────────────────────

export function getStressorData(data: ProcessedRespondent[]): StressorData[] {
  const stressors: StressorData[] = [
    {
      name: 'Role Overload',
      fullName: CONSTRUCTS.RO.name,
      avgScore: avg(data.map(d => d.roleOverload)),
      normalizedScore: 0,
      description: CONSTRUCTS.RO.description,
    },
    {
      name: 'Org. Climate',
      fullName: CONSTRUCTS.OC.name,
      avgScore: avg(data.map(d => d.organizationalClimate)),
      normalizedScore: 0,
      description: CONSTRUCTS.OC.description,
    },
    {
      name: 'Work Environment',
      fullName: CONSTRUCTS.WE.name,
      avgScore: avg(data.map(d => d.workEnvironment)),
      normalizedScore: 0,
      description: CONSTRUCTS.WE.description,
    },
    {
      name: 'Role Ambiguity',
      fullName: CONSTRUCTS.RA.name,
      avgScore: avg(data.map(d => d.roleAmbiguity)),
      normalizedScore: 0,
      description: CONSTRUCTS.RA.description,
    },
    {
      name: 'Interpersonal',
      fullName: CONSTRUCTS.IR.name,
      avgScore: avg(data.map(d => d.interpersonalRelations)),
      normalizedScore: 0,
      description: CONSTRUCTS.IR.description,
    },
    {
      name: 'Job Insecurity',
      fullName: CONSTRUCTS.JI.name,
      avgScore: avg(data.map(d => d.jobInsecurity)),
      normalizedScore: 0,
      description: CONSTRUCTS.JI.description,
    },
  ];

  // Normalize all scores to 0-100 for fair comparison (all on same 1-5 scale)
  stressors.forEach(s => {
    s.avgScore = Math.round(s.avgScore * 100) / 100;
    s.normalizedScore = Math.round(normalizeTo100(s.avgScore, 1, 5) * 10) / 10;
  });

  return stressors.sort((a, b) => b.avgScore - a.avgScore);
}

// ─── Demographic Breakdowns ─────────────────────────────────────

export function getDemographicBreakdown(
  data: ProcessedRespondent[],
  dimension: keyof Pick<ProcessedRespondent, 'gender' | 'ageGroup' | 'academicTitle' | 'educationalLevel' | 'experienceGroup' | 'city'>
): DemographicBreakdown[] {
  const groups: Record<string, ProcessedRespondent[]> = {};
  data.forEach(d => {
    const key = d[dimension] as string;
    if (!groups[key]) groups[key] = [];
    groups[key].push(d);
  });

  return Object.entries(groups)
    .filter(([key]) => key !== 'Unknown')
    .map(([category, members]) => ({
      category,
      avgWellbeing: Math.round(avg(members.map(m => m.psychologicalWellbeing)) * 100) / 100,
      avgStress: Math.round(avg(members.map(m => m.overallStress)) * 100) / 100,
      avgBurnout: Math.round(avg(members.map(m => m.jobBurnout)) * 100) / 100,
      count: members.length,
    }));
}

// ─── Distribution Analysis ──────────────────────────────────────

export function getDistribution(
  data: ProcessedRespondent[],
  field: keyof ProcessedRespondent
): { label: string; count: number; percent: number }[] {
  const values = data.map(d => d[field] as number);

  // Create bins for 1-5 Likert composites
  const bins = [
    { label: 'Low (1.0–2.0)', min: 1, max: 2.01 },
    { label: 'Below Average (2.0–3.0)', min: 2.01, max: 3.01 },
    { label: 'Moderate (3.0–3.5)', min: 3.01, max: 3.51 },
    { label: 'Above Average (3.5–4.0)', min: 3.51, max: 4.01 },
    { label: 'High (4.0–5.0)', min: 4.01, max: 5.01 },
  ];

  return bins.map(bin => {
    const count = values.filter(v => v >= bin.min && v < bin.max).length;
    return {
      label: bin.label,
      count,
      percent: Math.round((count / data.length) * 1000) / 10,
    };
  });
}

// ─── Filter Logic ───────────────────────────────────────────────

export function applyFilters(data: ProcessedRespondent[], filters: FilterState): ProcessedRespondent[] {
  return data.filter(d => {
    if (filters.gender.length && !filters.gender.includes(d.gender)) return false;
    if (filters.ageGroup.length && !filters.ageGroup.includes(d.ageGroup)) return false;
    if (filters.academicTitle.length && !filters.academicTitle.includes(d.academicTitle)) return false;
    if (filters.educationalLevel.length && !filters.educationalLevel.includes(d.educationalLevel)) return false;
    if (filters.experienceGroup.length && !filters.experienceGroup.includes(d.experienceGroup)) return false;
    if (filters.city.length && !filters.city.includes(d.city)) return false;
    return true;
  });
}

export const emptyFilters: FilterState = {
  gender: [],
  ageGroup: [],
  academicTitle: [],
  educationalLevel: [],
  experienceGroup: [],
  city: [],
};

// ─── Insight Engine ─────────────────────────────────────────────

export function generateInsights(data: ProcessedRespondent[]): InsightData[] {
  if (data.length === 0) return [];

  const insights: InsightData[] = [];
  const stressors = getStressorData(data);
  const stats = calculateStats(data);

  // 1. Highest stressor
  const highest = stressors[0];
  insights.push({
    title: `${highest.fullName} shows the highest average stress score`,
    description: `Among the six occupational stress dimensions measured, ${highest.fullName.toLowerCase()} has the highest average score of ${highest.avgScore} out of 5.0. This suggests it may be the most broadly reported source of occupational stress in this sample.`,
    type: 'observation',
    severity: highest.avgScore > 4 ? 'concern' : 'attention',
  });

  // 2. High stress prevalence
  insights.push({
    title: `${stats.highStressPercent}% of respondents report elevated stress`,
    description: `${stats.highStressCount} out of ${stats.totalRespondents} respondents show an average occupational stress score above 3.5 (on a 1–5 scale), which falls in the upper range of the measurement scale.`,
    type: 'observation',
    severity: stats.highStressPercent > 50 ? 'concern' : 'attention',
  });

  // 3. Wellbeing average
  const wellbeingLevel = stats.avgWellbeing > 3.5 ? 'above the midpoint' : stats.avgWellbeing > 3 ? 'around the midpoint' : 'below the midpoint';
  insights.push({
    title: `Average psychological well-being is ${wellbeingLevel} of the scale`,
    description: `The mean psychological well-being score is ${stats.avgWellbeing} out of 5.0. This composite measure reflects self-reported psychological wellness across eight survey items.`,
    type: 'observation',
    severity: stats.avgWellbeing < 3 ? 'concern' : 'info',
  });

  // 4. Burnout observation
  insights.push({
    title: `Average job burnout score is ${stats.avgJobBurnout} out of 5.0`,
    description: `Burnout, measured through eight items covering emotional exhaustion, shows a ${stats.avgJobBurnout > 3.5 ? 'notable' : 'moderate'} average level in this sample. Higher scores indicate greater self-reported exhaustion.`,
    type: 'observation',
    severity: stats.avgJobBurnout > 4 ? 'concern' : 'attention',
  });

  // 5. Gender comparison
  const genderBreakdown = getDemographicBreakdown(data, 'gender');
  if (genderBreakdown.length >= 2) {
    const sorted = genderBreakdown.sort((a, b) => b.avgStress - a.avgStress);
    const diff = Math.abs(sorted[0].avgStress - sorted[1].avgStress);
    if (diff > 0.1) {
      insights.push({
        title: `${sorted[0].category} respondents report slightly higher average stress`,
        description: `${sorted[0].category} respondents show an average stress score of ${sorted[0].avgStress} compared to ${sorted[1].avgStress} for ${sorted[1].category} respondents. The difference of ${Math.round(diff * 100) / 100} points should be interpreted with caution given the sample composition.`,
        type: 'pattern',
        severity: 'info',
      });
    }
  }

  // 6. Support priority distribution
  const higherPriority = data.filter(d => d.supportCategory === 'Higher').length;
  const higherPercent = Math.round((higherPriority / data.length) * 1000) / 10;
  insights.push({
    title: `${higherPercent}% of respondents fall into the 'Higher' support priority category`,
    description: `Based on the composite Support Priority Indicator (combining stress, burnout, and inverse well-being scores), ${higherPriority} respondents show patterns that may warrant closer attention in a wellbeing program.`,
    type: 'pattern',
    severity: higherPercent > 30 ? 'concern' : 'attention',
  });

  // 7. Stress-wellbeing association
  const highStressGroup = data.filter(d => d.overallStress > 3.5);
  const lowStressGroup = data.filter(d => d.overallStress <= 2.5);
  if (highStressGroup.length > 10 && lowStressGroup.length > 10) {
    const highStressWellbeing = avg(highStressGroup.map(d => d.psychologicalWellbeing));
    const lowStressWellbeing = avg(lowStressGroup.map(d => d.psychologicalWellbeing));
    const wbDiff = Math.round((lowStressWellbeing - highStressWellbeing) * 100) / 100;
    if (wbDiff > 0) {
      insights.push({
        title: 'Higher stress is associated with lower well-being in this dataset',
        description: `Respondents with stress scores above 3.5 show an average well-being of ${Math.round(highStressWellbeing * 100) / 100}, compared to ${Math.round(lowStressWellbeing * 100) / 100} among those with stress below 2.5 — a difference of ${wbDiff} points. Observed association — not evidence of causation.`,
        type: 'pattern',
        severity: 'attention',
      });
    }
  }

  // 8. Experience observation
  const expBreakdown = getDemographicBreakdown(data, 'experienceGroup');
  if (expBreakdown.length >= 2) {
    const mostStressed = expBreakdown.reduce((a, b) => a.avgStress > b.avgStress ? a : b);
    insights.push({
      title: `Teachers with ${mostStressed.category.toLowerCase()} experience report the highest average stress`,
      description: `Among experience groups, those with ${mostStressed.category.toLowerCase()} show the highest average stress score of ${mostStressed.avgStress}. This could reflect different career-stage pressures.`,
      type: 'pattern',
      severity: 'info',
    });
  }

  return insights;
}

// ─── Support Focus Areas ────────────────────────────────────────

export function getSupportFocusAreas(data: ProcessedRespondent[]): {
  area: string;
  rationale: string;
  priority: 'High' | 'Medium' | 'Low';
  icon: string;
}[] {
  const stressors = getStressorData(data);
  const stats = calculateStats(data);

  const areas = stressors.slice(0, 4).map((s, i) => ({
    area: s.fullName === 'Role Overload' ? 'Workload Management' :
          s.fullName === 'Organizational Climate' ? 'Organizational Support' :
          s.fullName === 'Work Environment Stress' ? 'Work Environment' :
          s.fullName === 'Role Ambiguity' ? 'Role Clarity' :
          s.fullName === 'Interpersonal Relations' ? 'Peer Support & Collaboration' :
          'Job Security Awareness',
    rationale: `${s.fullName} has an average score of ${s.avgScore}/5.0, ranking #${i + 1} among measured stress factors.`,
    priority: (i < 2 ? 'High' : 'Medium') as 'High' | 'Medium' | 'Low',
    icon: s.fullName === 'Role Overload' ? 'clipboard-list' :
          s.fullName === 'Organizational Climate' ? 'building' :
          s.fullName === 'Work Environment Stress' ? 'briefcase' :
          s.fullName === 'Role Ambiguity' ? 'target' :
          s.fullName === 'Interpersonal Relations' ? 'users' : 'shield',
  }));

  // Add wellbeing-based areas
  if (stats.avgJobBurnout > 3.5) {
    areas.push({
      area: 'Burnout Prevention',
      rationale: `Average job burnout score is ${stats.avgJobBurnout}/5.0, suggesting significant self-reported emotional exhaustion.`,
      priority: 'High',
      icon: 'heart',
    });
  }

  areas.push({
    area: 'Well-Being Awareness',
    rationale: `With an average well-being score of ${stats.avgWellbeing}/5.0, wellbeing awareness programs could help teachers recognize and address early signs of stress.`,
    priority: 'Medium',
    icon: 'sun',
  });

  return areas;
}

// ─── Correlation Data ───────────────────────────────────────────

export function getCorrelationData(
  data: ProcessedRespondent[],
  xField: keyof ProcessedRespondent,
  yField: keyof ProcessedRespondent
): { x: number; y: number }[] {
  return data.map(d => ({
    x: d[xField] as number,
    y: d[yField] as number,
  }));
}

/** Simple Pearson correlation coefficient */
export function pearsonCorrelation(data: { x: number; y: number }[]): number {
  const n = data.length;
  if (n < 3) return 0;
  const sumX = data.reduce((s, d) => s + d.x, 0);
  const sumY = data.reduce((s, d) => s + d.y, 0);
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0);
  const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0);
  const sumY2 = data.reduce((s, d) => s + d.y * d.y, 0);
  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (den === 0) return 0;
  return Math.round((num / den) * 1000) / 1000;
}
