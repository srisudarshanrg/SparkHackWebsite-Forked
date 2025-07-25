import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [team, setTeam] = useState(null);
  const [admin, setAdmin] = useState(null);
  const location = useLocation();

  let teamSession = sessionStorage.getItem("team");
  let adminSession = sessionStorage.getItem("admin_user");

  useEffect(() => {
    if (teamSession !== null) {
      setTeam(JSON.parse(teamSession));
    } else if (adminSession !== null) {
      setAdmin(JSON.parse(adminSession));
    } else {
      setTeam(null);
      setAdmin(null);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [teamSession, adminSession]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 no-underline">
          <Zap className="h-8 w-8 text-indigo-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            HackSpire
          </span>
        </Link>

        <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className="hidden md:flex space-x-8 items-center Button">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/about">About</NavItem>
          {team !== null && (
            <>
              <NavItem to="/team">Team</NavItem>
              <NavItem to="/project">Your Project</NavItem>
              <NavItem to="/project-submit">Submit Project</NavItem>
              <a href="/logout"
                className="no-underline px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
              >
                Sign Out
              </a>
            </>
          )}
          {admin !== null && (
            <a href="/admin-logout"
              className="no-underline px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
            >
              Sign Out
            </a>
          )}
          {team === null && admin === null && (
            <>
              <NavItem to="/login">Sign In</NavItem>
              <NavItem to="/admin-login">Admin Login</NavItem>
            </>
          )}
        </ul>
      </div>

      <motion.div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-slate-900/95 shadow-lg">
          <MobileNavItem to="/">Home</MobileNavItem>
          <MobileNavItem to="/about">About</MobileNavItem>
          <MobileNavItem to="/login">Sign In</MobileNavItem>
          <Link
            to="/register"
            className="block w-full px-4 py-2 mt-2 text-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300 no-underline"
          >
            Register
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
};

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`relative font-medium transition-colors duration-300 no-underline ${
          isActive
            ? 'text-indigo-400'
            : 'text-gray-200 hover:text-indigo-400'
        }`}
      >
        {children}
        {isActive && (
          <motion.span
            layoutId="navbar-indicator"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </li>
  );
};

const MobileNavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block px-4 py-2 rounded-lg transition-colors duration-300 no-underline ${
        isActive
          ? 'bg-indigo-900/50 text-indigo-400'
          : 'text-gray-200 hover:bg-indigo-900/30 hover:text-indigo-400'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;