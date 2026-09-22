import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './hooks/useData';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import StressWellbeing from './pages/StressWellbeing';
import Stressors from './pages/Stressors';
import Demographics from './pages/Demographics';
import SupportAction from './pages/SupportAction';
import Methodology from './pages/Methodology';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/stress-wellbeing" element={<StressWellbeing />} />
            <Route path="/stressors" element={<Stressors />} />
            <Route path="/demographics" element={<Demographics />} />
            <Route path="/support" element={<SupportAction />} />
            <Route path="/methodology" element={<Methodology />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
