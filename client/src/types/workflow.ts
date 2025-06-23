export interface WorkflowStep {
  type: string;
  name: string;
  config: Record<string, any>;
  nextSteps: string[] | null;
  conditions: Record<string, string> | null;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  steps: WorkflowStep[];
  metadata: Record<string, any> | null;
}

export interface WorkflowExecutionInput {
  input: any;
} 