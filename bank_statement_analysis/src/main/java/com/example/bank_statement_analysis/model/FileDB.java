package com.example.bank_statement_analysis.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "files_demo6")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class FileDB {
    @Id
    private String id;
    private String name;
    private String type;
    private String customerName = "NA";
    private String customerEmailAddress = "NA";
    private String customerAccountNumber = "NA";
    private String customerId = "NA";
    private String fromDate = "NA";
    private String toDate = "NA";
    private byte[] uploaded_file;
    private String filePassword;
    private org.bson.Document extracted_json;

    public FileDB(String fileName, String contentType, byte[] file) {
        this.name = fileName;
        this.type = contentType;
        this.uploaded_file = file;
    }
}