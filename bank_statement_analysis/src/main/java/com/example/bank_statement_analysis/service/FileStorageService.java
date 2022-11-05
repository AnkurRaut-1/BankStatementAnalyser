package com.example.bank_statement_analysis.service;

import com.example.bank_statement_analysis.model.FileDB;
import com.example.bank_statement_analysis.repository.FileDBRepo;
import com.fasterxml.jackson.databind.JsonNode;
import org.bson.Document;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class FileStorageService {
    @Autowired
    private FileDBRepo fileDbRepo;

    public FileDB storeFile(MultipartFile file, String password, String custName, String custEmail, String custAccountNumber, String custId) throws IOException {
        //uploading file as per it's type
        switch (checkValidFileType(file)) {
            case "pdf":
                return fileDbRepo.save(uploadPDF(file, password));
            case "xlsx":
                return fileDbRepo.save(uploadExcel(file, custName, custEmail, custAccountNumber, custId));
            case "xls":
                return fileDbRepo.save(uploadExcel(file, custName, custEmail, custAccountNumber, custId));
            default:
                return null;
        }
    }

    public String checkValidFileType(MultipartFile file) {
        String contentType = StringUtils.cleanPath(file.getContentType());
        switch (contentType) {
            case "application/pdf":
                return "pdf";
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return "xlsx";
            case "application/vnd.ms-excel":
                return "xls";
            default:
                return "Invalid File Type";
        }
    }

    private FileDB uploadPDF(MultipartFile file, String password) throws IOException {
        FileDB fileDB = new FileDB(StringUtils.cleanPath(file.getOriginalFilename()), file.getContentType(), file.getBytes());
        BSA_PDF_Service bsa_pdf_service = new BSA_PDF_Service();
        JsonNode jsonNode = bsa_pdf_service.extractToJSON(file, password);
        JsonObject jsonObject = new JsonObject(jsonNode.toString());
        Document document = new Document("data", jsonObject);
        fileDB.setExtracted_json(document);
        fileDB.setFilePassword(password);
        //setting cust info
        List<String> customerInfo = bsa_pdf_service.getCustInfo(file, password);
        fileDB.setCustomerName(customerInfo.get(0).isBlank() ? "NA" : customerInfo.get(0));
        fileDB.setCustomerAccountNumber(customerInfo.get(1).isBlank() ? "NA" : customerInfo.get(1));
        fileDB.setCustomerId(customerInfo.get(2).isBlank() ? "NA" : customerInfo.get(2));
        fileDB.setFromDate(customerInfo.get(3).isBlank() ? "NA" : customerInfo.get(3));
        fileDB.setToDate(customerInfo.get(4).isBlank() ? "NA" : customerInfo.get(4));
        return fileDB;
    }

    private FileDB uploadExcel(MultipartFile file, String custName, String custEmail, String custAccountNumber, String custId) throws IOException {
        FileDB fileDB = new FileDB(StringUtils.cleanPath(file.getOriginalFilename()), file.getContentType(), file.getBytes());
        BSA_Excel_Service bsa_excel_service = new BSA_Excel_Service();
        JsonNode jsonNode = bsa_excel_service.extractToJSON(file);
        JsonObject jsonObject = new JsonObject(jsonNode.toString());
        Document document = new Document("data", jsonObject);
        fileDB.setExtracted_json(document);
        fileDB.setCustomerName(custName.isBlank() ? "NA" : custName);
        fileDB.setCustomerEmailAddress(custEmail.isBlank() ? "NA" : custEmail);
        fileDB.setCustomerAccountNumber(custAccountNumber.isBlank() ? "NA" : custAccountNumber);
        fileDB.setCustomerId(custId.isBlank() ? "NA" : custId);
        return fileDB;
    }

    public FileDB findCustomerByCustomerId(String customerId) {
        return fileDbRepo.findFirstByCustomerId(customerId);
    }

    public FileDB findCustomerByCustomerEmailAddress(String customerEmailAddress) {
        return fileDbRepo.findFirstByCustomerEmailAddress(customerEmailAddress);
    }

    public FileDB findCustomerByCustomerAccountNumber(String customerAccountNumber) {
        return fileDbRepo.findFirstByCustomerAccountNumber(customerAccountNumber);
    }

}


//    public ResponseBalance getBalance(){
//        Query query = new Query();
//        query.fields().include("extracted_json");
//        query.addCriteria(Criteria.where("_id").is("ObjectId(\"632898ee74555d05082cbd94\")").andOperator(Criteria.where("extracted_json':data.Sheet.Particulars").is("CLOSING BALANCE")));
//        ResponseBalance responseBalance = mongoTemplate.findOne(query, ResponseBalance.class);
//        return responseBalance != null? responseBalance : null;
//    }