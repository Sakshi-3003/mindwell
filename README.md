# MINDWELL — Teacher Mental Wellbeing Dashboard

> Turning wellbeing data into actionable support

An interactive, evidence-informed data dashboard that transforms survey data on occupational stress and psychological well-being into clear, actionable insights for program teams working on teacher wellbeing.

**⚠️ This is an independent portfolio project. It is not affiliated with VOPA or any organization's confidential data.**

---

## 🎯 What It Does

MINDWELL answers six key questions:

1. **What is the overall wellbeing picture?** — KPI overview with key metrics
2. **What are the major sources of stress?** — Ranked stressor analysis
3. **Which factors are most associated with poorer wellbeing?** — Correlation analysis
4. **How do stress and wellbeing differ across groups?** — Demographic breakdowns
5. **Where might support be focused?** — Data-informed priority areas
6. **What actionable insights can teams take?** — Rule-based insight engine

---

## 📊 Dataset

**Source:** [Survey data on the impact of Occupational Stress on Psychological Well-being of Teachers among Private Universities in India](https://data.mendeley.com/datasets/stgdrjckyt/1)

- **Publisher:** Mendeley Data
- **License:** CC BY 4.0
- **DOI:** 10.17632/stgdrjckyt.1
- **Records:** 439 respondents, 60 variables
- **Constructs:** Job Insecurity, Work Environment, Interpersonal Relations, Role Ambiguity, Role Overload, Organizational Climate, Job Burnout, Psychological Well-Being

Self-reported survey data should not be interpreted as a clinical diagnosis.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 6 | Type safety |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| Recharts | Data visualization |
| Lucide React | Icons |
| React Router | Navigation |

**No paid APIs. No database. No backend. Fully client-side.**

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mindwell-dashboard.git
cd mindwell-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
mindwell/
├── public/
├── src/
│   ├── components/      # Sidebar, Layout, shared UI components
│   ├── data/            # Processed dataset (JSON)
│   ├── hooks/           # React context & data hook
│   ├── pages/           # 6 dashboard pages
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Data processing, insight engine, statistics
│   ├── App.tsx           # Root component with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles & Tailwind config
├── index.html
├── package.json
├── tsconfig.app.json
└── vite.config.ts
```

---

## 🌐 Deployment (Vercel)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"New Project"** → Import this repository
4. Framework preset: **Vite**
5. Click **Deploy**

No environment variables needed. No API keys required.

---

## 📄 Pages

| Page | Description |
|---|---|
| **Overview** | KPIs, stress distribution, wellbeing indicators, generated insights |
| **Stress & Wellbeing** | Interactive filtered distributions for stress, wellbeing, burnout, insecurity |
| **Stressors** | Ranked stress factors, correlation analysis, scatter plot explorer |
| **Demographics** | Breakdowns by gender, age, title, experience with interactive explorer |
| **Support & Action** | Support Priority Indicator, focus areas, transparent methodology |
| **Data & Methodology** | Data source, disclaimers, processing steps, construct definitions |

---

## ⚖️ Disclaimers

- This dashboard uses a **publicly available dataset** from Mendeley Data
- It is **not** an official product of any organization
- It does **not** use confidential data from VOPA or any other entity
- The Support Priority Indicator is an **analytical construct**, not a clinical risk score
- All findings are **descriptive observations**, not causal claims
- Self-reported survey data should **not** be interpreted as clinical diagnoses

---

## 📝 License

Dataset: CC BY 4.0 (Mendeley Data)

Dashboard code: MIT

---

## 👤 Author

Built as an independent portfolio project demonstrating data analytics and visualization skills for social-impact applications.
