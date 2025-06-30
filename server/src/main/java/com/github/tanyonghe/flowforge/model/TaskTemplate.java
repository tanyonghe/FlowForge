package com.github.tanyonghe.flowforge.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;

@Data
@Document(collection = "task_templates")
public class TaskTemplate {
    @Id
    private String id;
    private String name;
    private String description;
    private String type;
    private String category;
    private Map<String, Object> defaultConfig;
    private Map<String, Object> configSchema;
    private String createdBy;
    private Boolean isActive;
    private String version;
    private Map<String, Object> metadata;

    public void setId(String id) {
        this.id = id;
    }
} 