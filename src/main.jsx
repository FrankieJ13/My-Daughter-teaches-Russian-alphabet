import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import HomePage from './pages/HomePage.jsx';
import AlphabetPage from './pages/AlphabetPage.jsx';
import LetterPage from './pages/LetterPage.jsx';
import GamesPage from './pages/GamesPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import ParentPage from './pages/ParentPage.jsx';
import './styles/styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/alphabet" element={<AlphabetPage />} />
          <Route path="/letter/:letter" element={<LetterPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/parent" element={<ParentPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
