import React from 'react';
import { WorkflowStep as WorkflowStepType } from '../types/workflow';

interface WorkflowStepProps {
  step: WorkflowStepType;
  index: number;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, index }) => {
  const getStepIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'start':
        return '🚀';
      case 'end':
        return '🏁';
      case 'task':
        return '⚙️';
      case 'condition':
        return '❓';
      default:
        return '📋';
    }
  };

  const getStepColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'start':
        return 'bg-green-100 border-green-300';
      case 'end':
        return 'bg-red-100 border-red-300';
      case 'task':
        return 'bg-blue-100 border-blue-300';
      case 'condition':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className={`p-4 border rounded-lg mb-4 ${getStepColor(step.type)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getStepIcon(step.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{step.name}</h3>
            <p className="text-sm text-gray-600">Step {index + 1} • {step.type}</p>
          </div>
        </div>
        <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
          #{index + 1}
        </span>
      </div>

      {step.config && Object.keys(step.config).length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Configuration:</h4>
          <div className="bg-white p-2 rounded text-sm">
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(step.config, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {step.nextSteps && step.nextSteps.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Next Steps:</h4>
          <div className="flex flex-wrap gap-1">
            {step.nextSteps.map((nextStep, idx) => (
              <span
                key={idx}
                className="bg-white px-2 py-1 rounded text-xs text-gray-600 border"
              >
                {nextStep}
              </span>
            ))}
          </div>
        </div>
      )}

      {step.conditions && Object.keys(step.conditions).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Conditions:</h4>
          <div className="bg-white p-2 rounded text-sm">
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(step.conditions, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowStep; 