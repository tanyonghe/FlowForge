package com.github.tanyonghe.flowforge.service;

import com.github.tanyonghe.flowforge.model.TaskTemplate;
import com.github.tanyonghe.flowforge.repository.TaskTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskTemplateService {
    
    @Autowired
    private TaskTemplateRepository taskTemplateRepository;
    
    public List<TaskTemplate> getAllTaskTemplates() {
        return taskTemplateRepository.findAll();
    }
    
    public Optional<TaskTemplate> getTaskTemplateById(String id) {
        return taskTemplateRepository.findById(id);
    }
    
    public List<TaskTemplate> getTaskTemplatesByType(String type) {
        return taskTemplateRepository.findByType(type);
    }
    
    public List<TaskTemplate> getActiveTaskTemplates() {
        return taskTemplateRepository.findByIsActiveTrue();
    }
    
    public List<TaskTemplate> getTaskTemplatesByCategory(String category) {
        return taskTemplateRepository.findByCategory(category);
    }
    
    public TaskTemplate createTaskTemplate(TaskTemplate taskTemplate) {
        if (taskTemplate.getIsActive() == null) {
            taskTemplate.setIsActive(true);
        }
        return taskTemplateRepository.save(taskTemplate);
    }
    
    public TaskTemplate updateTaskTemplate(String id, TaskTemplate taskTemplate) {
        Optional<TaskTemplate> existing = taskTemplateRepository.findById(id);
        if (existing.isPresent()) {
            TaskTemplate existingTemplate = existing.get();
            existingTemplate.setName(taskTemplate.getName());
            existingTemplate.setDescription(taskTemplate.getDescription());
            existingTemplate.setType(taskTemplate.getType());
            existingTemplate.setCategory(taskTemplate.getCategory());
            existingTemplate.setDefaultConfig(taskTemplate.getDefaultConfig());
            existingTemplate.setConfigSchema(taskTemplate.getConfigSchema());
            existingTemplate.setIsActive(taskTemplate.getIsActive());
            existingTemplate.setVersion(taskTemplate.getVersion());
            existingTemplate.setMetadata(taskTemplate.getMetadata());
            return taskTemplateRepository.save(existingTemplate);
        }
        throw new RuntimeException("TaskTemplate not found with id: " + id);
    }
    
    public void deleteTaskTemplate(String id) {
        taskTemplateRepository.deleteById(id);
    }
} 