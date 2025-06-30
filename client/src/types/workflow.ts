export interface Task {
  type: string;
  name: string;
  config: Record<string, any>;
  nextTasks: string[] | null;
  conditions: Record<string, string> | null;
  templateId?: string | null;
  parameters?: Record<string, any> | null;
  templateBased?: boolean;
  configOverrides?: Record<string, any> | null;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  defaultConfig: Record<string, any> | null;
  configSchema: Record<string, any> | null;
  createdBy: string;
  isActive: boolean;
  version: string;
  metadata: Record<string, any> | null;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  tasks: Task[];
  metadata: Record<string, any> | null;
}

export interface WorkflowExecutionInput {
  input: any;
} 