import React from 'react';
import { Workflow } from '../types/workflow';

interface WorkflowCardProps {
  workflow: Workflow;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  onView,
  onEdit,
  onDelete,
  onExecute
}) => {
  const getStepTypeCounts = () => {
    const counts: Record<string, number> = {};
    workflow.steps.forEach(step => {
      counts[step.type] = (counts[step.type] || 0) + 1;
    });
    return counts;
  };

  const stepCounts = getStepTypeCounts();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {workflow.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {workflow.description}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <span>Created by: {workflow.createdBy}</span>
            <span className="mx-2">•</span>
            <span>{workflow.steps.length} steps</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            ID: {workflow.id.slice(-8)}
          </span>
        </div>
      </div>

      {/* Step Type Summary */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Step Types:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stepCounts).map(([type, count]) => (
            <span
              key={type}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
            >
              {type}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onView(workflow.id)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded transition-colors"
        >
          👁️ View
        </button>
        <button
          onClick={() => onEdit(workflow.id)}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-2 rounded transition-colors"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onExecute(workflow.id)}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-2 rounded transition-colors"
        >
          ▶️ Execute
        </button>
        <button
          onClick={() => onDelete(workflow.id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded transition-colors"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default WorkflowCard; 