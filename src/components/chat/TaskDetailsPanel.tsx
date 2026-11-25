import React from 'react';
import { TaskDetails } from '../../types';
import { Activity, CheckCircle2, ShieldCheck, Cpu, X } from 'lucide-react';

interface TaskDetailsPanelProps {
  taskDetails: TaskDetails | null;
  onClose: () => void;
}

export const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({ taskDetails, onClose }) => {
  if (!taskDetails) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
      />
      <aside className="fixed inset-y-0 right-0 z-50 md:static md:z-auto w-full max-w-[320px] sm:w-80 bg-[#FAF8F3] dark:bg-[#1E1E1C] border-l border-[#DCD6CA] dark:border-[#33312B] h-full flex flex-col p-4 space-y-4 select-none shadow-2xl md:shadow-none animate-fadeIn text-[#171717] dark:text-[#F4F0E6]">
      <div className="flex items-center justify-between border-b border-[#DCD6CA] dark:border-[#33312B] pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-[#F05A3C]" />
          <span className="font-mono font-medium text-xs uppercase tracking-wider text-[#F05A3C]">Supervisor Task Trace</span>
        </div>
        <button onClick={onClose} className="p-1 text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-xl bg-[#EAE5D9] dark:bg-[#252421] space-y-2 border border-[#DCD6CA] dark:border-[#33312B]">
          <div className="flex justify-between">
            <span className="text-[#77736B]">Intent:</span>
            <span className="font-medium text-[#F05A3C]">{taskDetails.intent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#77736B]">Complexity:</span>
            <span className="font-medium text-[#171717] dark:text-[#F4F0E6]">{taskDetails.complexity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#77736B]">Status:</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> {taskDetails.status}
            </span>
          </div>
        </div>

        <div>
          <div className="font-medium text-[#171717] dark:text-[#F4F0E6] mb-1">Capabilities Invoked:</div>
          <div className="flex flex-wrap gap-1.5">
            {taskDetails.capabilities.map((cap, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] text-[#2457D6] dark:text-[#4D7DFA] text-[10px] font-mono font-medium">
                {cap}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="font-medium text-[#171717] dark:text-[#F4F0E6] mb-1">Routed AI Models:</div>
          <div className="space-y-1">
            {taskDetails.providers.map((p, i) => (
              <div key={i} className="p-2 rounded-lg bg-[#EAE5D9] dark:bg-[#252421] border border-[#DCD6CA] dark:border-[#33312B] text-[11px] flex items-center justify-between font-mono">
                <span className="flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-[#2457D6]" /> {p}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#EAE5D9] dark:bg-[#252421] border border-[#DCD6CA] dark:border-[#33312B] space-y-1 text-[11px] text-[#77736B]">
          <div className="flex justify-between">
            <span>Latency SLA:</span>
            <span className="font-mono font-medium text-[#171717] dark:text-[#F4F0E6]">{taskDetails.latencyMs}ms</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Cost:</span>
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">${taskDetails.costUsd}</span>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
