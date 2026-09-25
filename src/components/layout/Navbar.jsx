import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Eye, Menu, X, Calendar, Crown, Stethoscope, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { GlassButton } from '../common/GlassButton';

const ROLE_LINKS = {
  customer: { path: '/dashboard', label: 'My Portal', icon: User },
  staff: { path: '/staff/dashboard', label: 'Staff Workspace', icon: Stethoscope },
  admin: { path: '/admin', label: 'Owner Command', icon: Crown }
};

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlist, setIsWishlistOpen } = useWishlist();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const roleLink = user ? ROLE_LINKS[user.role] || ROLE_LINKS.customer : null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-glass bg-white/80 border-b border-white/80 shadow-glass-subtle transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/20 border border-sky-400/50 flex items-center justify-center shadow-glass-glow group-hover:scale-105 transition-transform duration-300">
            <Eye className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <span className="font-display font-black text-2xl tracking-wider text-slate-900 uppercase">LUMINA</span>
            <span className="block text-[11px] font-mono tracking-widest text-sky-700 font-bold uppercase -mt-1">OPTICAL LAB</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-base font-bold text-slate-800">
          <Link to="/" className={`transition-colors py-1 relative ${isActive('/') ? 'text-sky-700 font-extrabold' : 'hover:text-sky-600'}`}>
            Home
            {isActive('/') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />}
          </Link>

          <Link to="/catalog" className={`transition-colors py-1 relative ${isActive('/catalog') ? 'text-sky-700 font-extrabold' : 'hover:text-sky-600'}`}>
            Store Catalog
            {isActive('/catalog') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />}
          </Link>

          <Link to="/book-test" className={`flex items-center gap-1.5 transition-colors py-1 relative ${isActive('/book-test') ? 'text-sky-700 font-extrabold' : 'hover:text-sky-600'}`}>
            <Calendar className="w-4 h-4 text-sky-600" />
            Book Free Eye Test
            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 ml-1">FREE</span>
            {isActive('/book-test') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />}
          </Link>
        </nav>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2.5 rounded-xl bg-white/90 border border-slate-200 hover:border-sky-400 hover:bg-sky-50/80 transition-all text-slate-800 hover:text-sky-700 shadow-sm cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white font-bold text-xs rounded-full flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-white/90 border border-slate-200 hover:border-sky-400 hover:bg-sky-50/80 transition-all text-slate-800 hover:text-sky-700 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-600 text-white font-bold text-xs rounded-full flex items-center justify-center shadow-glass-glow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Role-Based Dashboard Link */}
          {user && roleLink ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to={roleLink.path}
                className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl bg-white/90 border border-slate-200 hover:border-sky-400 transition-all shadow-sm"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-sky-400"
                />
                <div className="hidden lg:block">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-sky-700 font-bold uppercase">{user.role}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-white/90 border border-slate-200 hover:border-red-300 hover:text-red-600 text-slate-500 transition-all shadow-sm cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex">
              <GlassButton size="sm" variant="primary" className="shadow-glass-glow">
                <User className="w-4 h-4 mr-1" /> Sign In
              </GlassButton>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/90 border border-slate-200 text-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-slate-200 px-6 py-6 space-y-4 text-center backdrop-blur-glass">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-slate-900 hover:text-sky-600 text-lg font-bold">Home</Link>
          <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="block text-slate-900 hover:text-sky-600 text-lg font-bold">Store Catalog</Link>
          <Link to="/book-test" onClick={() => setMobileMenuOpen(false)} className="block text-sky-700 hover:underline text-lg font-bold flex items-center justify-center gap-1.5">
            <Calendar className="w-4 h-4" /> Book Free Eye Test
          </Link>
          {user && roleLink ? (
            <>
              <Link to={roleLink.path} onClick={() => setMobileMenuOpen(false)} className="block text-slate-900 hover:text-sky-600 text-lg font-bold">
                {roleLink.label}
              </Link>
              <button onClick={handleLogout} className="text-red-600 hover:underline text-sm font-bold cursor-pointer">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <GlassButton size="md" variant="primary" className="w-full mt-2 shadow-glass-glow">Sign In</GlassButton>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
