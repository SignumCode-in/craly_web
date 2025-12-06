import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-soft-grey">
            © 2025 Craly Technologies. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link to="/" className="text-soft-grey hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/privacy" className="text-soft-grey hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-soft-grey hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

