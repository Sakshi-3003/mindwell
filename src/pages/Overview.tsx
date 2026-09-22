import { useData } from '../hooks/useData';
import { KPICard, DashboardCard, PageHeader, InsightCard, LoadingState, DisclaimerBanner } from '../components/UIComponents';
import { Users, HeartPulse, AlertTriangle, Flame, Brain } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getDistribution } from '../utils/dataProcessor';

const COLORS = ['#D8E8D5', '#D8E8F3', '#F8D8C0', '#DDD6F3', '#F7C8D8'];

export default function Overview() {
  const { filteredData, stats, stressors, insights, isLoading } = useData();

  if (isLoading) return <LoadingState />;

  const stressDistribution = getDistribution(filteredData, 'overallStress');
  const wellbeingDistribution = getDistribution(filteredData, 'psychologicalWellbeing');

  const indicatorsData = [
    { name: 'Well-Being', score: stats.avgWellbeing, color: '#D8E8D5' },
    { name: 'Job Burnout', score: stats.avgJobBurnout, color: '#F7C8D8' },
    { name: 'Overall Stress', score: stats.avgStress, color: '#F8D8C0' },
    { name: 'Job Insecurity', score: stats.avgJobInsecurity, color: '#DDD6F3' },
  ];

  return (
    <div>
      <PageHeader
        title="Teacher Wellbeing at a Glance"
        subtitle="A data-informed view of occupational stress and psychological wellbeing."
        badge={`n = ${stats.totalRespondents}`}
      />

      <DisclaimerBanner />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KPICard
          title="Total Respondents"
          value={stats.totalRespondents}
          icon={<Users size={18} className="text-[#756D6D]" />}
          color="#D8E8F3"
          tooltip="Number of valid survey responses in the dataset after cleaning."
        />
        <KPICard
          title="Avg. Well-Being"
          value={`${stats.avgWellbeing}/5.0`}
          subtitle="8-item composite"
          icon={<HeartPulse size={18} className="text-[#756D6D]" />}
          color="#D8E8D5"
          tooltip="Average of 8 psychological well-being items on a 1-5 Likert scale. Higher = better reported well-being."
        />
        <KPICard
          title="Elevated Stress"
          value={`${stats.highStressPercent}%`}
          subtitle={`${stats.highStressCount} respondents`}
          icon={<AlertTriangle size={18} className="text-[#756D6D]" />}
          color="#F8D8C0"
          tooltip="Respondents with average occupational stress above 3.5 on a 1-5 scale (top 30% of range)."
        />
        <KPICard
          title="Avg. Job Burnout"
          value={`${stats.avgJobBurnout}/5.0`}
          subtitle="8-item composite"
          icon={<Flame size={18} className="text-[#756D6D]" />}
          color="#F7C8D8"
          tooltip="Average of 8 job burnout items. Higher scores indicate greater self-reported emotional exhaustion."
        />
        <KPICard
          title="Avg. Job Insecurity"
          value={`${stats.avgJobInsecurity}/5.0`}
          subtitle="8-item composite"
          icon={<Brain size={18} className="text-[#756D6D]" />}
          color="#DDD6F3"
          tooltip="Average of 8 job insecurity items. Higher scores indicate greater concern about job stability."
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardCard
          title="Stress Distribution"
          subtitle="How occupational stress scores are distributed"
          tooltip="Overall stress is the average of 6 stress dimensions (JI, WE, IR, RA, RO, OC), each measured on a 1-5 Likert scale."
        >
          {stressDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stressDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#756D6D' }}
                  tickLine={false}
                  axisLine={{ stroke: '#F7C8D8', strokeOpacity: 0.3 }}
                />
                <YAxis
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
                  formatter={(value: any) => [`${value} respondents`, 'Count']}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48}>
                  {stressDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </DashboardCard>

        <DashboardCard
          title="Key Wellbeing Indicators"
          subtitle="Average scores across measured constructs (1-5 scale)"
          tooltip="Each bar represents the mean composite score for that construct. All constructs use the same 1-5 Likert response scale."
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={indicatorsData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 5]}
                tick={{ fontSize: 10, fill: '#756D6D' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#3F3A3A', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(247,200,216,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`${value} / 5.0`, 'Avg. Score']}
              />
              <Bar dataKey="score" radius={[0, 8, 8, 0]} maxBarSize={32}>
                {indicatorsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      {/* Stressors Quick View */}
      <DashboardCard
        title="Occupational Stress Factors"
        subtitle="Average scores by stress dimension — ranked from highest to lowest"
        className="mb-6"
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stressors} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 5]}
              tick={{ fontSize: 10, fill: '#756D6D' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#3F3A3A', fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid rgba(247,200,216,0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`${value} / 5.0`, 'Avg. Score']}
            />
            <Bar dataKey="avgScore" radius={[0, 8, 8, 0]} maxBarSize={28} fill="#F8D8C0" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardCard>

      {/* Insights */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-[#3F3A3A] mb-1">At a Glance — Key Observations</h3>
        <p className="text-xs text-[#756D6D] mb-4">Dynamically generated from the dataset. These are descriptive observations, not causal claims.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.slice(0, 6).map((insight, i) => (
          <InsightCard key={i} title={insight.title} description={insight.description} severity={insight.severity} />
        ))}
      </div>
    </div>
  );
}
