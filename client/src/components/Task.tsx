import React from 'react';
import { Task as TaskType } from '../types/workflow';

interface TaskProps {
  task: TaskType;
  index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
  const getTaskIcon = (type: string | null) => {
    const taskType = type || 'unknown';
    switch (taskType.toLowerCase()) {
      case 'start':
        return '🚀';
      case 'end':
        return '🏁';
      case 'task':
        return '⚙️';
      case 'condition':
        return '❓';
      case 'http':
        return '🌐';
      case 'email':
        return '📧';
      case 'database':
        return '🗄️';
      case 'file':
        return '📁';
      case 'transform':
        return '🔄';
      default:
        return '📋';
    }
  };

  const getTaskColor = (type: string | null) => {
    const taskType = type || 'unknown';
    switch (taskType.toLowerCase()) {
      case 'start':
        return 'bg-green-100 border-green-300';
      case 'end':
        return 'bg-red-100 border-red-300';
      case 'task':
        return 'bg-blue-100 border-blue-300';
      case 'condition':
        return 'bg-yellow-100 border-yellow-300';
      case 'http':
        return 'bg-blue-100 border-blue-300';
      case 'email':
        return 'bg-green-100 border-green-300';
      case 'database':
        return 'bg-purple-100 border-purple-300';
      case 'file':
        return 'bg-orange-100 border-orange-300';
      case 'transform':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const taskType = task.type || 'unknown';
  const taskConfig = task.config || {};
  const taskNextTasks = task.nextTasks || [];
  const taskConditions = task.conditions || {};
  const taskTemplateBased = task.templateBased || false;
  const taskParameters = task.parameters || {};

  return (
    <div className={`p-4 border rounded-lg mb-4 ${getTaskColor(task.type)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getTaskIcon(task.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{task.name}</h3>
            <p className="text-sm text-gray-600">Task {index + 1} • {taskType}</p>
          </div>
        </div>
        <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
          #{index + 1}
        </span>
      </div>

      {taskConfig && Object.keys(taskConfig).length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Configuration:</h4>
          <div className="bg-white p-2 rounded text-sm">
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(taskConfig, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {taskNextTasks && taskNextTasks.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Next Tasks:</h4>
          <div className="flex flex-wrap gap-1">
            {taskNextTasks.map((nextTask, idx) => (
              <span
                key={idx}
                className="bg-white px-2 py-1 rounded text-xs text-gray-600 border"
              >
                {nextTask}
              </span>
            ))}
          </div>
        </div>
      )}

      {taskConditions && Object.keys(taskConditions).length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Conditions:</h4>
          <div className="bg-white p-2 rounded text-sm">
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(taskConditions, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {taskTemplateBased && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Template Info:</h4>
          <div className="bg-white p-2 rounded text-sm">
            <p className="text-xs text-gray-600">Template ID: {task.templateId}</p>
            {taskParameters && Object.keys(taskParameters).length > 0 && (
              <div className="mt-1">
                <p className="text-xs text-gray-600">Parameters:</p>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(taskParameters, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Task; 