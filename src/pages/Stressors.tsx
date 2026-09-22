import { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import { PageHeader, DashboardCard, LoadingState, EmptyState } from '../components/UIComponents';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, ZAxis,
} from 'recharts';
import { getCorrelationData, pearsonCorrelation } from '../utils/dataProcessor';
import type { ProcessedRespondent } from '../types';

const STRESSOR_FIELDS: { key: keyof ProcessedRespondent; name: string; color: string }[] = [
  { key: 'roleOverload', name: 'Role Overload', color: '#F7C8D8' },
  { key: 'organizationalClimate', name: 'Organizational Climate', color: '#DDD6F3' },
  { key: 'workEnvironment', name: 'Work Environment', color: '#F8D8C0' },
  { key: 'roleAmbiguity', name: 'Role Ambiguity', color: '#D8E8F3' },
  { key: 'interpersonalRelations', name: 'Interpersonal Relations', color: '#D8E8D5' },
  { key: 'jobInsecurity', name: 'Job Insecurity', color: '#F7C8D8' },
];

export default function Stressors() {
  const { filteredData, stressors, isLoading } = useData();
  const [selectedStressor, setSelectedStressor] = useState<keyof ProcessedRespondent>('roleOverload');

  const scatterData = useMemo(
    () => getCorrelationData(filteredData, selectedStressor, 'psychologicalWellbeing'),
    [filteredData, selectedStressor]
  );

  const correlations = useMemo(() => {
    return STRESSOR_FIELDS.map(s => {
      const data = getCorrelationData(filteredData, s.key, 'psychologicalWellbeing');
      return {
        name: s.name,
        correlation: pearsonCorrelation(data),
        color: s.color,
      };
    }).sort((a, b) => a.correlation - b.correlation);
  }, [filteredData]);

  const selectedStressorName = STRESSOR_FIELDS.find(s => s.key === selectedStressor)?.name || '';
  const selectedCorrelation = pearsonCorrelation(scatterData);

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="What is putting pressure on educators?"
        subtitle="Understanding the major occupational stress factors and their association with wellbeing."
      />

      {/* Stressor Rankings */}
      <DashboardCard
        title="Reported Occupational Stress Factors"
        subtitle="Average scores ranked from highest to lowest (1-5 Likert scale)"
        tooltip="All six stress dimensions use the same 1-5 Likert scale, making direct comparison appropriate. Higher scores indicate greater reported stress."
        className="mb-6"
      >
        {filteredData.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={stressors}
              layout="vertical"
              margin={{ top: 10, right: 40, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 5]}
                tick={{ fontSize: 10, fill: '#756D6D' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="fullName"
                tick={{ fontSize: 11, fill: '#3F3A3A', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                width={150}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(247,200,216,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`${value} / 5.0`, 'Average Score']}
              />
              <Bar dataKey="avgScore" radius={[0, 8, 8, 0]} maxBarSize={32}>
                {stressors.map((_, index) => (
                  <Cell key={index} fill={STRESSOR_FIELDS[index % STRESSOR_FIELDS.length].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </DashboardCard>

      {/* Correlation Overview */}
      <DashboardCard
        title="Stressor–Wellbeing Correlations"
        subtitle="Pearson correlation between each stress factor and psychological well-being"
        tooltip="Correlation values range from -1 to +1. Negative values indicate that higher stress is associated with lower well-being. These are descriptive associations from the sample."
        className="mb-6"
      >
        {filteredData.length < 10 ? (
          <EmptyState message="Insufficient data points for correlation analysis." />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={correlations}
                layout="vertical"
                margin={{ top: 10, right: 40, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[-1, 1]}
                  tick={{ fontSize: 10, fill: '#756D6D' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#3F3A3A', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid rgba(247,200,216,0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [value.toFixed(3), 'Pearson r']}
                />
                <Bar dataKey="correlation" radius={[0, 8, 8, 0]} maxBarSize={28}>
                  {correlations.map((entry, index) => (
                    <Cell key={index} fill={entry.correlation < 0 ? '#F7C8D8' : '#D8E8D5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 bg-[#F8D8C0]/15 border border-[#F8D8C0]/25 rounded-xl px-4 py-2.5">
              <p className="text-[10px] text-[#756D6D] leading-relaxed">
                <strong>⚠ Association does not imply causation.</strong> These correlations describe linear relationships observed in the sample data. They do not establish that one variable causes changes in another.
              </p>
            </div>
          </>
        )}
      </DashboardCard>

      {/* Scatter Plot */}
      <DashboardCard
        title="Stressors and Wellbeing"
        subtitle={`${selectedStressorName} vs. Psychological Well-Being (r = ${selectedCorrelation.toFixed(3)})`}
        tooltip="Each dot represents one respondent. Select a stressor to explore its association with well-being."
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {STRESSOR_FIELDS.map(s => (
            <button
              key={s.key}
              onClick={() => setSelectedStressor(s.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                selectedStressor === s.key
                  ? 'bg-[#F7C8D8]/25 border-[#F7C8D8]/50 text-[#3F3A3A]'
                  : 'bg-white border-[#F7C8D8]/15 text-[#756D6D] hover:border-[#F7C8D8]/30'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        {filteredData.length < 10 ? (
          <EmptyState message="Insufficient data points for scatter analysis." />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={selectedStressorName}
                  domain={[1, 5]}
                  tick={{ fontSize: 10, fill: '#756D6D' }}
                  label={{ value: selectedStressorName, position: 'bottom', offset: 15, fontSize: 11, fill: '#756D6D' }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Well-Being"
                  domain={[1, 5]}
                  tick={{ fontSize: 10, fill: '#756D6D' }}
                  label={{ value: 'Well-Being', angle: -90, position: 'insideLeft', offset: 5, fontSize: 11, fill: '#756D6D' }}
                />
                <ZAxis range={[30, 30]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid rgba(247,200,216,0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [value.toFixed(2)]}
                />
                <Scatter data={scatterData} fill="#F7C8D8" fillOpacity={0.5} />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-3 bg-[#DDD6F3]/15 border border-[#DDD6F3]/25 rounded-xl px-4 py-2.5">
              <p className="text-[10px] text-[#756D6D]">
                <strong>Note:</strong> Association does not imply causation. Each point represents one respondent's composite scores.
              </p>
            </div>
          </>
        )}
      </DashboardCard>
    </div>
  );
}
