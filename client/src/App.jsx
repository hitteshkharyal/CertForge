import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import GeneratePage from './pages/GeneratePage';
import VerifyPage from './pages/VerifyPage';
import AuthForm from './components/auth/AuthForm';

function App() {
  return (
    <Router>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
        <Route path="/verify/:certificateId" element={<VerifyPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/editor" element={
          <ProtectedRoute><EditorPage /></ProtectedRoute>
        } />
        <Route path="/editor/:id" element={
          <ProtectedRoute><EditorPage /></ProtectedRoute>
        } />
        <Route path="/generate/:templateId" element={
          <ProtectedRoute><GeneratePage /></ProtectedRoute>
        } />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
