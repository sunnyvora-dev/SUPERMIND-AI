import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Shield,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    platformName: 'SuperMind AI',
    maintenanceMode: false,
    allowRegistrations: true,
    defaultTier: 'FREE_TRIAL',
    defaultSignupTokens: 100000,
    primaryModel: 'anthropic/claude-3-7-sonnet',
    maxAttachmentSizeMb: 25,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res && Object.keys(res).length > 0) {
        setSettings((prev: any) => ({ ...prev, ...res }));
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminService.updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save platform settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Platform Settings & Governance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global operational controls, default user quotas, platform access flags, and fallback AI routing policy.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F05A3C]' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Platform settings successfully saved and applied to cluster!
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Security & Access */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#F05A3C]" /> Platform Access & Availability
          </h2>

          <div className="space-y-4 pt-2">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Maintenance Mode</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  When enabled, non-admin users will see a maintenance notice upon logging in.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className="text-slate-600 dark:text-slate-300"
              >
                {settings.maintenanceMode ? (
                  <ToggleRight className="w-8 h-8 text-[#F05A3C]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            {/* Allow Registrations */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Allow Public Registrations</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allows new users to create accounts without manual invitation.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, allowRegistrations: !settings.allowRegistrations })}
                className="text-slate-600 dark:text-slate-300"
              >
                {settings.allowRegistrations ? (
                  <ToggleRight className="w-8 h-8 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Quotas & Default Tiers */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" /> Default Quotas & Onboarding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Default User Tier
              </label>
              <select
                value={settings.defaultTier}
                onChange={(e) => setSettings({ ...settings, defaultTier: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#F05A3C]"
              >
                <option value="FREE_TRIAL">Free Trial</option>
                <option value="STARTER">Starter</option>
                <option value="PRO">Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Initial Signup Token Budget
              </label>
              <input
                type="number"
                value={settings.defaultSignupTokens}
                onChange={(e) => setSettings({ ...settings, defaultSignupTokens: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#F05A3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Fallback AI Model
              </label>
              <select
                value={settings.primaryModel}
                onChange={(e) => setSettings({ ...settings, primaryModel: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#F05A3C]"
              >
                <option value="anthropic/claude-3-7-sonnet">Claude 3.7 Sonnet (Anthropic)</option>
                <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (Google)</option>
                <option value="openai/gpt-4o">GPT-4o (OpenAI)</option>
                <option value="deepseek/deepseek-r1">DeepSeek R1 (DeepSeek)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Max Document Upload Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxAttachmentSizeMb}
                onChange={(e) => setSettings({ ...settings, maxAttachmentSizeMb: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#F05A3C]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#F05A3C] text-white text-xs font-bold hover:bg-[#d9492e] transition-colors shadow-lg shadow-[#F05A3C]/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Persisting Configuration...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default AdminSettingsPage;
