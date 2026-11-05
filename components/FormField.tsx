import {ReactNode} from 'react';

export default function FormField({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return <div className="min-w-0">
    <label htmlFor={id} className="block text-sm font-bold">{label}</label>
    {hint && <p id={descriptionId} className="mt-1 text-xs muted">{hint}</p>}
    <div className="mt-2">{children}</div>
    {error && <p id={errorId} className="error-text mt-1" role="alert">{error}</p>}
  </div>;
}

export function fieldA11y(id: string, error?: string, hint?: string) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': [hint && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') || undefined,
  };
}
