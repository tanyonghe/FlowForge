package com.github.tanyonghe.flowforge.service;

import com.github.tanyonghe.flowforge.model.TaskTemplate;
import com.github.tanyonghe.flowforge.repository.TaskTemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskTemplateServiceTest {

    @Mock
    private TaskTemplateRepository taskTemplateRepository;

    @InjectMocks
    private TaskTemplateService taskTemplateService;

    private TaskTemplate testTemplate;

    @BeforeEach
    void setUp() {
        testTemplate = createTestTemplate("Test Template", "HTTP", "API");
    }

    @Test
    void getAllTaskTemplates_ReturnsAllTemplates() {
        // Arrange
        TaskTemplate template1 = createTestTemplate("Template 1", "HTTP", "API");
        TaskTemplate template2 = createTestTemplate("Template 2", "EMAIL", "Notification");
        List<TaskTemplate> expectedTemplates = Arrays.asList(template1, template2);
        
        when(taskTemplateRepository.findAll()).thenReturn(expectedTemplates);

        // Act
        List<TaskTemplate> result = taskTemplateService.getAllTaskTemplates();

        // Assert
        assertEquals(2, result.size());
        assertEquals("Template 1", result.get(0).getName());
        assertEquals("Template 2", result.get(1).getName());
        verify(taskTemplateRepository).findAll();
    }

    @Test
    void getTaskTemplateById_ValidId_ReturnsTemplate() {
        // Arrange
        when(taskTemplateRepository.findById("test-id")).thenReturn(Optional.of(testTemplate));

        // Act
        Optional<TaskTemplate> result = taskTemplateService.getTaskTemplateById("test-id");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Template", result.get().getName());
        verify(taskTemplateRepository).findById("test-id");
    }

    @Test
    void getTaskTemplateById_InvalidId_ReturnsEmpty() {
        // Arrange
        when(taskTemplateRepository.findById("invalid-id")).thenReturn(Optional.empty());

        // Act
        Optional<TaskTemplate> result = taskTemplateService.getTaskTemplateById("invalid-id");

        // Assert
        assertFalse(result.isPresent());
        verify(taskTemplateRepository).findById("invalid-id");
    }

    @Test
    void getTaskTemplatesByType_ValidType_ReturnsFilteredTemplates() {
        // Arrange
        TaskTemplate httpTemplate = createTestTemplate("HTTP Template", "HTTP", "API");
        TaskTemplate emailTemplate = createTestTemplate("Email Template", "EMAIL", "Notification");
        List<TaskTemplate> allTemplates = Arrays.asList(httpTemplate, emailTemplate);
        
        when(taskTemplateRepository.findByType("HTTP")).thenReturn(Arrays.asList(httpTemplate));

        // Act
        List<TaskTemplate> result = taskTemplateService.getTaskTemplatesByType("HTTP");

        // Assert
        assertEquals(1, result.size());
        assertEquals("HTTP Template", result.get(0).getName());
        assertEquals("HTTP", result.get(0).getType());
        verify(taskTemplateRepository).findByType("HTTP");
    }

    @Test
    void getTaskTemplatesByCategory_ValidCategory_ReturnsFilteredTemplates() {
        // Arrange
        TaskTemplate apiTemplate = createTestTemplate("API Template", "HTTP", "API");
        TaskTemplate notificationTemplate = createTestTemplate("Notification Template", "EMAIL", "Notification");
        
        when(taskTemplateRepository.findByCategory("API")).thenReturn(Arrays.asList(apiTemplate));

        // Act
        List<TaskTemplate> result = taskTemplateService.getTaskTemplatesByCategory("API");

        // Assert
        assertEquals(1, result.size());
        assertEquals("API Template", result.get(0).getName());
        assertEquals("API", result.get(0).getCategory());
        verify(taskTemplateRepository).findByCategory("API");
    }

    @Test
    void getActiveTaskTemplates_ReturnsOnlyActiveTemplates() {
        // Arrange
        TaskTemplate activeTemplate = createTestTemplate("Active Template", "HTTP", "API");
        activeTemplate.setIsActive(true);
        
        TaskTemplate inactiveTemplate = createTestTemplate("Inactive Template", "EMAIL", "Notification");
        inactiveTemplate.setIsActive(false);
        
        when(taskTemplateRepository.findByIsActiveTrue()).thenReturn(Arrays.asList(activeTemplate));

        // Act
        List<TaskTemplate> result = taskTemplateService.getActiveTaskTemplates();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Active Template", result.get(0).getName());
        assertTrue(result.get(0).getIsActive());
        verify(taskTemplateRepository).findByIsActiveTrue();
    }

    @Test
    void createTaskTemplate_ValidTemplate_ReturnsSavedTemplate() {
        // Arrange
        when(taskTemplateRepository.save(any(TaskTemplate.class))).thenReturn(testTemplate);

        // Act
        TaskTemplate result = taskTemplateService.createTaskTemplate(testTemplate);

        // Assert
        assertNotNull(result);
        assertEquals("Test Template", result.getName());
        assertEquals("HTTP", result.getType());
        assertEquals("API", result.getCategory());
        assertTrue(result.getIsActive());
        verify(taskTemplateRepository).save(testTemplate);
    }

    @Test
    void createTaskTemplate_SetsDefaultValues() {
        // Arrange
        TaskTemplate template = new TaskTemplate();
        template.setName("New Template");
        template.setType("HTTP");
        template.setCategory("API");
        template.setIsActive(null); // Test default value setting
        
        when(taskTemplateRepository.save(any(TaskTemplate.class))).thenReturn(template);

        // Act
        TaskTemplate result = taskTemplateService.createTaskTemplate(template);

        // Assert
        assertTrue(result.getIsActive());
        verify(taskTemplateRepository).save(template);
    }

    @Test
    void updateTaskTemplate_ValidId_ReturnsUpdatedTemplate() {
        // Arrange
        TaskTemplate existingTemplate = createTestTemplate("Original Template", "HTTP", "API");
        existingTemplate.setId("test-id");
        
        TaskTemplate updatedTemplate = createTestTemplate("Updated Template", "HTTP", "API");
        updatedTemplate.setId("test-id");
        updatedTemplate.setDescription("Updated description");
        
        when(taskTemplateRepository.findById("test-id")).thenReturn(Optional.of(existingTemplate));
        when(taskTemplateRepository.save(any(TaskTemplate.class))).thenReturn(updatedTemplate);

        // Act
        TaskTemplate result = taskTemplateService.updateTaskTemplate("test-id", updatedTemplate);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Template", result.getName());
        assertEquals("Updated description", result.getDescription());
        verify(taskTemplateRepository).findById("test-id");
        verify(taskTemplateRepository).save(any(TaskTemplate.class));
    }

    @Test
    void updateTaskTemplate_InvalidId_ThrowsException() {
        // Arrange
        when(taskTemplateRepository.findById("invalid-id")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskTemplateService.updateTaskTemplate("invalid-id", testTemplate);
        });
        
        assertEquals("TaskTemplate not found with id: invalid-id", exception.getMessage());
        verify(taskTemplateRepository).findById("invalid-id");
        verify(taskTemplateRepository, never()).save(any(TaskTemplate.class));
    }

    @Test
    void deleteTaskTemplate_ValidId_DeletesSuccessfully() {
        // Arrange
        doNothing().when(taskTemplateRepository).deleteById("test-id");

        // Act
        taskTemplateService.deleteTaskTemplate("test-id");

        // Assert
        verify(taskTemplateRepository).deleteById("test-id");
    }

    private TaskTemplate createTestTemplate(String name, String type, String category) {
        TaskTemplate template = new TaskTemplate();
        template.setName(name);
        template.setDescription("Test description for " + name);
        template.setType(type);
        template.setCategory(category);
        template.setIsActive(true);
        template.setVersion("1.0");
        template.setCreatedBy("test-user");
        
        Map<String, Object> defaultConfig = new HashMap<>();
        defaultConfig.put("timeout", 30);
        defaultConfig.put("retries", 3);
        template.setDefaultConfig(defaultConfig);
        
        Map<String, Object> configSchema = new HashMap<>();
        configSchema.put("type", "object");
        template.setConfigSchema(configSchema);
        
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("tags", new String[]{"test", "template"});
        template.setMetadata(metadata);
        
        return template;
    }
} 