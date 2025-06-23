package com.github.tanyonghe.flowforge.controller;

import com.github.tanyonghe.flowforge.model.Workflow;
import com.github.tanyonghe.flowforge.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/workflows")
@RequiredArgsConstructor
public class WorkflowController {
    private final WorkflowService workflowService;

    @PostMapping
    public ResponseEntity<Workflow> createWorkflow(@RequestBody Workflow workflow) {
        return ResponseEntity.ok(workflowService.createWorkflow(workflow));
    }

    @GetMapping
    public ResponseEntity<List<Workflow>> getAllWorkflows() {
        return ResponseEntity.ok(workflowService.getAllWorkflows());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workflow> getWorkflowById(@PathVariable String id) {
        return workflowService.getWorkflowById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workflow> updateWorkflow(@PathVariable String id, @RequestBody Workflow workflow) {
        return ResponseEntity.ok(workflowService.updateWorkflow(id, workflow));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable String id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<Map<String, Object>> executeWorkflow(
            @PathVariable String id,
            @RequestBody Map<String, Object> input) {
        return ResponseEntity.ok(workflowService.executeWorkflow(id, input));
    }
} 