import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { Step, StepStatus } from '@/app/types';

interface ProgressBarProps {
  currentStep: Step;
  stepStatus: StepStatus;
  progressText: string;
  isProcessing?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, stepStatus, progressText, isProcessing = false }) => {
  const steps = [
    { id: 'fetch', label: 'Fetch Data', number: 1 },
    { id: 'validate', label: 'Validate', number: 2 },
    { id: 'generate', label: 'Generate', number: 3 },
    { id: 'export', label: 'Export', number: 4 },
  ];

  const getStepIcon = (stepId: keyof StepStatus) => {
    const status = stepStatus[stepId];
    
    if (status === 'success') {
      return <Check className="h-4 w-4 text-white" />;
    }
    if (status === 'error') {
      return <X className="h-4 w-4 text-white" />;
    }
    // Only show loading spinner when actively processing AND it's the current step
    if (currentStep === stepId && isProcessing) {
      return <Loader2 className="h-4 w-4 text-white animate-spin" />;
    }
    // Show step number for future, inactive, or pending steps
    return <span className="text-xs font-semibold text-gray-600">{steps.find(s => s.id === stepId)?.number}</span>;
  };

  const getStepColor = (stepId: keyof StepStatus) => {
    const status = stepStatus[stepId];
    
    if (status === 'success') return 'bg-green-500 border-green-400';
    if (status === 'error') return 'bg-red-500 border-red-400';
    if (currentStep === stepId && isProcessing) return 'bg-blue-500 border-blue-400 animate-pulse-slow';
    if (currentStep === stepId) return 'bg-blue-500 border-blue-400';
    return 'bg-gray-700 border-gray-600';
  };

  const getProgressWidth = () => {
    const stepOrder = ['fetch', 'validate', 'generate', 'export'];
    const completedSteps = stepOrder.filter(step => stepStatus[step as keyof StepStatus] === 'success').length;
    return `${(completedSteps / 4) * 100}%`;
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-2">Automation Progress</h2>
        <p className="text-sm text-blue-400">{progressText}</p>
      </div>
      
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: getProgressWidth() }}
          />
        </div>
        
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full border-2
                  transition-all duration-300 
                  ${getStepColor(step.id as keyof StepStatus)}
                `}
              >
                {getStepIcon(step.id as keyof StepStatus)}
              </div>
              <span className="mt-2 text-xs text-gray-400">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;