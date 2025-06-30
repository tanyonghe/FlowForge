import React, { useState, useEffect } from 'react';
import { Workflow } from '../types/workflow';
import { workflowService } from '../services/workflowService';
import WorkflowCard from './WorkflowCard';

interface WorkflowListProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
  onRefresh: () => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({
  onView,
  onEdit,
  onDelete,
  onExecute,
  onRefresh
}) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workflowService.getWorkflows();
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await workflowService.deleteWorkflow(id);
        setWorkflows(workflows.filter(w => w.id !== id));
      } catch (err) {
        alert('Failed to delete workflow');
      }
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         workflow.tasks.some(task => task.type.toLowerCase() === filterType.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const getTaskTypeOptions = () => {
    const types = new Set<string>();
    workflows.forEach(workflow => {
      workflow.tasks.forEach(task => {
        types.add(task.type);
      });
    });
    return Array.from(types).sort();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <p className="text-lg font-semibold">Error loading workflows</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchWorkflows}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-1">
            {filteredWorkflows.length} of {workflows.length} workflows
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={fetchWorkflows}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            🔄 Refresh
          </button>
          <button
            onClick={onRefresh}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            ➕ Create New
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Workflows
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, or creator..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Task Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {getTaskTypeOptions().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg font-semibold mb-2">No workflows found</p>
            <p className="text-sm">
              {workflows.length === 0 
                ? "Create your first workflow to get started!"
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map(workflow => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onView={onView}
              onEdit={onEdit}
              onDelete={handleDelete}
              onExecute={onExecute}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowList; 