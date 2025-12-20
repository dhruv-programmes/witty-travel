import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import DemoPage from './pages/DemoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="demo" element={<DemoPage />} />
          <Route path="plan/:id" element={<PlannerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
