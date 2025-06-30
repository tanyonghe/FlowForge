import React from 'react';
import { TaskTemplate as TaskTemplateType } from '../types/workflow';

interface TaskTemplateProps {
  template: TaskTemplateType;
  onSelect?: (template: TaskTemplateType) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  selectable?: boolean;
}

const TaskTemplate: React.FC<TaskTemplateProps> = ({
  template,
  onSelect,
  onEdit,
  onDelete,
  selectable = false
}) => {
  const getTemplateIcon = (type: string) => {
    switch (type.toLowerCase()) {
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
      case 'condition':
        return '❓';
      default:
        return '⚙️';
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type.toLowerCase()) {
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
      case 'condition':
        return 'bg-pink-100 border-pink-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className={`p-4 border rounded-lg mb-4 ${getTemplateColor(template.type)} ${selectable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
         onClick={() => selectable && onSelect && onSelect(template)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getTemplateIcon(template.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.type} • {template.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {template.isActive ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Active
            </span>
          ) : (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Inactive
            </span>
          )}
          <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
            v{template.version}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3">{template.description}</p>

      {template.defaultConfig && Object.keys(template.defaultConfig).length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Default Configuration:</h4>
          <div className="bg-white p-2 rounded text-sm">
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(template.defaultConfig, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created by: {template.createdBy}</span>
        <span>ID: {template.id.slice(-8)}</span>
      </div>

      {!selectable && (onEdit || onDelete) && (
        <div className="flex space-x-2 mt-3">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(template.id);
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded transition-colors"
            >
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(template.id);
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskTemplate; 