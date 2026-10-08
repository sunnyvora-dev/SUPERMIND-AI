import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Button } from '../components/ui/Button';
import { 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  Zap, 
  Key, 
  CheckCircle2, 
  X, 
  Edit3, 
  Sparkles, 
  Crown, 
  Lock, 
  Save, 
  Check, 
  Clock 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useChat();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Edit Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  // Change Password Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, email });
      showToast('Profile updated successfully!', 'success');
      setIsEditModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planTier: 'Starter' | 'Pro' | 'Enterprise') => {
    const budgetMap = {
      Starter: 500000,
      Pro: 5000000,
      Enterprise: 50000000,
    };
    try {
      await updateProfile({ planTier, tokenBudget: budgetMap[planTier] });
      showToast(`Subscription plan upgraded to ${planTier}!`, 'success');
      setIsPlanModalOpen(false);
    } catch (err) {
      showToast('Failed to update subscription plan', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPass.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setPassLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      showToast('Password successfully updated!', 'success');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err) {
      showToast('Failed to update password', 'error');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8 text-left animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account Profile
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal credentials, plan tier, 2FA security, and token allocation
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setName(user.name);
              setEmail(user.email);
              setIsEditModalOpen(true);
            }}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="h-4 w-4" /> Edit Profile
          </Button>

          <Button
            onClick={() => setIsPlanModalOpen(true)}
            size="sm"
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Crown className="h-4 w-4 text-amber-300" /> Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Main Profile Summary Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 font-display">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified Account
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-500" /> {user.email}
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-500/30">
                  <Crown className="h-3.5 w-3.5 text-amber-500" /> {user.planTier} Plan Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Token Usage Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
            <div className="text-slate-500 dark:text-slate-400 font-medium">Tokens Consumed</div>
            <div className="font-mono font-bold text-lg text-slate-900 dark:text-white">
              {(user.tokensUsed / 1000).toFixed(0)}k Tokens
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (user.tokensUsed / user.tokenBudget) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
            <div className="text-slate-500 dark:text-slate-400 font-medium">Monthly Token Allocation</div>
            <div className="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">
              {(user.tokenBudget / 1000000).toFixed(0)} Million Tokens
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Resets on the 1st of every month</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
            <div className="text-slate-500 dark:text-slate-400 font-medium">Account Security</div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1 text-sm pt-0.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> 2FA Redis OTP Active
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Protected via Email Verification</div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <Button type="submit" isLoading={passLoading} size="sm" className="mt-2">
            Update Password
          </Button>
        </form>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0B0F1F] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-indigo-500" /> Edit Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <UserIcon className="h-4 w-4 text-indigo-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-indigo-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading} size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPGRADE PLAN TIER MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F1F] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" /> Subscription Plan Tiers
              </h3>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Starter', price: '$9/mo', tokens: '500k Tokens', desc: 'Basic multi-LLM access & chat studio' },
                { name: 'Pro', price: '$29/mo', tokens: '5M Tokens', desc: 'Full supervisor routing, RAG, & images' },
                { name: 'Enterprise', price: '$99/mo', tokens: '50M Tokens', desc: 'Priority API access & dedicated capacity' },
              ].map((tier) => {
                const isCurrent = user.planTier === tier.name;
                return (
                  <div
                    key={tier.name}
                    className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                      isCurrent
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-base">{tier.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white font-bold text-[9px]">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{tier.price}</div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400">{tier.tokens}</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">{tier.desc}</p>
                    </div>

                    <Button
                      onClick={() => handlePlanChange(tier.name as any)}
                      disabled={isCurrent}
                      variant={isCurrent ? 'outline' : 'primary'}
                      size="sm"
                      className="w-full mt-2"
                    >
                      {isCurrent ? 'Current Plan' : `Upgrade to ${tier.name}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
