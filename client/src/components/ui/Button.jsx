import { forwardRef } from 'react';

const variants = {
  primary: 'gradient-primary text-white shadow-glow hover:shadow-lg hover:scale-[1.02]',
  secondary: 'glass text-surface-100 hover:bg-surface-800/80 hover:border-surface-500/30',
  danger: 'bg-danger-500/20 text-danger-400 border border-danger-500/30 hover:bg-danger-500/30',
  ghost: 'text-surface-300 hover:text-surface-100 hover:bg-surface-800/50',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-glow-accent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  xl: 'px-9 py-4 text-lg',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-300 ease-out cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
