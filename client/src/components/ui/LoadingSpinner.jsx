const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-surface-700 border-t-primary-500 animate-spin`} />
        <div className={`${sizes[size]} rounded-full border-2 border-transparent border-b-accent-400 animate-spin absolute inset-0`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
