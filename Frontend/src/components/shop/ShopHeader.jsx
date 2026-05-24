import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { SearchOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';

const ShopHeader = ({ searchValue = '', onSearchChange }) => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-surface/85 backdrop-blur">
      <div className="section-shell">
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-bold shadow-lg shadow-blue-500/20">Q</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Quick & Legit</p>
                <h1 className="font-display text-xl text-ink">Khoa</h1>
              </div>
            </Link>
            <button className="flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-500/20 lg:hidden">
              Menu
            </button>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-inkLight">
            <Link to="/" className="transition hover:text-primary">Home</Link>
            <a href="#latest" className="transition hover:text-primary">Latest</a>
            <a href="#best-sellers" className="transition hover:text-primary">Best Sellers</a>
            <a href="#promotions" className="transition hover:text-primary">Promotions</a>
            <a href="#categories" className="transition hover:text-primary">Categories</a>
          </nav>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm shadow-blue-500/5 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-blue-100">
              <SearchOutlined className="text-primary" />
              <input
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-inkLight/60"
                placeholder="Search products"
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700">
                <ShoppingCartOutlined />
                Cart
              </button>
              <div className="flex items-center gap-3 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm shadow-blue-500/5">
                <div className="h-8 w-8 rounded-full bg-primary text-xs font-semibold text-white flex items-center justify-center">
                  {auth?.user?.name?.[0]?.toUpperCase() || auth?.user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs text-inkLight">Member</p>
                  <p className="text-sm font-semibold text-ink">
                    {auth?.user?.name || auth?.user?.email || 'Guest'}
                  </p>
                </div>
                {auth?.isAuthenticated && (
                  <button
                    className="flex items-center gap-2 rounded-full border border-blue-100 px-3 py-1 text-xs font-semibold text-inkLight transition hover:border-primary/40 hover:text-primary"
                    onClick={handleLogout}
                  >
                    <LogoutOutlined />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
