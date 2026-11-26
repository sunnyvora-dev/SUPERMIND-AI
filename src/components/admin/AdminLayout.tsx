import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Cpu,
  Server,
  Activity,
  CreditCard,
  ShieldCheck,
  FileText,
  Sliders,
  ArrowLeft,
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Database,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface AdminNavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: AdminNavItem[] = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Users & Roles', path: '/admin/users', icon: Users },
  { name: 'AI Models', path: '/admin/models', icon: Cpu },
  { name: 'Providers', path: '/admin/providers', icon: Server },
  { name: 'API Usage', path: '/admin/api-usage', icon: Activity },
  { name: 'Billing & Plans', path: '/admin/billing', icon: CreditCard },
  { name: 'System Health', path: '/admin/system-health', icon: ShieldCheck },
  { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
  { name: 'Platform Settings', path: '/admin/settings', icon: Sliders },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Breadcrumbs calculation
  const currentPath = location.pathname;
  const currentNavItem = navItems.find((item) =>
    item.path === '/admin' ? currentPath === '/admin' || currentPath === '/admin/overview' : currentPath.startsWith(item.path)
  ) || { name: 'Overview', path: '/admin' };

  // Role badge color scheme
  const roleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'ADMIN':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'FINANCE':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'SUPPORT':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#08090B] text-slate-800 dark:text-slate-200 flex flex-col antialiased selection:bg-[#F05A3C]/20 relative overflow-hidden">
      {/* Liquid Ambient Fluid Lighting Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="liquid-orb-1 w-[500px] h-[500px] -top-32 -left-32 bg-gradient-to-tr from-[#F05A3C]/15 via-[#2457D6]/20 to-[#9333EA]/15" />
        <div className="liquid-orb-2 w-[600px] h-[600px] -bottom-40 -right-40 bg-gradient-to-br from-[#2457D6]/20 via-[#06B6D4]/15 to-[#F05A3C]/15" />
        <div className="liquid-orb-1 w-[350px] h-[350px] top-1/2 left-1/3 bg-gradient-to-tr from-[#C7D83D]/10 to-[#F05A3C]/15" />
      </div>

      {/* Top Banner Alert / Cluster Status */}
      <div className="bg-[#171717] dark:bg-black/90 backdrop-blur-md text-slate-400 text-[11px] font-mono px-4 py-1.5 flex items-center justify-between border-b border-white/5 select-none relative z-20">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span className="font-semibold tracking-wider">SECURE ADMIN CONSOLE</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">CLUSTER: SUPERMIND-US-PROD</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">POLICY: ZERO TRUST ENFORCED</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-1.5 text-[#F05A3C] hover:text-[#d9492e] transition-colors font-medium"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to User Workspace</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar - Desktop with Liquid Glass */}
        <aside className="hidden lg:flex flex-col w-64 liquid-glass border-r border-slate-200/60 dark:border-white/10 shrink-0 z-20 shadow-xl">
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#171717] to-[#F05A3C] flex items-center justify-center shadow-lg shadow-[#F05A3C]/20 border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-display">
                  SuperMind <span className="text-[10px] bg-[#F05A3C]/10 text-[#F05A3C] font-mono px-1.5 py-0.5 rounded-full border border-[#F05A3C]/20 font-semibold">ADMIN</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono">Control Plane v2.4</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
            <div className="px-3 pb-2 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Management & Operations
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? currentPath === '/admin' || currentPath === '/admin/overview'
                  : currentPath.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#171717] dark:bg-white text-white dark:text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-[#F05A3C] dark:text-[#F05A3C]'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick System Telemetry & Profile */}
          <div className="p-3 border-t border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1a1b1e] border border-slate-200/60 dark:border-white/5 mb-3">
              <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-emerald-500" /> PostgreSQL DB
                </span>
                <span className="text-emerald-500 font-semibold text-[10px]">CONNECTED</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1 overflow-hidden">
                <div className="bg-emerald-500 h-full w-full rounded-full" />
              </div>
            </div>

            {/* Admin Profile Chip */}
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-[#2457D6] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user?.name || 'Administrator'}
                  </div>
                  <span className={`inline-block text-[9px] font-mono px-1.5 py-0.2 rounded border ${roleBadgeStyle(user?.role)}`}>
                    {user?.role || 'ADMIN'}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-white dark:bg-[#141518] flex flex-col z-10 p-4 border-r border-slate-200 dark:border-white/10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F05A3C] flex items-center justify-center text-white font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">SUPERMIND ADMIN</h2>
                    <span className="text-[10px] text-slate-400 font-mono">Control Plane v2.4</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/admin'
                      ? currentPath === '/admin' || currentPath === '/admin/overview'
                      : currentPath.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                        isActive
                          ? 'bg-[#171717] dark:bg-white text-white dark:text-slate-900 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-[#F05A3C]" />
                        <span>{item.name}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit to User Workspace</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-red-500/10 text-xs font-medium text-red-500"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navbar with Liquid Glass */}
          <header className="h-16 liquid-glass border-b border-slate-200/60 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 shadow-sm relative">
            {/* Top specular reflection line */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumbs */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 font-mono">Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900 dark:text-white">{currentNavItem.name}</span>
              </div>
            </div>

            {/* Quick Actions & Search */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden sm:flex items-center relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Quick command or filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#F05A3C] w-48 md:w-64 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                title="Toggle Theme"
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 relative transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F05A3C]" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 mb-3">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">Admin System Alerts</span>
                      <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">All Clear</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Database Health Normal</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">PostgreSQL latency under 2ms. All 10 tables responding.</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">AI Provider SLA 99.8%</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Anthropic Claude and Google Gemini active.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Switch to User View */}
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>User Workspace</span>
              </button>
            </div>
          </header>

          {/* Page Body with Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
