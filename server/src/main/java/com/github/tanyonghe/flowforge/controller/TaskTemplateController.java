package com.github.tanyonghe.flowforge.controller;

import com.github.tanyonghe.flowforge.model.TaskTemplate;
import com.github.tanyonghe.flowforge.service.TaskTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/task-templates")
@CrossOrigin(origins = "*")
public class TaskTemplateController {
    
    @Autowired
    private TaskTemplateService taskTemplateService;
    
    @GetMapping
    public ResponseEntity<List<TaskTemplate>> getAllTaskTemplates() {
        return ResponseEntity.ok(taskTemplateService.getAllTaskTemplates());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TaskTemplate> getTaskTemplateById(@PathVariable String id) {
        Optional<TaskTemplate> taskTemplate = taskTemplateService.getTaskTemplateById(id);
        return taskTemplate.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<TaskTemplate>> getTaskTemplatesByType(@PathVariable String type) {
        return ResponseEntity.ok(taskTemplateService.getTaskTemplatesByType(type));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TaskTemplate>> getTaskTemplatesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(taskTemplateService.getTaskTemplatesByCategory(category));
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<TaskTemplate>> getActiveTaskTemplates() {
        return ResponseEntity.ok(taskTemplateService.getActiveTaskTemplates());
    }
    
    @PostMapping
    public ResponseEntity<TaskTemplate> createTaskTemplate(@RequestBody TaskTemplate taskTemplate) {
        return ResponseEntity.ok(taskTemplateService.createTaskTemplate(taskTemplate));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TaskTemplate> updateTaskTemplate(@PathVariable String id, @RequestBody TaskTemplate taskTemplate) {
        try {
            return ResponseEntity.ok(taskTemplateService.updateTaskTemplate(id, taskTemplate));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskTemplate(@PathVariable String id) {
        taskTemplateService.deleteTaskTemplate(id);
        return ResponseEntity.ok().build();
    }
} 