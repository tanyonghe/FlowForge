package com.github.tanyonghe.flowforge.service;

import com.github.tanyonghe.flowforge.model.Workflow;
import com.github.tanyonghe.flowforge.repository.WorkflowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkflowService {
    private final WorkflowRepository workflowRepository;

    public Workflow createWorkflow(Workflow workflow) {
        return workflowRepository.save(workflow);
    }

    public List<Workflow> getAllWorkflows() {
        return workflowRepository.findAll();
    }

    public Optional<Workflow> getWorkflowById(String id) {
        return workflowRepository.findById(id);
    }

    public Workflow updateWorkflow(String id, Workflow workflow) {
        workflow.setId(id);
        return workflowRepository.save(workflow);
    }

    public void deleteWorkflow(String id) {
        workflowRepository.deleteById(id);
    }

    public Map<String, Object> executeWorkflow(String id, Map<String, Object> input) {
        Workflow workflow = getWorkflowById(id)
            .orElseThrow(() -> new RuntimeException("Workflow not found"));

        // TODO: Implement workflow execution logic
        // This will be implemented in the next step
        return Map.of("status", "pending", "message", "Workflow execution not yet implemented");
    }

    public List<Workflow> getWorkflowsByStatus(String status) {
        return workflowRepository.findByStatus(status);
    }

    public List<Workflow> getWorkflowsByCreator(String creator) {
        return workflowRepository.findByCreatedBy(creator);
    }
} 