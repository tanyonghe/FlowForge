package com.github.tanyonghe.flowforge.repository;

import com.github.tanyonghe.flowforge.model.Workflow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkflowRepository extends MongoRepository<Workflow, String> {
    List<Workflow> findByStatus(String status);
    List<Workflow> findByCreatedBy(String createdBy);
} 