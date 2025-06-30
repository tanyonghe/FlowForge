import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow, Task, TaskTemplate } from '../types/workflow';
import { workflowService } from '../services/workflowService';
import { taskTemplateService } from '../services/taskTemplateService';

interface WorkflowFormProps {
  workflow?: Workflow;
  onSave: (workflow: Workflow) => void;
  onCancel: () => void;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({
  workflow,
  onSave,
  onCancel
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Workflow>>({
    name: '',
    description: '',
    createdBy: '',
    tasks: [],
    metadata: null
  });
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!workflow;

  useEffect(() => {
    if (workflow) {
      setFormData(workflow);
    }
    loadTaskTemplates();
  }, [workflow]);

  const loadTaskTemplates = async () => {
    try {
      const templates = await taskTemplateService.getActiveTaskTemplates();
      setTaskTemplates(templates);
    } catch (err) {
      console.warn('Failed to load task templates:', err);
    }
  };

  const handleInputChange = (field: keyof Workflow, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTask = () => {
    const newTask: Task = {
      type: 'task',
      name: '',
      config: {},
      nextTasks: [],
      conditions: null,
      templateId: null,
      parameters: null,
      templateBased: false,
      configOverrides: null
    };
    setFormData(prev => ({
      ...prev,
      tasks: [...(prev.tasks || []), newTask]
    }));
  };

  const updateTask = (index: number, field: keyof Task, value: any) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks?.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const removeTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      setError('Workflow name is required');
      return;
    }

    if (!formData.tasks || formData.tasks.length === 0) {
      setError('At least one task is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const workflowData = {
        ...formData,
        name: formData.name!.trim(),
        description: formData.description?.trim() || '',
        createdBy: formData.createdBy?.trim() || 'current-user',
        tasks: formData.tasks!.map(task => ({
          ...task,
          name: task.name.trim(),
          config: task.config || {},
          nextTasks: task.nextTasks || [],
          conditions: task.conditions || null,
          templateId: task.templateId || null,
          parameters: task.parameters || null,
          templateBased: task.templateBased || false,
          configOverrides: task.configOverrides || null
        }))
      } as Workflow;

      let savedWorkflow: Workflow;
      if (isEditing) {
        savedWorkflow = await workflowService.updateWorkflow(workflow!.id, workflowData);
      } else {
        savedWorkflow = await workflowService.createWorkflow(workflowData);
      }

      onSave(savedWorkflow);
      // Navigate to the workflow detail page
      navigate(`/workflows/${savedWorkflow.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workflow');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && workflow) {
      navigate(`/workflows/${workflow.id}`);
    } else {
      navigate('/workflows');
    }
  };

  const getTaskTypeOptions = () => [
    { value: 'start', label: 'Start' },
    { value: 'end', label: 'End' },
    { value: 'task', label: 'Task' },
    { value: 'http', label: 'HTTP Request' },
    { value: 'email', label: 'Email' },
    { value: 'database', label: 'Database' },
    { value: 'file', label: 'File Operation' },
    { value: 'transform', label: 'Data Transform' },
    { value: 'condition', label: 'Condition' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Edit Workflow' : 'Create New Workflow'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workflow Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter workflow name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created By
              </label>
              <input
                type="text"
                value={formData.createdBy || ''}
                onChange={(e) => handleInputChange('createdBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter creator name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter workflow description"
            />
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Tasks ({formData.tasks?.length || 0})
              </h3>
              <button
                type="button"
                onClick={addTask}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                ➕ Add Task
              </button>
            </div>

            {formData.tasks && formData.tasks.length > 0 ? (
              <div className="space-y-4">
                {formData.tasks.map((task, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Task {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️ Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Task Name *
                        </label>
                        <input
                          type="text"
                          value={task.name || ''}
                          onChange={(e) => updateTask(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter task name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Task Type *
                        </label>
                        <select
                          value={task.type || 'task'}
                          onChange={(e) => updateTask(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {getTaskTypeOptions().map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Configuration (JSON)
                      </label>
                      <textarea
                        value={(() => {
                          try {
                            return JSON.stringify(task.config || {}, null, 2);
                          } catch (err) {
                            return '{}';
                          }
                        })()}
                        onChange={(e) => {
                          try {
                            const config = JSON.parse(e.target.value);
                            updateTask(index, 'config', config);
                          } catch (err) {
                            // Allow invalid JSON during typing
                          }
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder='{"key": "value"}'
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Next Tasks (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={task.nextTasks?.join(', ') || ''}
                        onChange={(e) => updateTask(index, 'nextTasks', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="task1, task2, task3"
                      />
                    </div>

                    {/* Template-based task options */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={task.templateBased || false}
                            onChange={(e) => updateTask(index, 'templateBased', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Use Task Template
                          </span>
                        </label>
                      </div>
                      {task.templateBased && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Template ID
                          </label>
                          <input
                            type="text"
                            value={task.templateId || ''}
                            onChange={(e) => updateTask(index, 'templateId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="template-id"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks added yet. Click "Add Task" to get started.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-colors"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Workflow' : 'Create Workflow')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkflowForm; 