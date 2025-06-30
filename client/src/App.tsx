import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, Link } from 'react-router-dom';
import './App.css';
import WorkflowList from './components/WorkflowList';
import WorkflowDetail from './components/WorkflowDetail';
import WorkflowForm from './components/WorkflowForm';
import { Workflow } from './types/workflow';
import { workflowService } from './services/workflowService';

// Header component with navigation
const Header: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    console.log('Settings button clicked');
    navigate('/settings');
  };

  const handleHelpClick = () => {
    console.log('Help button clicked');
    navigate('/help');
  };

  const handleProfileClick = () => {
    console.log('Profile button clicked');
    navigate(isLoggedIn ? "/profile" : "/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">FlowForge</h1>
            <span className="ml-2 text-sm text-gray-500">Workflow Automation</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSettingsClick}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Settings"
            >
              ⚙️
            </button>
            <button
              onClick={handleHelpClick}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Help"
            >
              ❓
            </button>
            <button
              onClick={handleProfileClick}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title={isLoggedIn ? "Profile" : "Login"}
            >
              👤
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

function App() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simple auth state for now

  // Check for existing auth state on app startup
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

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
        <Header isLoggedIn={isLoggedIn} />

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
            
            {/* Settings page */}
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Help page */}
            <Route path="/help" element={<HelpPage />} />
            
            {/* Login page */}
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            
            {/* Profile page */}
            <Route path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn} />} />
            
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

// Settings page component
const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  console.log('SettingsPage component rendered');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/workflows')}
            className="text-blue-500 hover:text-blue-700 mb-2 flex items-center mr-4"
          >
            ← Back to Workflows
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">To Be Developed</h2>
          <p className="text-gray-500">Settings functionality is coming soon!</p>
        </div>
      </div>
    </div>
  );
};

// Help page component
const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/workflows')}
            className="text-blue-500 hover:text-blue-700 mb-2 flex items-center mr-4"
          >
            ← Back to Workflows
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Help</h1>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">To Be Developed</h2>
          <p className="text-gray-500">Help documentation is coming soon!</p>
        </div>
      </div>
    </div>
  );
};

// Login page component
const LoginPage: React.FC<{ setIsLoggedIn: (loggedIn: boolean) => void }> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate login - in real app, this would call your auth API
    try {
      // For demo purposes, accept any email/password
      if (formData.email && formData.password) {
        // Store auth token in localStorage
        localStorage.setItem('authToken', 'demo-token');
        localStorage.setItem('userEmail', formData.email);
        setIsLoggedIn(true);
        navigate('/profile');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to FlowForge
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/workflows')}
              className="text-blue-600 hover:text-blue-500"
            >
              Continue without login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Profile page component
const ProfilePage: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setUserEmail(localStorage.getItem('userEmail') || '');
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/workflows')}
              className="text-blue-500 hover:text-blue-700 mb-2 flex items-center mr-4"
            >
              ← Back to Workflows
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> {userEmail}</p>
              <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="text-center py-8 text-gray-500">
              <p>Profile management features coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
