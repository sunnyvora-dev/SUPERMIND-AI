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
    <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col p-4 space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Supervisor Task Trace</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-500">Intent:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{taskDetails.intent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Complexity:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{taskDetails.complexity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> {taskDetails.status}
            </span>
          </div>
        </div>

        <div>
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Capabilities Invoked:</div>
          <div className="flex flex-wrap gap-1.5">
            {taskDetails.capabilities.map((cap, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-medium">
                {cap}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Routed AI Models:</div>
          <div className="space-y-1">
            {taskDetails.providers.map((p, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] flex items-center justify-between font-mono">
                <span className="flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-cyan-500" /> {p}
                </span>
                <span className="text-emerald-500">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 space-y-1 text-[11px] text-slate-500">
          <div className="flex justify-between">
            <span>Latency SLA:</span>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{taskDetails.latencyMs}ms</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Cost:</span>
            <span className="font-mono font-medium text-emerald-600">${taskDetails.costUsd}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
