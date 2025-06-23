import React, { useState } from 'react';
import './App.css';
import WorkflowList from './components/WorkflowList';
import WorkflowDetail from './components/WorkflowDetail';
import { Workflow } from './types/workflow';
import { workflowService } from './services/workflowService';

type View = 'list' | 'detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const handleViewWorkflow = async (id: string) => {
    try {
      const workflow = await workflowService.getWorkflow(id);
      setSelectedWorkflow(workflow);
      setCurrentView('detail');
    } catch (error) {
      alert('Failed to load workflow details');
    }
  };

  const handleEditWorkflow = (id: string) => {
    // TODO: Implement edit functionality
    alert('Edit functionality coming soon!');
  };

  const handleDeleteWorkflow = (id: string) => {
    // This is handled in WorkflowList component
  };

  const handleExecuteWorkflow = (id: string) => {
    // Navigate to detail view and focus on execution
    handleViewWorkflow(id);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedWorkflow(null);
  };

  const handleCreateNew = () => {
    // TODO: Implement create functionality
    alert('Create workflow functionality coming soon!');
  };

  return (
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
              <span className="text-sm text-gray-500">
                {currentView === 'list' ? 'Workflow List' : 'Workflow Details'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'list' ? (
          <WorkflowList
            onView={handleViewWorkflow}
            onEdit={handleEditWorkflow}
            onDelete={handleDeleteWorkflow}
            onExecute={handleExecuteWorkflow}
            onRefresh={handleCreateNew}
          />
        ) : selectedWorkflow ? (
          <WorkflowDetail
            workflow={selectedWorkflow}
            onBack={handleBackToList}
            onEdit={handleEditWorkflow}
          />
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}
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
  );
}

export default App;
