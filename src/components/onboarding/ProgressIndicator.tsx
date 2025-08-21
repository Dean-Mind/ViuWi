'use client';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export default function ProgressIndicator({ currentStep, totalSteps, onStepClick }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const stepIndex = index; // 0-based index for comparison with currentStep
        const isActive = stepIndex <= currentStep;
        const isCompleted = stepIndex < currentStep;

        const isClickable = Boolean(onStepClick) && isCompleted;

        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center font-nunito text-xl font-normal
                ${isActive
                  ? 'bg-brand-orange text-white'
                  : 'bg-base-300 text-base-content'
                }
                ${isClickable
                  ? 'cursor-pointer hover:bg-brand-orange-light hover:text-white'
                  : ''
                }
                transition-colors duration-200
              `}
              onClick={isClickable ? () => onStepClick?.(stepIndex) : undefined}
            >
              {stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div className={`w-20 h-0.5 mx-2 ${isCompleted ? 'bg-brand-orange' : 'bg-base-300'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}