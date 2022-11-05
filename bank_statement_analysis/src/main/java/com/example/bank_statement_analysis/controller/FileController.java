package com.example.bank_statement_analysis.controller;

import com.example.bank_statement_analysis.model.FileDB;
import com.example.bank_statement_analysis.response.ResponseMessage;
import com.example.bank_statement_analysis.service.BSA_AnalyseData_service;
import com.example.bank_statement_analysis.service.FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spire.pdf.PdfDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class FileController {
    @Autowired
    private FileStorageService storageService;
    private Logger logger = LoggerFactory.getLogger(FileController.class);

    @PostMapping("/upload")
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam String password, @RequestParam String custName, @RequestParam String custEmail, @RequestParam String custAccountNumber, @RequestParam String custId) {
        ResponseMessage responseMessage = new ResponseMessage();
        //verifying the type of file and whether file needs password
        String fileType = storageService.checkValidFileType(file);
        switch (fileType) {
            case "pdf":
                try {
                    //sending the password to PdfDocument , if file needs password, then it will throw the exception
                    PdfDocument pdf = new PdfDocument(file.getInputStream(), password);
                    logger.info("Pages Found" + pdf.getPages().getCount());
                } catch (Exception e) {
                    if (password.isBlank()) {
                        logger.error("Need password to extract the file data.");
                        responseMessage.setMessage("The file is password protected. \nPlease provide the password.");
                    } else {
                        logger.error("Incorrect Password.");
                        responseMessage.setMessage("You've entered Incorrect Password.");
                    }
                    return ResponseEntity.status(HttpStatus.OK).body(responseMessage);
                }
                break;
            case "xlsx":
                break;
            case "xls":
                break;
            default:
                logger.error("Invalid File.");
                responseMessage.setMessage("Invalid File. (Only PDF/Execl is allowed)");
                return ResponseEntity.status(HttpStatus.OK).body(responseMessage);
        }
        BSA_AnalyseData_service bsa_analyseData_service = new BSA_AnalyseData_service();
        try {
            logger.info("Uploading the file: " + file.getOriginalFilename());
            FileDB fileDB = storageService.storeFile(file, password, custName, custEmail, custAccountNumber, custId);
            logger.info("Uploaded the file successfully: " + file.getOriginalFilename());
            responseMessage.setMessage("Uploaded the file successfully: " + file.getOriginalFilename());
            responseMessage.setBsa_report(bsa_analyseData_service.createReport(fileDB));
            return ResponseEntity.status(HttpStatus.OK).body(responseMessage);
        } catch (Exception e) {
            logger.error("Could not upload the file: " + file.getOriginalFilename() + "!");
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(responseMessage);
        }
    }

    @GetMapping("/searchByAccountNumber/{customerAccountNumber}")
    public ResponseEntity<ResponseMessage> getCustomerAccountNumber(@PathVariable String customerAccountNumber) {
        ResponseMessage responseMessage = new ResponseMessage();
        BSA_AnalyseData_service bsa_analyseData_service = new BSA_AnalyseData_service();
        logger.info("Searching Customer with Account Number: " + customerAccountNumber);
        try {
            FileDB fileDB = storageService.findCustomerByCustomerAccountNumber(customerAccountNumber);
            if (fileDB != null) {
                responseMessage.setBsa_report(bsa_analyseData_service.createReport(fileDB));
                responseMessage.setMessage("Found: " + customerAccountNumber);
                logger.info("Customer Found with Account Number: " + customerAccountNumber);
            } else {
                responseMessage.setMessage("No customer found with Account Number : " + customerAccountNumber);
                logger.warn("No customer found with Account Number : " + customerAccountNumber);
            }
            return ResponseEntity.status(HttpStatus.OK).body(responseMessage);
        } catch (Exception e) {
            responseMessage.setMessage("Could not search the customer: " + customerAccountNumber + "!");
            logger.error("Could not search the customer: " + customerAccountNumber + "!");
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(responseMessage);
        }
    }

    @GetMapping("/searchByEmail/{customerEmailAddress}")
    public ResponseEntity<ResponseMessage> getCustomerByEmail(@PathVariable String customerEmailAddress) {
        ResponseMessage responseMessage = new ResponseMessage();
        BSA_AnalyseData_service bsa_analyseData_service = new BSA_AnalyseData_service();
        logger.info("Searching Customer with E-Mail Address: " + customerEmailAddress);
        try {
            FileDB fileDB = storageService.findCustomerByCustomerEmailAddress(customerEmailAddress);
            if (fileDB != null) {
                responseMessage.setBsa_report(bsa_analyseData_service.createReport(fileDB));
                responseMessage.setMessage("Found: " + customerEmailAddress);
                logger.info("Customer Found with E-Mail Address: " + customerEmailAddress);
            } else {
                responseMessage.setMessage("No customer found with E-mail Address : " + customerEmailAddress);
                logger.warn("No customer found with E-mail Address : " + customerEmailAddress);
            }
            return ResponseEntity.status(HttpStatus.OK).body(responseMessage);
        } catch (Exception e) {
            responseMessage.setMessage("Could not search the customer: " + customerEmailAddress + "!");
            logger.error("Could not search the customer: " + customerEmailAddress + "!");
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(responseMessage);
        }
    }

    @GetMapping("/searchById/{customerId}")
    public ResponseEntity<ResponseMessage> getCustomerById(@PathVariable String customerId) {
        ResponseMessage responseMessage = new ResponseMessage();
        BSA_AnalyseData_service bsa_analyseData_service = new BSA_AnalyseData_service();
        logger.info("Searching Customer with Customer ID: " + customerId);
        try {
            FileDB fileDB = storageService.findCustomerByCustomerId(customerId);
            if (fileDB != null) {
                responseMessage.setBsa_report(bsa_analyseData_service.createReport(fileDB));
                responseMessage.setMessage("Found: " + customerId);
                logger.info("Customer Found with Customer ID: " + customerId, new ObjectMapper().writeValueAsString(responseMessage));
            } else {
                responseMessage.setMessage("No customer found with ID : " + customerId);
                logger.warn("No customer found with ID : " + customerId);
            }
            return ResponseEntity.status(HttpStatus.OK).body(responseMessage);
        } catch (Exception e) {
            logger.warn("Could not search the customer: " + customerId + "!");
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(responseMessage);
        }
    }

    @GetMapping("/msg")
    public String getMsg() {
        return "Working";
    }
}
