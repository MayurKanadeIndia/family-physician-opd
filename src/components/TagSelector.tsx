import React from 'react';

interface Props {
  label: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}

export const TagSelector: React.FC<Props> = ({ label, options, value, onChange }) => {
  const toggle = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <section className="mb-3 rounded-xl border bg-white p-3">
      <div className="mb-2 text-xs font-semibold text-slate-700">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={
                'rounded-full border px-2 py-1 text-[11px] ' +
                (selected
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700')
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </section>
  );
};
