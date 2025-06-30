import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import './App.css';
import WorkflowList from './components/WorkflowList';
import WorkflowDetail from './components/WorkflowDetail';
import WorkflowForm from './components/WorkflowForm';
import { Workflow } from './types/workflow';
import { workflowService } from './services/workflowService';

function App() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const handleSaveWorkflow = (workflow: Workflow) => {
    // Update the workflows list
    setWorkflows(prev => {
      const existingIndex = prev.findIndex(w => w.id === workflow.id);
      if (existingIndex >= 0) {
        // Update existing workflow
        const updated = [...prev];
        updated[existingIndex] = workflow;
        return updated;
      } else {
        // Add new workflow
        return [...prev, workflow];
      }
    });
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">FlowForge</h1>
                <span className="ml-2 text-sm text-gray-500">Workflow Automation</span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Workflows
                </a>
                <a
                  href="/workflows/new"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                  ➕ Create New
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            {/* Redirect root to workflows list */}
            <Route path="/" element={<Navigate to="/workflows" replace />} />
            
            {/* Workflows list */}
            <Route path="/workflows" element={<WorkflowListPage />} />
            
            {/* Create new workflow */}
            <Route 
              path="/workflows/new" 
              element={
                <WorkflowForm
                  onSave={handleSaveWorkflow}
                  onCancel={() => window.location.href = '/workflows'}
                />
              } 
            />
            
            {/* Edit workflow */}
            <Route 
              path="/workflows/:id/edit" 
              element={<WorkflowEditForm onSave={handleSaveWorkflow} />} 
            />
            
            {/* Workflow detail */}
            <Route path="/workflows/:id" element={<WorkflowDetailPage />} />
            
            {/* 404 - redirect to workflows */}
            <Route path="*" element={<Navigate to="/workflows" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              FlowForge - Dynamic Workflow Automation Engine
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Component for workflows list page
const WorkflowListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleViewWorkflow = (id: string) => {
    navigate(`/workflows/${id}`);
  };

  const handleEditWorkflow = (id: string) => {
    navigate(`/workflows/${id}/edit`);
  };

  const handleDeleteWorkflow = (id: string) => {
    // This is handled in WorkflowList component
  };

  const handleExecuteWorkflow = (id: string) => {
    navigate(`/workflows/${id}`);
  };

  const handleCreateNew = () => {
    navigate('/workflows/new');
  };

  return (
    <WorkflowList
      onView={handleViewWorkflow}
      onEdit={handleEditWorkflow}
      onDelete={handleDeleteWorkflow}
      onExecute={handleExecuteWorkflow}
      onRefresh={handleCreateNew}
    />
  );
};

// Component for editing workflows
const WorkflowEditForm: React.FC<{ onSave: (workflow: Workflow) => void }> = ({ onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      workflowService.getWorkflow(id)
        .then(setWorkflow)
        .catch(() => navigate('/workflows'))
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!workflow) {
    return <Navigate to="/workflows" replace />;
  }

  return (
    <WorkflowForm
      workflow={workflow}
      onSave={onSave}
      onCancel={() => navigate(`/workflows/${id}`)}
    />
  );
};

// Component for workflow detail page
const WorkflowDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      workflowService.getWorkflow(id)
        .then(setWorkflow)
        .catch(() => navigate('/workflows'))
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!workflow) {
    return <Navigate to="/workflows" replace />;
  }

  return (
    <WorkflowDetail
      workflow={workflow}
      onBack={() => navigate('/workflows')}
      onEdit={(id) => navigate(`/workflows/${id}/edit`)}
    />
  );
};

export default App;
