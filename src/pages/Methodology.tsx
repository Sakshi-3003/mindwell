import { useData } from '../hooks/useData';
import { PageHeader, LoadingState } from '../components/UIComponents';
import { ExternalLink, Database, Shield, FileText, AlertCircle } from 'lucide-react';
import { CONSTRUCTS } from '../utils/dataProcessor';

export default function Methodology() {
  const { allData, isLoading } = useData();

  if (isLoading) return <LoadingState />;

  const totalRecords = allData.length;
  const numVariables = 60;
  const numCategorical = 6;
  const numNumerical = 54;

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Data & Methodology"
        subtitle="Transparency about data sources, processing, and analytical choices."
      />

      {/* Why This Project */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <h3 className="text-base font-bold text-[#3F3A3A] mb-2">Why This Project?</h3>
        <p className="text-sm text-[#756D6D] leading-relaxed">
          Teacher wellbeing is an important part of a healthy education system. This project explores how survey data
          can be transformed into clear, actionable insights that help program teams understand stressors, wellbeing
          patterns and areas where additional support may be considered.
        </p>
      </div>

      {/* Data Source */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Database size={18} className="text-[#756D6D]" />
          <h3 className="text-base font-bold text-[#3F3A3A]">Data Source</h3>
        </div>
        <div className="space-y-3 text-sm text-[#756D6D] leading-relaxed">
          <p className="font-medium text-[#3F3A3A]">
            "Survey data on the impact of Occupational Stress on Psychological Well-being of Teachers among Private Universities in India"
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-[#3F3A3A] mb-1">Publisher</p>
              <p className="text-xs">Mendeley Data</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#3F3A3A] mb-1">License</p>
              <p className="text-xs">CC BY 4.0</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#3F3A3A] mb-1">DOI</p>
              <p className="text-xs">10.17632/stgdrjckyt.1</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#3F3A3A] mb-1">Publication Date</p>
              <p className="text-xs">May 2025</p>
            </div>
          </div>
          <a
            href="https://data.mendeley.com/datasets/stgdrjckyt/1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#3F3A3A] font-medium hover:underline mt-2 px-3 py-1.5 rounded-xl bg-[#D8E8F3]/20 border border-[#D8E8F3]/30 transition-colors hover:bg-[#D8E8F3]/30"
          >
            <ExternalLink size={12} />
            View on Mendeley Data
          </a>
        </div>
      </div>

      {/* Important Disclaimers */}
      <div className="bg-[#F7C8D8]/10 border border-[#F7C8D8]/25 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={18} className="text-[#756D6D]" />
          <h3 className="text-base font-bold text-[#3F3A3A]">Important Disclaimers</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-white/80 rounded-xl p-4">
            <p className="text-xs text-[#756D6D] leading-relaxed">
              <strong className="text-[#3F3A3A]">Dataset source:</strong> Mendeley Data — Survey data on the impact of Occupational Stress on Psychological Well-being of Teachers among Private Universities in India. This dashboard is an independent portfolio analysis and is not affiliated with or based on confidential VOPA data.
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-4">
            <p className="text-xs text-[#756D6D] leading-relaxed">
              <strong className="text-[#3F3A3A]">Self-reported data:</strong> Self-reported survey data should not be interpreted as a clinical diagnosis. All findings are descriptive observations from a cross-sectional survey.
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-4">
            <p className="text-xs text-[#756D6D] leading-relaxed">
              <strong className="text-[#3F3A3A]">Association ≠ Causation:</strong> Correlations and associations described in this dashboard do not establish causal relationships between variables.
            </p>
          </div>
        </div>
      </div>

      {/* Data Quality */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={18} className="text-[#756D6D]" />
          <h3 className="text-base font-bold text-[#3F3A3A]">Data Quality</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Records', value: totalRecords },
            { label: 'Variables', value: numVariables },
            { label: 'Missing Values', value: '18 (row-level)' },
            { label: 'Duplicate Records', value: 0 },
          ].map((item, i) => (
            <div key={i} className="bg-[#FFF8F3] rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-[#3F3A3A]">{item.value}</p>
              <p className="text-[10px] text-[#756D6D] mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-[#3F3A3A] mb-1">Categorical Variables ({numCategorical})</p>
            <p className="text-xs text-[#756D6D]">Gender, Age, Academic Title, Educational Level, Experience, City</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#3F3A3A] mb-1">Numerical Variables ({numNumerical})</p>
            <p className="text-xs text-[#756D6D]">54 Likert-scale items across 8 constructs (1-5 scale)</p>
          </div>
        </div>
      </div>

      {/* Constructs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={18} className="text-[#756D6D]" />
          <h3 className="text-base font-bold text-[#3F3A3A]">Measured Constructs</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(CONSTRUCTS).map(([key, construct]) => (
            <div key={key} className="bg-[#FFF8F3] rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-[#3F3A3A]">{construct.name}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                  construct.isStressor ? 'bg-[#F8D8C0]/30 text-[#756D6D]' : 'bg-[#D8E8D5]/30 text-[#756D6D]'
                }`}>
                  {construct.isStressor ? 'Stress Factor' : 'Outcome'}
                </span>
              </div>
              <p className="text-xs text-[#756D6D]">{construct.description}</p>
              <p className="text-[10px] text-[#756D6D]/60 mt-1">
                {construct.items.length} items ({construct.items[0]}–{construct.items[construct.items.length - 1]}) · 5-point Likert scale
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Steps */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <h3 className="text-base font-bold text-[#3F3A3A] mb-3">Data Processing Steps</h3>
        <ol className="space-y-2 text-xs text-[#756D6D] leading-relaxed list-decimal list-inside">
          <li><strong>Load:</strong> Raw data loaded from the Excel file provided in the Mendeley repository.</li>
          <li><strong>Inspect:</strong> 60 columns identified — 6 demographic, 54 Likert-scale items.</li>
          <li><strong>Clean:</strong> Rows with missing values handled (18 rows had at least one missing demographic field). No observations deleted; missing demographic fields coded as "Unknown".</li>
          <li><strong>Deduplicate:</strong> Checked for exact duplicate rows — none found.</li>
          <li><strong>Compute composites:</strong> For each construct, the arithmetic mean of its Likert items is calculated (e.g., Job Insecurity = mean of JI1–JI8).</li>
          <li><strong>Compute overall stress:</strong> Average of 6 occupational stress dimension composites.</li>
          <li><strong>Compute Support Priority:</strong> Weighted composite of normalized stress, burnout, and inverse well-being (see Support & Action page).</li>
          <li><strong>Map demographics:</strong> Numeric codes mapped to human-readable labels using the codebook.</li>
          <li><strong>Generate insights:</strong> Rule-based engine computes descriptive observations from the processed data.</li>
        </ol>
      </div>

      {/* Transformations */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <h3 className="text-base font-bold text-[#3F3A3A] mb-3">Normalizations & Calculated Metrics</h3>
        <div className="space-y-3 text-xs text-[#756D6D] leading-relaxed">
          <div className="bg-[#FFF8F3] rounded-xl p-4">
            <p className="font-semibold text-[#3F3A3A] mb-1">Composite Scores</p>
            <p>Each construct's composite score = arithmetic mean of its Likert items. Range: 1.0–5.0.</p>
          </div>
          <div className="bg-[#FFF8F3] rounded-xl p-4">
            <p className="font-semibold text-[#3F3A3A] mb-1">Normalization to 0–100</p>
            <p>Used in the Support Priority calculation and stressor comparison charts: normalized = (value − 1) / (5 − 1) × 100</p>
          </div>
          <div className="bg-[#FFF8F3] rounded-xl p-4">
            <p className="font-semibold text-[#3F3A3A] mb-1">Distribution Bins</p>
            <p>Low (1.0–2.0), Below Average (2.0–3.0), Moderate (3.0–3.5), Above Average (3.5–4.0), High (4.0–5.0)</p>
          </div>
          <div className="bg-[#FFF8F3] rounded-xl p-4">
            <p className="font-semibold text-[#3F3A3A] mb-1">Pearson Correlation</p>
            <p>Standard Pearson product-moment correlation used for bivariate association analysis.</p>
          </div>
          <div className="bg-[#FFF8F3] rounded-xl p-4">
            <p className="font-semibold text-[#3F3A3A] mb-1">"High Stress" Threshold</p>
            <p>Respondents with composite stress score &gt; 3.5 (above the scale midpoint of 3.0, in the top 40% of range). This is an analytical threshold, not a clinical cutoff.</p>
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F7C8D8]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-base font-bold text-[#3F3A3A] mb-3">Technology Stack</h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts', 'Lucide Icons', 'React Router'].map(tech => (
            <span key={tech} className="px-3 py-1.5 rounded-xl bg-[#DDD6F3]/15 border border-[#DDD6F3]/25 text-xs text-[#756D6D] font-medium">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
