import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, required, icon: Icon, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-xl border bg-white dark:bg-slate-800/60
            px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100
            placeholder:text-slate-400
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-slate-200 dark:border-slate-700'
            }
            ${Icon ? 'pl-9' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
