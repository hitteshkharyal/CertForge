import { HiCheck } from 'react-icons/hi';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-2 w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Step circle */}
            <div className="flex items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-500
                  ${isCompleted
                    ? 'gradient-primary text-white shadow-glow'
                    : isCurrent
                      ? 'border-2 border-primary-500 text-primary-400 animate-pulse-glow'
                      : 'border border-surface-600 text-surface-500'
                  }
                `}
              >
                {isCompleted ? <HiCheck className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block transition-colors duration-300 ${
                  isCurrent ? 'text-primary-400' : isCompleted ? 'text-surface-300' : 'text-surface-500'
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`w-8 lg:w-12 h-0.5 rounded-full transition-all duration-500 ${
                  isCompleted ? 'gradient-primary' : 'bg-surface-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
