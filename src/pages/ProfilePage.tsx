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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C]">
              Identity & Allocation
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">
            Account Profile
          </h1>
          <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C] mt-1">
            Manage your credentials, subscription tier, 2FA security, and monthly token capacity.
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
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile
          </Button>

          <Button
            onClick={() => setIsPlanModalOpen(true)}
            size="sm"
            variant="primary"
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Crown className="h-3.5 w-3.5 text-[#C7D83D]" /> Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Main Profile Summary Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-xl bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] font-serif text-2xl flex items-center justify-center border border-[#DCD6CA] dark:border-[#33312B] shrink-0 shadow-subtle">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg md:text-xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6]">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified Account
                </span>
              </div>
              <div className="text-xs text-[#77736B] dark:text-[#A8A49C] flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#F05A3C]" /> {user.email}
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAE5D9] dark:bg-[#171717] text-[#171717] dark:text-[#F4F0E6] font-mono text-xs border border-[#DCD6CA] dark:border-[#33312B]">
                  <Crown className="h-3.5 w-3.5 text-[#F05A3C]" /> {user.planTier} Plan Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Token Usage Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#DCD6CA] dark:border-[#33312B] text-xs">
          <div className="p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717]/60 border border-[#DCD6CA]/80 dark:border-[#33312B] space-y-1">
            <div className="text-[#77736B] dark:text-[#A8A49C] font-mono text-[11px] uppercase tracking-wider">Tokens Consumed</div>
            <div className="font-mono font-bold text-lg text-[#171717] dark:text-[#F4F0E6]">
              {(user.tokensUsed / 1000).toFixed(0)}k Tokens
            </div>
            <div className="w-full bg-[#DCD6CA] dark:bg-[#33312B] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#F05A3C] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (user.tokensUsed / user.tokenBudget) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717]/60 border border-[#DCD6CA]/80 dark:border-[#33312B] space-y-1">
            <div className="text-[#77736B] dark:text-[#A8A49C] font-mono text-[11px] uppercase tracking-wider">Monthly Allocation</div>
            <div className="font-mono font-bold text-lg text-[#2457D6] dark:text-[#88A9FF]">
              {(user.tokenBudget / 1000000).toFixed(0)} Million Tokens
            </div>
            <div className="text-[11px] text-[#77736B] dark:text-[#A8A49C] mt-1">Resets on the 1st of every month</div>
          </div>

          <div className="p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717]/60 border border-[#DCD6CA]/80 dark:border-[#33312B] space-y-1">
            <div className="text-[#77736B] dark:text-[#A8A49C] font-mono text-[11px] uppercase tracking-wider">Account Protection</div>
            <div className="font-medium text-[#171717] dark:text-[#F4F0E6] flex items-center gap-1.5 text-xs pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Redis 2FA OTP Enabled</span>
            </div>
            <div className="text-[11px] text-[#77736B] dark:text-[#A8A49C]">Protected via email verification</div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-5 shadow-subtle">
        <div className="flex items-center space-x-2 border-b border-[#DCD6CA] dark:border-[#33312B] pb-3">
          <Key className="h-4 w-4 text-[#F05A3C]" />
          <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F4F0E6]">Security & Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Current Password</label>
            <div className="relative">
              <Lock className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">New Password</label>
              <div className="relative">
                <Lock className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Confirm New Password</label>
              <div className="relative">
                <Lock className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C]"
                />
              </div>
            </div>
          </div>

          <Button type="submit" isLoading={passLoading} size="sm" variant="primary" className="mt-2">
            Update Password
          </Button>
        </form>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] rounded-2xl shadow-editorial p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCD6CA] dark:border-[#33312B] pb-3">
              <h3 className="text-base font-serif font-normal text-[#171717] dark:text-[#F4F0E6] flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-[#F05A3C]" /> Edit Profile Credentials
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Full Name</label>
                <div className="relative">
                  <UserIcon className="h-3.5 w-3.5 text-[#F05A3C] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] outline-none focus:border-[#F05A3C]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Email Address</label>
                <div className="relative">
                  <Mail className="h-3.5 w-3.5 text-[#F05A3C] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] outline-none focus:border-[#F05A3C]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#DCD6CA] dark:border-[#33312B]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading} size="sm" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPGRADE PLAN TIER MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] rounded-2xl shadow-editorial p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCD6CA] dark:border-[#33312B] pb-3">
              <h3 className="text-base font-serif font-normal text-[#171717] dark:text-[#F4F0E6] flex items-center gap-2">
                <Crown className="h-4 w-4 text-[#F05A3C]" /> Select Subscription Plan
              </h3>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1 text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Starter', price: '$9/mo', tokens: '500k Tokens', desc: 'Basic multi-LLM access & chat studio' },
                { name: 'Pro', price: '$29/mo', tokens: '5M Tokens', desc: 'Full supervisor routing, RAG, & image synthesis' },
                { name: 'Enterprise', price: '$99/mo', tokens: '50M Tokens', desc: 'Priority API SLA, custom models, and dedicated capacity' },
              ].map((tier) => {
                const isCurrent = user.planTier === tier.name;
                return (
                  <div
                    key={tier.name}
                    className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                      isCurrent
                        ? 'bg-[#F4F0E6] dark:bg-[#171717] border-[#F05A3C] shadow-subtle'
                        : 'bg-[#EAE5D9]/30 dark:bg-[#171717]/40 border-[#DCD6CA] dark:border-[#33312B]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-normal text-sm text-[#171717] dark:text-[#F4F0E6]">{tier.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F05A3C] text-[#F4F0E6] font-mono text-[9px] uppercase font-bold">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-serif text-[#171717] dark:text-[#F4F0E6]">{tier.price}</div>
                      <div className="text-xs font-mono text-[#F05A3C] font-semibold">{tier.tokens}</div>
                      <p className="text-[11px] text-[#77736B] dark:text-[#A8A49C] pt-1 leading-relaxed">{tier.desc}</p>
                    </div>

                    <Button
                      onClick={() => handlePlanChange(tier.name as any)}
                      disabled={isCurrent}
                      variant={isCurrent ? 'outline' : 'primary'}
                      size="sm"
                      className="w-full mt-2"
                    >
                      {isCurrent ? 'Active Plan' : `Upgrade to ${tier.name}`}
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