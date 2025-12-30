import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DreamTeam } from './pages/DreamTeam';
import { Stats } from './pages/Stats';
import { Standings } from './pages/Standings';
import { Teams } from './pages/Teams';
import { Admin } from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DreamTeam />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;