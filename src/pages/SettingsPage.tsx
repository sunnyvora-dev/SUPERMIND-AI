import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { Settings, Shield, Bell, Sun, Moon, Cpu, Database, Eye, Check } from 'lucide-react';
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
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 text-left">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C]">
            System Configuration
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">
          Workspace Settings
        </h1>
        <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-1">
          Configure visual appearance, Supervisor routing parameters, and API security preferences.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Settings Navigation Tabs */}
        <div className="w-full sm:w-56 space-y-1.5">
          {(['Appearance', 'AI Preferences', 'Account', 'Security'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] font-semibold shadow-subtle'
                    : 'bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] text-[#77736B] dark:text-[#A8A49C] hover:text-[#171717] dark:hover:text-[#F4F0E6] hover:bg-[#EAE5D9]/50'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F05A3C]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="flex-1 p-6 md:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-6 shadow-subtle">
          {activeTab === 'Appearance' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F4F0E6]">Theme & Interface</h3>
                <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-0.5">Choose between Warm Ivory editorial mode and Deep Ink high-contrast mode.</p>
              </div>
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-xl border text-left space-y-3 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'border-[#F05A3C] bg-[#F4F0E6] shadow-sm'
                      : 'border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/30 hover:border-[#77736B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Sun className="h-5 w-5 text-[#F05A3C]" />
                    {theme === 'light' && <span className="h-2 w-2 rounded-full bg-[#F05A3C]" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#171717]">Warm Ivory (Light)</div>
                    <div className="text-[11px] text-[#77736B] mt-0.5">Classic editorial paper aesthetic</div>
                  </div>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-xl border text-left space-y-3 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'border-[#F05A3C] bg-[#171717] shadow-sm'
                      : 'border-[#DCD6CA] dark:border-[#33312B] bg-[#171717]/40 hover:border-[#77736B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Moon className="h-5 w-5 text-[#C7D83D]" />
                    {theme === 'dark' && <span className="h-2 w-2 rounded-full bg-[#F05A3C]" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#F4F0E6]">Deep Ink (Dark)</div>
                    <div className="text-[11px] text-[#A8A49C] mt-0.5">Refined retro-futuristic dark mode</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'AI Preferences' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F4F0E6]">Supervisor AI Routing</h3>
                <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-0.5">Automate model dispatch based on benchmark domain suitability.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717]/60 border border-[#DCD6CA]/70 dark:border-[#33312B]">
                  <div className="pr-4">
                    <div className="font-semibold text-[#171717] dark:text-[#F4F0E6]">Automatic Supervisor Routing</div>
                    <div className="text-[#77736B] dark:text-[#A8A49C] text-[11px] mt-0.5">Let Supervisor AI analyze intent and dispatch candidate LLMs with optimal SLA</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRouting}
                    onChange={(e) => setAutoRouting(e.target.checked)}
                    className="h-4 w-4 accent-[#F05A3C] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717]/60 border border-[#DCD6CA]/70 dark:border-[#33312B]">
                  <div className="pr-4">
                    <div className="font-semibold text-[#171717] dark:text-[#F4F0E6]">Multi-Model Consensus Default</div>
                    <div className="text-[#77736B] dark:text-[#A8A49C] text-[11px] mt-0.5">Query top candidate models concurrently and cross-synthesize outputs for complex queries</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={consensusMode}
                    onChange={(e) => setConsensusModeState(e.target.checked)}
                    className="h-4 w-4 accent-[#F05A3C] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Account' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F4F0E6]">Workspace Organization</h3>
                <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-0.5">Manage default team workspace assignments and quotas.</p>
              </div>
              <div className="space-y-1.5 pt-2">
                <label className="font-medium text-[#171717] dark:text-[#F4F0E6]">Default Workspace Namespace</label>
                <input
                  type="text"
                  value="SuperMind AI Production Workspace"
                  disabled
                  className="w-full p-3 bg-[#EAE5D9]/50 dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-[#77736B] dark:text-[#A8A49C] font-mono text-xs"
                />
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F4F0E6]">Security & Key Governance</h3>
                <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-0.5">Encrypted API token secrets and Redis OTP authentication status.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#EAE5D9]/30 dark:bg-[#171717]/60 border border-[#DCD6CA] dark:border-[#33312B] space-y-2">
                <div className="flex items-center gap-2 text-[#2457D6] dark:text-[#88A9FF] font-medium">
                  <Shield className="h-4 w-4" />
                  <span>Hardware Enclave Encryption Active</span>
                </div>
                <p className="text-[#77736B] dark:text-[#A8A49C] leading-relaxed">
                  Third-party provider credentials (Google, Anthropic, OpenAI, Groq) are securely encrypted at rest and never exposed to the client interface.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-[#DCD6CA] dark:border-[#33312B]">
            <Button onClick={handleSave} size="sm" variant="primary">
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};