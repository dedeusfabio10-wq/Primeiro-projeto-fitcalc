import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import ResultPage from './pages/ResultPage';
import PlanPage from './pages/PlanPage';
import Header from './components/Header';
import Footer from './components/Footer';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/resultado" element={<ResultPage />} />
            <Route path="/plano" element={<PlanPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;