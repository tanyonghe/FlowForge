import { TaskTemplate } from '../types/workflow';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class TaskTemplateService {
  async getAllTaskTemplates(): Promise<TaskTemplate[]> {
    const response = await fetch(`${API_BASE_URL}/api/task-templates`);
    if (!response.ok) {
      throw new Error('Failed to fetch task templates');
    }
    return response.json();
  }

  async getTaskTemplateById(id: string): Promise<TaskTemplate> {
    const response = await fetch(`${API_BASE_URL}/api/task-templates/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task template');
    }
    return response.json();
  }

  async getTaskTemplatesByType(type: string): Promise<TaskTemplate[]> {
    const response = await fetch(`${API_BASE_URL}/api/task-templates/type/${type}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task templates by type');
    }
    return response.json();
  }

  async getTaskTemplatesByCategory(category: string): Promise<TaskTemplate[]> {
    const response = await fetch(`${API_BASE_URL}/api/task-templates/category/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task templates by category');
    }
    return response.json();
  }

  async getActiveTaskTemplates(): Promise<TaskTemplate[]> {
    const response = await fetch(`${API_BASE_URL}/api/task-templates/active`);
    if (!response.ok) {
      throw new Error('Failed to fetch active task templates');
    }
    return response.json();
  }

  async createTaskTemplate(taskTemplate: Omit<TaskTemplate, 'id'>): Promise<TaskTemplate> {
    const response = await fetch(`${API_BASE_URL}/api/task-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskTemplate),
    });
    if (!response.ok) {
      throw new Error('Failed to create task template');
    }
    return response.json();
  }

  async updateTaskTemplate(id: string, taskTemplate: Partial<TaskTemplate>): Promise<TaskTemplate> {
    const response = await fetch(`${API_BASE_URL}/api/task-templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskTemplate),
    });
    if (!response.ok) {
      throw new Error('Failed to update task template');
    }
    return response.json();
  }

  async deleteTaskTemplate(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/task-templates/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task template');
    }
  }
}

export const taskTemplateService = new TaskTemplateService(); 