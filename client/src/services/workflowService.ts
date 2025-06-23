import { Workflow, WorkflowExecutionInput } from '../types/workflow';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const workflowService = {
  // Get all workflows
  getWorkflows: async (): Promise<Workflow[]> => {
    const response = await fetch(`${API_BASE}/workflows`);
    if (!response.ok) {
      throw new Error('Failed to fetch workflows');
    }
    return response.json();
  },

  // Get workflow by ID
  getWorkflow: async (id: string): Promise<Workflow> => {
    const response = await fetch(`${API_BASE}/workflows/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch workflow');
    }
    return response.json();
  },

  // Create workflow
  createWorkflow: async (workflow: Omit<Workflow, 'id'>): Promise<Workflow> => {
    const response = await fetch(`${API_BASE}/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    });
    if (!response.ok) {
      throw new Error('Failed to create workflow');
    }
    return response.json();
  },

  // Update workflow
  updateWorkflow: async (id: string, workflow: Omit<Workflow, 'id'>): Promise<Workflow> => {
    const response = await fetch(`${API_BASE}/workflows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    });
    if (!response.ok) {
      throw new Error('Failed to update workflow');
    }
    return response.json();
  },

  // Delete workflow
  deleteWorkflow: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/workflows/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete workflow');
    }
  },

  // Execute workflow
  executeWorkflow: async (id: string, input: WorkflowExecutionInput): Promise<any> => {
    const response = await fetch(`${API_BASE}/workflows/${id}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!response.ok) {
      throw new Error('Failed to execute workflow');
    }
    return response.json();
  }
}; 