import React from 'react';
import { CheckSquare, CheckCircle2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  category: string;
}

interface TasksSummaryWidgetProps {
  tasks: Task[];
}

const priorityConfig = {
  high:   { label: 'High', className: '',                          style: { backgroundColor: '#C97B5A', color: '#fff' } },
  medium: { label: 'Med',  className: 'bg-secondary text-primary-dark', style: undefined },
  low:    { label: 'Low',  className: 'bg-background text-gray-500',    style: undefined },
};

const TasksSummaryWidget: React.FC<TasksSummaryWidgetProps> = ({ tasks }) => {
  const total     = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;
  const percent   = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highPending = tasks.filter((t) => !t.completed && t.priority === 'high').length;
  const medPending  = tasks.filter((t) => !t.completed && t.priority === 'medium').length;
  const lowPending  = tasks.filter((t) => !t.completed && t.priority === 'low').length;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 border-t-4 border-t-primary flex flex-col">
      <h2 className="text-base font-semibold mb-6 text-primary flex items-center gap-2">
        <CheckSquare className="w-4 h-4" />
        Tasks Summary
      </h2>

      {/* Completion ring + stats */}
      <div className="flex items-center justify-center gap-8 mb-8">
        {/* Circular progress */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#f3f4f6" strokeWidth="5" />
            <circle
              cx="28" cy="28" r="22"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - percent / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">
            {percent}%
          </span>
        </div>

        {/* Numbers */}
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-normal text-gray-400 text-sm">{completed}</span>
            <span className="text-gray-400 text-sm"> / {total} completed</span>
          </p>
          <p className="text-gray-400 text-sm">{remaining} remaining</p>
        </div>
      </div>

      {/* Priority circles */}
      <div className="flex justify-center gap-6 mb-6">
        {([['high', highPending], ['medium', medPending], ['low', lowPending]] as const).map(([p, count]) => (
          <div
            key={p}
            className={`w-18 h-18 rounded-full flex flex-col items-center justify-center font-semibold ${priorityConfig[p].className ?? ''}`}
            style={{ width: '4.5rem', height: '4.5rem', ...priorityConfig[p].style }}
          >
            <span className="text-xl leading-none font-bold">{count}</span>
            <span className="text-[11px] leading-none mt-1.5">{priorityConfig[p].label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        {total === 0 ? (
          <p className="text-sm text-gray-400">No tasks yet</p>
        ) : remaining === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            All tasks complete!
          </div>
        ) : (
          <p className="text-xs text-gray-400">{completed} done · {remaining} to go</p>
        )}
      </div>
    </div>
  );
};

export default TasksSummaryWidget;
