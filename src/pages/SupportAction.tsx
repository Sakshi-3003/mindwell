import { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import { PageHeader, DashboardCard, LoadingState, EmptyState } from '../components/UIComponents';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { getSupportFocusAreas } from '../utils/dataProcessor';
import { ClipboardList, Building, Briefcase, Target, Users, Shield, Heart, Sun, ChevronDown, ChevronUp } from 'lucide-react';

const PRIORITY_COLORS = {
  Lower: '#D8E8D5',
  Moderate: '#F8D8C0',
  Higher: '#F7C8D8',
};

const ICON_MAP: Record<string, any> = {
  'clipboard-list': ClipboardList,
  'building': Building,
  'briefcase': Briefcase,
  'target': Target,
  'users': Users,
  'shield': Shield,
  'heart': Heart,
  'sun': Sun,
};

export default function SupportAction() {
  const { filteredData, isLoading } = useData();
  const [showMethodology, setShowMethodology] = useState(false);

  const supportDistribution = useMemo(() => {
    const counts = { Lower: 0, Moderate: 0, Higher: 0 };
    filteredData.forEach(d => counts[d.supportCategory]++);
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percent: Math.round((value / filteredData.length) * 1000) / 10,
    }));
  }, [filteredData]);

  const focusAreas = useMemo(() => getSupportFocusAreas(filteredData), [filteredData]);

  const avgSupportByGroup = useMemo(() => {
    const groups: Record<string, number[]> = {};
    filteredData.forEach(d => {
      if (!groups[d.academicTitle]) groups[d.academicTitle] = [];
      groups[d.academicTitle].push(d.supportPriority);
    });
    return Object.entries(groups)
      .filter(([key]) => key !== 'Unknown')
      .map(([category, values]) => ({
        category,
        avgPriority: Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10,
        count: values.length,
      }))
      .sort((a, b) => b.avgPriority - a.avgPriority);
  }, [filteredData]);

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Support & Action"
        subtitle="Data-informed areas for consideration — understanding where support may be most beneficial."
      />

      {/* Disclaimer */}
      <div className="bg-[#DDD6F3]/15 border border-[#DDD6F3]/25 rounded-xl px-4 py-3 mb-6">
        <p className="text-[10px] text-[#756D6D] leading-relaxed">
          <strong>Important:</strong> The Support Priority Indicator is an analytical construct for portfolio demonstration purposes. It is NOT a clinical risk score and should not be used for diagnosis. Language used intentionally avoids clinical terminology.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Support Priority Distribution */}
        <DashboardCard
          title="Support Priority Distribution"
          subtitle="Categorization based on composite stress, burnout, and well-being indicators"
          tooltip="Support Priority Score = 0.35 × normalized stress + 0.35 × normalized burnout + 0.30 × inverse well-being. Each component normalized from 1-5 scale to 0-100."
        >
          {filteredData.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={240}>
                <PieChart>
                  <Pie
                    data={supportDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {supportDistribution.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid rgba(247,200,216,0.3)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any) => [`${value} (${Math.round((value / filteredData.length) * 1000) / 10}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {supportDistribution.map(entry => (
                  <div key={entry.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] }}
                    />
                    <div>
                      <p className="text-sm font-medium text-[#3F3A3A]">{entry.name}</p>
                      <p className="text-xs text-[#756D6D]">{entry.value} ({entry.percent}%)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DashboardCard>

        {/* Priority by Role */}
        <DashboardCard
          title="Average Support Priority by Role"
          subtitle="How support priority scores differ across academic titles"
        >
          {avgSupportByGroup.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={avgSupportByGroup} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F7C8D8" strokeOpacity={0.3} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#756D6D' }}
                  tickLine={false}
                  axisLine={{ stroke: '#F7C8D8', strokeOpacity: 0.3 }}
                />
                <YAxis
                  domain={[0, 100]}
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
                  formatter={(value: any) => [`${value}/100`, 'Avg. Priority Score']}
                />
                <Bar dataKey="avgPriority" radius={[8, 8, 0, 0]} maxBarSize={48}>
                  {avgSupportByGroup.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={entry.avgPriority >= 60 ? '#F7C8D8' : entry.avgPriority >= 40 ? '#F8D8C0' : '#D8E8D5'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </DashboardCard>
      </div>

      {/* Methodology */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6 overflow-hidden">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F7C8D8]/5 transition-colors"
        >
          <div>
            <h3 className="text-sm font-semibold text-[#3F3A3A]">Methodology — Support Priority Indicator</h3>
            <p className="text-xs text-[#756D6D] mt-0.5">How the composite score is calculated</p>
          </div>
          {showMethodology ? <ChevronUp size={18} className="text-[#756D6D]" /> : <ChevronDown size={18} className="text-[#756D6D]" />}
        </button>
        {showMethodology && (
          <div className="px-6 pb-5 space-y-3">
            <div className="bg-[#FFF8F3] rounded-xl p-4 font-mono text-xs text-[#3F3A3A] leading-relaxed">
              <p className="font-semibold mb-2">Support Priority Score (0–100) =</p>
              <p className="ml-4">0.35 × Normalized Overall Stress</p>
              <p className="ml-4">+ 0.35 × Normalized Job Burnout</p>
              <p className="ml-4">+ 0.30 × Inverse Normalized Well-Being</p>
            </div>
            <div className="text-xs text-[#756D6D] space-y-2 leading-relaxed">
              <p><strong>Normalization:</strong> Each component is converted from the 1–5 Likert scale to 0–100 using: (value − 1) / (5 − 1) × 100</p>
              <p><strong>Inverse:</strong> Well-being is inverted (100 − normalized score) so that lower well-being increases the priority score.</p>
              <p><strong>Overall Stress:</strong> Average of 6 occupational stress dimensions (Job Insecurity, Work Environment, Interpersonal Relations, Role Ambiguity, Role Overload, Organizational Climate).</p>
              <p><strong>Thresholds:</strong> Lower (&lt;40), Moderate (40–60), Higher (&gt;60).</p>
              <p><strong>Weight rationale:</strong> Equal weight (35%) to stress and burnout as direct measures of occupational pressure; slightly lower weight (30%) for inverse well-being as a broader outcome measure.</p>
            </div>
          </div>
        )}
      </div>

      {/* Focus Areas */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-[#3F3A3A] mb-0.5">Where could support focus?</h3>
        <p className="text-xs text-[#756D6D] mb-4">
          Data-informed areas for consideration, based on the strongest stressor patterns in the dataset.
          These are not prescriptive recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {focusAreas.map((area, i) => {
          const IconComponent = ICON_MAP[area.icon] || Heart;
          return (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  area.priority === 'High' ? 'bg-[#F7C8D8]/25' : 'bg-[#D8E8F3]/25'
                }`}>
                  <IconComponent size={18} className="text-[#756D6D]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-[#3F3A3A]">{area.area}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                      area.priority === 'High'
                        ? 'bg-[#F7C8D8]/30 text-[#756D6D]'
                        : 'bg-[#D8E8F3]/30 text-[#756D6D]'
                    }`}>
                      {area.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-[#756D6D] leading-relaxed">{area.rationale}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final caveat */}
      <div className="mt-6 bg-[#F8D8C0]/15 border border-[#F8D8C0]/25 rounded-xl px-4 py-3">
        <p className="text-[10px] text-[#756D6D] leading-relaxed">
          <strong>Caveat:</strong> These focus areas are derived from the relative ranking of stress factors in the dataset. They do not represent clinical recommendations or program mandates. Any wellbeing program should be informed by local context, stakeholder consultation, and professional expertise.
        </p>
      </div>
    </div>
  );
}
