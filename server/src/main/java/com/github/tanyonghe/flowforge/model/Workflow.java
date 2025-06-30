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
    private List<Task> tasks;
    private Map<String, Object> metadata;

    @Data
    public static class Task {
        private String type;
        private String name;
        private Map<String, Object> config;
        private List<String> nextTasks;
        private Map<String, String> conditions;
        private String templateId;
        private Map<String, Object> parameters;
        private Boolean templateBased;
        private Map<String, Object> configOverrides;
    }

    public void setId(String id) {
        this.id = id;
    }
} 