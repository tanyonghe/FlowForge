package com.github.tanyonghe.flowforge.service;

import com.github.tanyonghe.flowforge.model.Workflow;
import com.github.tanyonghe.flowforge.repository.WorkflowRepository;
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
class WorkflowServiceTest {

    @Mock
    private WorkflowRepository workflowRepository;

    @InjectMocks
    private WorkflowService workflowService;

    private Workflow testWorkflow;

    @BeforeEach
    void setUp() {
        testWorkflow = createTestWorkflow("Test Workflow");
    }

    @Test
    void getAllWorkflows_ReturnsAllWorkflows() {
        // Arrange
        Workflow workflow1 = createTestWorkflow("Workflow 1");
        Workflow workflow2 = createTestWorkflow("Workflow 2");
        List<Workflow> expectedWorkflows = Arrays.asList(workflow1, workflow2);
        
        when(workflowRepository.findAll()).thenReturn(expectedWorkflows);

        // Act
        List<Workflow> result = workflowService.getAllWorkflows();

        // Assert
        assertEquals(2, result.size());
        assertEquals("Workflow 1", result.get(0).getName());
        assertEquals("Workflow 2", result.get(1).getName());
        verify(workflowRepository).findAll();
    }

    @Test
    void getWorkflowById_ValidId_ReturnsWorkflow() {
        // Arrange
        when(workflowRepository.findById("test-id")).thenReturn(Optional.of(testWorkflow));

        // Act
        Optional<Workflow> result = workflowService.getWorkflowById("test-id");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Workflow", result.get().getName());
        verify(workflowRepository).findById("test-id");
    }

    @Test
    void getWorkflowById_InvalidId_ReturnsEmpty() {
        // Arrange
        when(workflowRepository.findById("invalid-id")).thenReturn(Optional.empty());

        // Act
        Optional<Workflow> result = workflowService.getWorkflowById("invalid-id");

        // Assert
        assertFalse(result.isPresent());
        verify(workflowRepository).findById("invalid-id");
    }

    @Test
    void createWorkflow_ValidWorkflow_ReturnsSavedWorkflow() {
        // Arrange
        when(workflowRepository.save(any(Workflow.class))).thenReturn(testWorkflow);

        // Act
        Workflow result = workflowService.createWorkflow(testWorkflow);

        // Assert
        assertNotNull(result);
        assertEquals("Test Workflow", result.getName());
        verify(workflowRepository).save(testWorkflow);
    }

    @Test
    void updateWorkflow_ValidId_ReturnsUpdatedWorkflow() {
        // Arrange
        Workflow existingWorkflow = createTestWorkflow("Original Workflow");
        existingWorkflow.setId("test-id");
        
        Workflow updatedWorkflow = createTestWorkflow("Updated Workflow");
        updatedWorkflow.setDescription("Updated description");
        
        when(workflowRepository.save(any(Workflow.class))).thenReturn(updatedWorkflow);

        // Act
        Workflow result = workflowService.updateWorkflow("test-id", updatedWorkflow);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Workflow", result.getName());
        assertEquals("Updated description", result.getDescription());
        verify(workflowRepository).save(argThat(workflow -> "test-id".equals(workflow.getId())));
    }

    @Test
    void updateWorkflow_SetsIdCorrectly() {
        // Arrange
        Workflow workflow = createTestWorkflow("Test Workflow");
        when(workflowRepository.save(any(Workflow.class))).thenReturn(workflow);

        // Act
        workflowService.updateWorkflow("test-id", workflow);

        // Assert
        verify(workflowRepository).save(argThat(w -> "test-id".equals(w.getId())));
    }

    @Test
    void deleteWorkflow_ValidId_DeletesSuccessfully() {
        // Arrange
        doNothing().when(workflowRepository).deleteById("test-id");

        // Act
        workflowService.deleteWorkflow("test-id");

        // Assert
        verify(workflowRepository).deleteById("test-id");
    }

    @Test
    void executeWorkflow_ValidId_ReturnsExecutionResult() {
        // Arrange
        when(workflowRepository.findById("test-id")).thenReturn(Optional.of(testWorkflow));
        Map<String, Object> input = new HashMap<>();
        input.put("param1", "value1");

        // Act
        Map<String, Object> result = workflowService.executeWorkflow("test-id", input);

        // Assert
        assertNotNull(result);
        assertEquals("pending", result.get("status"));
        assertEquals("Workflow execution not yet implemented", result.get("message"));
        verify(workflowRepository).findById("test-id");
    }

    @Test
    void executeWorkflow_InvalidId_ThrowsException() {
        // Arrange
        when(workflowRepository.findById("invalid-id")).thenReturn(Optional.empty());
        Map<String, Object> input = new HashMap<>();

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            workflowService.executeWorkflow("invalid-id", input);
        });
        
        assertEquals("Workflow not found", exception.getMessage());
        verify(workflowRepository).findById("invalid-id");
    }

    private Workflow createTestWorkflow(String name) {
        Workflow workflow = new Workflow();
        workflow.setName(name);
        workflow.setDescription("Test description for " + name);
        workflow.setCreatedBy("test-user");
        
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("tags", new String[]{"test", "workflow"});
        metadata.put("category", "test");
        workflow.setMetadata(metadata);
        
        return workflow;
    }


} 