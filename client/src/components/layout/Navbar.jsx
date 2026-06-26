import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiLogout, HiViewGrid, HiPlusCircle } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-surface-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-glow group-hover:scale-110 transition-transform">
              C
            </div>
            <span className="text-lg font-bold font-[Outfit] gradient-text">CertForge</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-surface-300 hover:text-surface-100 hover:bg-surface-800/50'
                  }`}
                >
                  <HiViewGrid className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/editor"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname.startsWith('/editor')
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-surface-300 hover:text-surface-100 hover:bg-surface-800/50'
                  }`}
                >
                  <HiPlusCircle className="w-4 h-4" />
                  New Certificate
                </Link>
              </>
            ) : null}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800/50">
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm text-surface-200">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-surface-400 hover:text-danger-400 hover:bg-danger-500/10 transition-all cursor-pointer"
                  title="Logout"
                >
                  <HiLogout className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-surface-300 hover:text-surface-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium gradient-primary text-white rounded-xl hover:shadow-glow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-surface-300 hover:text-surface-100 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-surface-700/50 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-surface-200 hover:bg-surface-800/50"
                >
                  <HiViewGrid className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  to="/editor"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-surface-200 hover:bg-surface-800/50"
                >
                  <HiPlusCircle className="w-5 h-5" />
                  New Certificate
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-danger-400 hover:bg-danger-500/10 cursor-pointer"
                >
                  <HiLogout className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-surface-200 hover:bg-surface-800/50"
                >
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-white gradient-primary text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
