import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { useState } from 'react';

// ─── KPI Card ──────────────────────────────────────────────────

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  tooltip?: string;
}

export function KPICard({ title, value, subtitle, icon, color = '#F7C8D8', tooltip }: KPICardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}30` }}
        >
          {icon}
        </div>
        {tooltip && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="More info"
            >
              <Info size={14} className="text-[#756D6D]/50" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-8 w-56 p-3 bg-white rounded-xl shadow-lg border border-[#F7C8D8]/20 text-xs text-[#756D6D] z-50 leading-relaxed">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[#3F3A3A] mb-0.5 tracking-tight">{value}</p>
      <p className="text-xs font-medium text-[#756D6D]">{title}</p>
      {subtitle && <p className="text-[10px] text-[#756D6D]/60 mt-1">{subtitle}</p>}
    </div>
  );
}

// ─── Dashboard Card ────────────────────────────────────────────

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  tooltip?: string;
}

export function DashboardCard({ title, subtitle, children, className = '', tooltip }: DashboardCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden ${className}`}>
      <div className="px-6 pt-5 pb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#3F3A3A]">{title}</h3>
          {subtitle && <p className="text-xs text-[#756D6D] mt-0.5">{subtitle}</p>}
        </div>
        {tooltip && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="More info"
            >
              <Info size={14} className="text-[#756D6D]/50" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-8 w-64 p-3 bg-white rounded-xl shadow-lg border border-[#F7C8D8]/20 text-xs text-[#756D6D] z-50 leading-relaxed">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="px-6 pb-5">{children}</div>
    </div>
  );
}

// ─── Page Header ───────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl sm:text-2xl font-bold text-[#3F3A3A] tracking-tight">{title}</h2>
        {badge && (
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#DDD6F3]/30 text-[10px] font-medium text-[#756D6D]">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-[#756D6D] mt-1">{subtitle}</p>
    </div>
  );
}

// ─── Filter Panel ──────────────────────────────────────────────

interface FilterPanelProps {
  filters: { [key: string]: string[] };
  options: { [key: string]: string[] };
  onChange: (key: string, values: string[]) => void;
  onReset: () => void;
}

export function FilterPanel({ filters, options, onChange, onReset }: FilterPanelProps) {
  const hasActiveFilters = Object.values(filters).some(v => v.length > 0);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-[#3F3A3A] uppercase tracking-wider">Filters</h4>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-[#756D6D] hover:text-[#3F3A3A] px-3 py-1 rounded-lg hover:bg-[#F7C8D8]/15 transition-colors"
          >
            Reset all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([key, opts]) => (
          <FilterDropdown
            key={key}
            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
            options={opts}
            selected={filters[key] || []}
            onChange={(values) => onChange(key, values)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
          selected.length > 0
            ? 'bg-[#F7C8D8]/20 border-[#F7C8D8]/40 text-[#3F3A3A]'
            : 'bg-white border-[#F7C8D8]/20 text-[#756D6D] hover:border-[#F7C8D8]/40'
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F7C8D8]/40 text-[10px]">
            {selected.length}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-40 bg-white rounded-xl shadow-lg border border-[#F7C8D8]/20 py-1 min-w-[180px] max-h-60 overflow-y-auto">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F7C8D8]/10 transition-colors flex items-center gap-2 ${
                  selected.includes(opt) ? 'text-[#3F3A3A] font-medium' : 'text-[#756D6D]'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] ${
                  selected.includes(opt)
                    ? 'bg-[#F7C8D8] border-[#F7C8D8] text-white'
                    : 'border-gray-300'
                }`}>
                  {selected.includes(opt) && '✓'}
                </div>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Insight Card ──────────────────────────────────────────────

interface InsightCardProps {
  title: string;
  description: string;
  severity: 'info' | 'attention' | 'concern';
}

export function InsightCard({ title, description, severity }: InsightCardProps) {
  const colors = {
    info: 'border-[#D8E8F3] bg-[#D8E8F3]/20',
    attention: 'border-[#F8D8C0] bg-[#F8D8C0]/20',
    concern: 'border-[#F7C8D8] bg-[#F7C8D8]/20',
  };

  const dots = {
    info: 'bg-[#D8E8F3]',
    attention: 'bg-[#F8D8C0]',
    concern: 'bg-[#F7C8D8]',
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[severity]} transition-all duration-200 hover:shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dots[severity]}`} />
        <div>
          <p className="text-sm font-medium text-[#3F3A3A] mb-1">{title}</p>
          <p className="text-xs text-[#756D6D] leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────

export function EmptyState({ message = 'No sufficient data for this selection.' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F7C8D8]/20 flex items-center justify-center mb-4">
        <Info size={24} className="text-[#756D6D]/40" />
      </div>
      <p className="text-sm text-[#756D6D]">{message}</p>
    </div>
  );
}

// ─── Loading State ─────────────────────────────────────────────

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-[#F7C8D8]/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#F7C8D8] animate-spin" />
      </div>
      <p className="text-sm text-[#756D6D]">Loading wellbeing data...</p>
    </div>
  );
}

// ─── Disclaimer Banner ────────────────────────────────────────

export function DisclaimerBanner() {
  return (
    <div className="bg-[#DDD6F3]/15 border border-[#DDD6F3]/25 rounded-xl px-4 py-3 mb-6">
      <p className="text-[10px] text-[#756D6D] leading-relaxed">
        <strong>Note:</strong> This dashboard uses a publicly available dataset from Mendeley Data. It is an independent portfolio analysis and is not affiliated with or based on confidential VOPA data. Self-reported survey data should not be interpreted as a clinical diagnosis.
      </p>
    </div>
  );
}
