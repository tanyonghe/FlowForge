package com.github.tanyonghe.flowforge.repository;

import com.github.tanyonghe.flowforge.model.TaskTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskTemplateRepository extends MongoRepository<TaskTemplate, String> {
    List<TaskTemplate> findByType(String type);
    List<TaskTemplate> findByCategory(String category);
    List<TaskTemplate> findByIsActiveTrue();
    List<TaskTemplate> findByCreatedBy(String createdBy);
} 