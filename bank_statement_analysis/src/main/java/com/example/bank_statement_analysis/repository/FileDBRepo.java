package com.example.bank_statement_analysis.repository;

import com.example.bank_statement_analysis.model.FileDB;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileDBRepo extends MongoRepository<FileDB, String> {
    FileDB findFirstByCustomerAccountNumber(String customerAccountNumber);

    FileDB findFirstByCustomerEmailAddress(String customerEmailAddress);

    FileDB findFirstByCustomerId(String customerId);

    FileDB findExtracted_jsonById(String id);

}

