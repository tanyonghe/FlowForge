import React, { useState } from 'react';
import { Workflow } from '../types/workflow';
import Task from './Task';
import { workflowService } from '../services/workflowService';

interface WorkflowDetailProps {
  workflow: Workflow;
  onBack: () => void;
  onEdit: (id: string) => void;
}

const WorkflowDetail: React.FC<WorkflowDetailProps> = ({
  workflow,
  onBack,
  onEdit
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionInput, setExecutionInput] = useState('{}');

  const handleExecute = async () => {
    try {
      setIsExecuting(true);
      setExecutionResult(null);
      
      const input = JSON.parse(executionInput);
      const result = await workflowService.executeWorkflow(workflow.id, { input });
      setExecutionResult(result);
    } catch (error) {
      setExecutionResult({ error: error instanceof Error ? error.message : 'Execution failed' });
    } finally {
      setIsExecuting(false);
    }
  };

  const getTaskTypeCounts = () => {
    const counts: Record<string, number> = {};
    workflow.tasks.forEach(task => {
      counts[task.type] = (counts[task.type] || 0) + 1;
    });
    return counts;
  };

  const taskCounts = getTaskTypeCounts();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-blue-500 hover:text-blue-700 mb-2 flex items-center"
          >
            ← Back to Workflows
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{workflow.name}</h1>
          <p className="text-gray-600 mt-1">{workflow.description}</p>
        </div>
        <div className="text-right">
          <button
            onClick={() => onEdit(workflow.id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
          >
            ✏️ Edit Workflow
          </button>
        </div>
      </div>

      {/* Workflow Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflow Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Created By</label>
            <p className="text-gray-900">{workflow.createdBy}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Total Tasks</label>
            <p className="text-gray-900">{workflow.tasks.length}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Workflow ID</label>
            <p className="text-gray-900 font-mono text-sm">{workflow.id}</p>
          </div>
        </div>

        {/* Task Type Summary */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Task Types</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(taskCounts).map(([type, count]) => (
              <span
                key={type}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Execution Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Execute Workflow</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input JSON
            </label>
            <textarea
              value={executionInput}
              onChange={(e) => setExecutionInput(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm"
              placeholder='{"key": "value"}'
            />
          </div>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded transition-colors"
          >
            {isExecuting ? 'Executing...' : '▶️ Execute Workflow'}
          </button>
          
          {executionResult && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Execution Result
              </label>
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  {JSON.stringify(executionResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Workflow Tasks ({workflow.tasks.length})
        </h2>
        <div className="space-y-4">
          {workflow.tasks.map((task, index) => (
            <Task key={index} task={task} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetail; 