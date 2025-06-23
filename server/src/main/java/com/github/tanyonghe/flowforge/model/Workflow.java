package com.github.tanyonghe.flowforge.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "workflows")
public class Workflow {
    @Id
    private String id;
    private String name;
    private String description;
    private String createdBy;
    private List<WorkflowStep> steps;
    private Map<String, Object> metadata;

    @Data
    public static class WorkflowStep {
        private String type;
        private String name;
        private Map<String, Object> config;
        private List<String> nextSteps;
        private Map<String, String> conditions;
    }

    public void setId(String id) {
        this.id = id;
    }
} 