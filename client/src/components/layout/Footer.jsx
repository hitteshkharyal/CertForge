import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="border-t border-surface-800/50 bg-surface-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center text-white font-bold text-xs">
              C
            </div>
            <span className="text-sm font-semibold font-[Outfit] gradient-text">CertForge</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-surface-400">
            <Link to="/" className="hover:text-surface-200 transition-colors">Home</Link>
            <Link to="/verify/test" className="hover:text-surface-200 transition-colors">Verify</Link>
          </div>

          <p className="flex items-center gap-1 text-xs text-surface-500">
            Made with <HiHeart className="w-3 h-3 text-accent-500" /> by CertForge
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
