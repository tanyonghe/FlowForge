package com.github.tanyonghe.flowforge.repository;

import com.github.tanyonghe.flowforge.model.Workflow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkflowRepository extends MongoRepository<Workflow, String> {
} 