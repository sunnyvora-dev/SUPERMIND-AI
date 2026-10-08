import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { Settings, Shield, Bell, Sun, Moon, Cpu, Database, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { showToast } = useChat();
  const [activeTab, setActiveTab] = useState<'Account' | 'Appearance' | 'AI Preferences' | 'Security'>('Appearance');

  const [autoRouting, setAutoRouting] = useState(true);
  const [consensusMode, setConsensusModeState] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    showToast('Settings updated successfully', 'success');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-xs text-slate-500">Configure application preferences, theme appearance, and AI routing</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Settings Navigation Tabs */}
        <div className="w-full sm:w-56 space-y-1">
          {['Appearance', 'AI Preferences', 'Account', 'Security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="flex-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          {activeTab === 'Appearance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Theme & Display</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                    theme === 'light' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Sun className="h-6 w-6 text-amber-500 mx-auto" />
                  <div className="text-xs font-bold text-slate-900">Light Mode</div>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                    theme === 'dark' ? 'border-indigo-500 bg-slate-800' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Moon className="h-6 w-6 text-indigo-400 mx-auto" />
                  <div className="text-xs font-bold text-white">Dark Mode</div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'AI Preferences' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Supervisor AI Routing</h3>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Automatic Supervisor Routing</div>
                  <div className="text-slate-400">Let Supervisor AI automatically select candidate LLM providers</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoRouting}
                  onChange={(e) => setAutoRouting(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Multi-Model Consensus Default</div>
                  <div className="text-slate-400">Query candidate models in parallel for complex queries</div>
                </div>
                <input
                  type="checkbox"
                  checked={consensusMode}
                  onChange={(e) => setConsensusModeState(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded"
                />
              </div>
            </div>
          )}

          {activeTab === 'Account' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account Details</h3>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Default Workspace</label>
                <input type="text" value="SuperMind AI Workspace" disabled className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500" />
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security & API Keys</h3>
              <p className="text-slate-400">API keys are securely encrypted on backend microservices. Never exposed to frontend clients.</p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button onClick={handleSave} size="sm">Save Preferences</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
