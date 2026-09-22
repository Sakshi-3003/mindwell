import { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { PageHeader, DashboardCard, FilterPanel, EmptyState, LoadingState } from '../components/UIComponents';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getDistribution, applyFilters } from '../utils/dataProcessor';
import type { FilterState } from '../types';
import {
  GENDER_MAP, AGE_MAP, TITLE_MAP, EDUCATION_MAP, EXPERIENCE_MAP, CITY_MAP,
} from '../utils/dataProcessor';

const COLORS = ['#D8E8D5', '#D8E8F3', '#F8D8C0', '#DDD6F3', '#F7C8D8'];

export default function StressWellbeing() {
  const { allData, isLoading } = useData();
  const [filters, setFilters] = useState<FilterState>({
    gender: [], ageGroup: [], academicTitle: [],
    educationalLevel: [], experienceGroup: [], city: [],
  });

  const filterOptions = useMemo(() => ({
    gender: Object.values(GENDER_MAP),
    ageGroup: Object.values(AGE_MAP),
    academicTitle: Object.values(TITLE_MAP),
    educationalLevel: Object.values(EDUCATION_MAP),
    experienceGroup: Object.values(EXPERIENCE_MAP),
    city: Object.values(CITY_MAP),
  }), []);

  const filteredData = useMemo(() => applyFilters(allData, filters), [allData, filters]);

  const stressDist = useMemo(() => getDistribution(filteredData, 'overallStress'), [filteredData]);
  const wellbeingDist = useMemo(() => getDistribution(filteredData, 'psychologicalWellbeing'), [filteredData]);
  const burnoutDist = useMemo(() => getDistribution(filteredData, 'jobBurnout'), [filteredData]);
  const insecurityDist = useMemo(() => getDistribution(filteredData, 'jobInsecurity'), [filteredData]);

  if (isLoading) return <LoadingState />;

  const handleFilterChange = (key: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [key]: values }));
  };

  const resetFilters = () => {
    setFilters({
      gender: [], ageGroup: [], academicTitle: [],
      educationalLevel: [], experienceGroup: [], city: [],
    });
  };

  const renderDistChart = (
    data: { label: string; count: number; percent: number }[],
    title: string,
    tooltip: string
  ) => (
    <DashboardCard title={title} tooltip={tooltip}>
      {filteredData.length === 0 ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: '#756D6D' }}
              tickLine={false}
              axisLine={{ stroke: '#F7C8D8', strokeOpacity: 0.3 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 10, fill: '#756D6D' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid rgba(247,200,216,0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px',
              }}
              formatter={(value: any, _name: any, props: any) => [
                `${value} (${props.payload.percent}%)`,
                'Respondents',
              ]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={44}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </DashboardCard>
  );

  return (
    <div>
      <PageHeader
        title="Understanding Wellbeing"
        subtitle="Explore how stress, wellbeing, burnout, and job insecurity are distributed across the sample."
        badge={`${filteredData.length} of ${allData.length} respondents`}
      />

      <FilterPanel
        filters={filters}
        options={filterOptions}
        onChange={handleFilterChange}
        onReset={resetFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderDistChart(
          stressDist,
          'Stress Distribution',
          'Composite occupational stress score (avg. of 6 dimensions). Categories based on the 1-5 Likert composite range. Low: 1.0-2.0, Below Avg: 2.0-3.0, Moderate: 3.0-3.5, Above Avg: 3.5-4.0, High: 4.0-5.0.'
        )}
        {renderDistChart(
          wellbeingDist,
          'Psychological Well-Being Distribution',
          'Average of 8 PWB items on 1-5 Likert scale. Higher scores indicate better self-reported well-being.'
        )}
        {renderDistChart(
          burnoutDist,
          'Job Burnout Distribution',
          'Average of 8 burnout items on 1-5 Likert scale. Higher scores indicate greater self-reported burnout.'
        )}
        {renderDistChart(
          insecurityDist,
          'Job Insecurity Distribution',
          'Average of 8 job insecurity items on 1-5 Likert scale. Higher scores indicate greater perceived insecurity.'
        )}
      </div>

      {/* Methodology note */}
      <div className="mt-6 bg-[#D8E8F3]/15 border border-[#D8E8F3]/25 rounded-xl px-4 py-3">
        <p className="text-[10px] text-[#756D6D] leading-relaxed">
          <strong>How this is calculated:</strong> Each distribution shows how respondents cluster across composite score ranges.
          Composite scores are computed as the arithmetic mean of their respective Likert-scale items (1-5).
          Category thresholds: Low (1.0–2.0), Below Average (2.0–3.0), Moderate (3.0–3.5), Above Average (3.5–4.0), High (4.0–5.0).
        </p>
      </div>
    </div>
  );
}
