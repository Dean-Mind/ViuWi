'use client';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center font-nunito text-xl font-normal
                ${isActive
                  ? 'bg-brand-orange text-white'
                  : 'bg-base-300 text-base-content'
                }
                transition-colors duration-200
              `}
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