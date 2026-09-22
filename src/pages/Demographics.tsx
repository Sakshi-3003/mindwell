import { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { PageHeader, DashboardCard, FilterPanel, EmptyState, LoadingState } from '../components/UIComponents';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import {
  getDemographicBreakdown, applyFilters,
  GENDER_MAP, AGE_MAP, TITLE_MAP, EDUCATION_MAP, EXPERIENCE_MAP, CITY_MAP,
} from '../utils/dataProcessor';
import type { FilterState, ProcessedRespondent } from '../types';

const METRIC_COLORS = {
  avgWellbeing: '#D8E8D5',
  avgStress: '#F8D8C0',
  avgBurnout: '#F7C8D8',
};

type DemoDimension = 'gender' | 'ageGroup' | 'academicTitle' | 'educationalLevel' | 'experienceGroup' | 'city';

const DIMENSION_OPTIONS: { key: DemoDimension; label: string }[] = [
  { key: 'gender', label: 'Gender' },
  { key: 'ageGroup', label: 'Age Group' },
  { key: 'academicTitle', label: 'Academic Title' },
  { key: 'educationalLevel', label: 'Education Level' },
  { key: 'experienceGroup', label: 'Experience' },
  { key: 'city', label: 'City' },
];

export default function Demographics() {
  const { allData, isLoading } = useData();
  const [filters, setFilters] = useState<FilterState>({
    gender: [], ageGroup: [], academicTitle: [],
    educationalLevel: [], experienceGroup: [], city: [],
  });
  const [activeDimension, setActiveDimension] = useState<DemoDimension>('gender');

  const filterOptions = useMemo(() => ({
    gender: Object.values(GENDER_MAP),
    ageGroup: Object.values(AGE_MAP),
    academicTitle: Object.values(TITLE_MAP),
    educationalLevel: Object.values(EDUCATION_MAP),
    experienceGroup: Object.values(EXPERIENCE_MAP),
    city: Object.values(CITY_MAP),
  }), []);

  const filteredData = useMemo(() => applyFilters(allData, filters), [allData, filters]);

  const wellbeingByGender = useMemo(() => getDemographicBreakdown(filteredData, 'gender'), [filteredData]);
  const stressByAge = useMemo(() => getDemographicBreakdown(filteredData, 'ageGroup'), [filteredData]);
  const burnoutByTitle = useMemo(() => getDemographicBreakdown(filteredData, 'academicTitle'), [filteredData]);
  const burnoutByExp = useMemo(() => getDemographicBreakdown(filteredData, 'experienceGroup'), [filteredData]);

  const activeBreakdown = useMemo(() => getDemographicBreakdown(filteredData, activeDimension), [filteredData, activeDimension]);

  const handleFilterChange = (key: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [key]: values }));
  };

  const resetFilters = () => {
    setFilters({
      gender: [], ageGroup: [], academicTitle: [],
      educationalLevel: [], experienceGroup: [], city: [],
    });
  };

  if (isLoading) return <LoadingState />;

  const renderGroupedChart = (
    data: { category: string; avgWellbeing: number; avgStress: number; avgBurnout: number; count: number }[],
    title: string,
    subtitle: string,
    tooltip: string
  ) => (
    <DashboardCard title={title} subtitle={subtitle} tooltip={tooltip}>
      {data.length === 0 || filteredData.length === 0 ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 10, fill: '#756D6D' }}
              tickLine={false}
              axisLine={{ stroke: '#F7C8D8', strokeOpacity: 0.3 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[0, 5]}
              tick={{ fontSize: 10, fill: '#756D6D' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid rgba(247,200,216,0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px',
              }}
              formatter={(value: any, name: any) => [
                `${value} / 5.0`,
                name === 'avgWellbeing' ? 'Well-Being' : name === 'avgStress' ? 'Stress' : 'Burnout',
              ]}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-xs text-[#756D6D]">
                  {value === 'avgWellbeing' ? 'Well-Being' : value === 'avgStress' ? 'Stress' : 'Burnout'}
                </span>
              )}
            />
            <Bar dataKey="avgWellbeing" fill={METRIC_COLORS.avgWellbeing} radius={[6, 6, 0, 0]} maxBarSize={24} />
            <Bar dataKey="avgStress" fill={METRIC_COLORS.avgStress} radius={[6, 6, 0, 0]} maxBarSize={24} />
            <Bar dataKey="avgBurnout" fill={METRIC_COLORS.avgBurnout} radius={[6, 6, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      )}
      {data.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {data.map(d => (
            <span key={d.category} className="inline-block px-2 py-0.5 rounded-lg bg-[#DDD6F3]/15 text-[10px] text-[#756D6D]">
              {d.category}: n={d.count}
            </span>
          ))}
        </div>
      )}
    </DashboardCard>
  );

  return (
    <div>
      <PageHeader
        title="Who experiences different wellbeing patterns?"
        subtitle="Explore how stress and wellbeing vary across demographic and work-related groups."
        badge={`${filteredData.length} respondents`}
      />

      <FilterPanel
        filters={filters}
        options={filterOptions}
        onChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* Interactive Explorer */}
      <DashboardCard
        title="Interactive Demographic Explorer"
        subtitle="Select a demographic dimension to compare wellbeing metrics"
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {DIMENSION_OPTIONS.map(dim => (
            <button
              key={dim.key}
              onClick={() => setActiveDimension(dim.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                activeDimension === dim.key
                  ? 'bg-[#F7C8D8]/25 border-[#F7C8D8]/50 text-[#3F3A3A]'
                  : 'bg-white border-[#F7C8D8]/15 text-[#756D6D] hover:border-[#F7C8D8]/30'
              }`}
            >
              {dim.label}
            </button>
          ))}
        </div>
        {activeBreakdown.length === 0 || filteredData.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 10, fill: '#756D6D' }}
                tickLine={false}
                axisLine={{ stroke: '#F7C8D8', strokeOpacity: 0.3 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#756D6D' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(247,200,216,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: any) => [
                  `${value} / 5.0`,
                  name === 'avgWellbeing' ? 'Well-Being' : name === 'avgStress' ? 'Stress' : 'Burnout',
                ]}
              />
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs text-[#756D6D]">
                    {value === 'avgWellbeing' ? 'Well-Being' : value === 'avgStress' ? 'Stress' : 'Burnout'}
                  </span>
                )}
              />
              <Bar dataKey="avgWellbeing" fill={METRIC_COLORS.avgWellbeing} radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="avgStress" fill={METRIC_COLORS.avgStress} radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="avgBurnout" fill={METRIC_COLORS.avgBurnout} radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
        {activeBreakdown.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeBreakdown.map(d => (
              <span key={d.category} className="inline-block px-2 py-0.5 rounded-lg bg-[#DDD6F3]/15 text-[10px] text-[#756D6D]">
                {d.category}: n={d.count}
              </span>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Fixed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderGroupedChart(
          wellbeingByGender,
          'Wellbeing by Gender',
          'Comparing average scores between gender groups',
          'Average composite scores broken down by self-reported gender category.'
        )}
        {renderGroupedChart(
          stressByAge,
          'Stress by Age Group',
          'How stress and wellbeing vary across age categories',
          'Age groups defined as: Below 25, 25-30, 31-35, 36-40, 41-45, Above 45.'
        )}
        {renderGroupedChart(
          burnoutByTitle,
          'Burnout by Academic Title',
          'Comparing burnout across academic positions',
          'Academic titles: Professor, Associate Professor, Assistant Professor, Lecturer.'
        )}
        {renderGroupedChart(
          burnoutByExp,
          'Burnout by Experience',
          'How burnout and wellbeing relate to years of experience',
          'Experience groups: <5, 5-10, 11-15, 16-20, >20 years.'
        )}
      </div>
    </div>
  );
}
