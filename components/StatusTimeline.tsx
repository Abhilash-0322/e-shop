import { Check, Circle, Clock3 } from 'lucide-react';

export type TimelineStep = {
  label: string;
  detail?: string;
  state: 'complete' | 'current' | 'upcoming';
};

export default function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label="Status timeline">
      {steps.map((step, index) => {
        const Icon = step.state === 'complete' ? Check : step.state === 'current' ? Clock3 : Circle;
        return (
          <li key={step.label} className="relative flex gap-2.5">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                step.state === 'complete'
                  ? 'bg-amazon-greenDark text-white border-amazon-greenDark'
                  : step.state === 'current'
                  ? 'bg-amazon-orange text-white border-amazon-orange'
                  : 'bg-white text-amazon-textMuted border-amazon-border'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className={`text-sm font-bold ${step.state === 'upcoming' ? 'text-amazon-textMuted' : ''}`}>
                {step.label}
              </div>
              {step.detail && <div className="text-xs text-amazon-textMuted mt-0.5">{step.detail}</div>}
            </div>
            {index < steps.length - 1 && (
              <span className="hidden sm:block absolute left-7 right-[-0.75rem] top-3.5 border-t border-dashed border-amazon-border" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
