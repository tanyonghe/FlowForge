import React, { useState, useEffect } from 'react';
import { TaskTemplate as TaskTemplateType } from '../types/workflow';
import TaskTemplate from './TaskTemplate';
import { taskTemplateService } from '../services/taskTemplateService';

interface TaskTemplateListProps {
  onSelect?: (template: TaskTemplateType) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  selectable?: boolean;
  showFilters?: boolean;
}

const TaskTemplateList: React.FC<TaskTemplateListProps> = ({
  onSelect,
  onEdit,
  onDelete,
  selectable = false,
  showFilters = true
}) => {
  const [templates, setTemplates] = useState<TaskTemplateType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskTemplateService.getAllTaskTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await taskTemplateService.deleteTaskTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task template');
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (filterType && template.type !== filterType) return false;
    if (filterCategory && template.category !== filterCategory) return false;
    if (showActiveOnly && !template.isActive) return false;
    return true;
  });

  const uniqueTypes = Array.from(new Set(templates.map(t => t.type)));
  const uniqueCategories = Array.from(new Set(templates.map(t => t.category)));

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading task templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error:</strong> {error}
        <button
          onClick={loadTemplates}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Templates</h1>
          <p className="text-gray-600 mt-1">
            Reusable task definitions for building workflows
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-600">
            {filteredTemplates.length} of {templates.length} templates
          </span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active Only</span>
              </label>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterType('');
                  setFilterCategory('');
                  setShowActiveOnly(true);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No task templates found</div>
          <p className="text-gray-400 mt-2">Try adjusting your filters or create a new template</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TaskTemplate
              key={template.id}
              template={template}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={handleDelete}
              selectable={selectable}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskTemplateList; 