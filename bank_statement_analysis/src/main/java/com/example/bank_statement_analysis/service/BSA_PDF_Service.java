package com.example.bank_statement_analysis.service;

import com.spire.pdf.PdfDocument;
import com.spire.pdf.utilities.PdfTable;
import com.spire.pdf.utilities.PdfTableExtractor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class BSA_PDF_Service {
    private ObjectMapper mapper = new ObjectMapper();

    private Logger logger = LoggerFactory.getLogger(BSA_PDF_Service.class);

    public HSSFWorkbook createExcelFile(MultipartFile pdf_file, String password) throws IOException {
        //REMOVE PASSWORD AND CREATE NEW FILE TO PASS
        PdfDocument pdf = new PdfDocument(pdf_file.getInputStream(), password);
        logger.info("Processing file...");
        int num_of_pages = pdf.getPages().getCount();
        logger.info("Number of pages found: " + num_of_pages);
        PdfTableExtractor extractor = new PdfTableExtractor(pdf);
        HSSFWorkbook wb = new HSSFWorkbook();
        String sheetName = "Sheet";
        HSSFSheet sheet = wb.createSheet(sheetName);
        HSSFRow row;
        int rowNumAnk = 0;
        for (int pageIndex = 0; pageIndex < num_of_pages; pageIndex++) {
            PdfTable[] pdfTablesAnk = null;
            try {
                pdfTablesAnk = extractor.extractTable(pageIndex);
            } catch (Exception e) {
                logger.error("\n\nerror caught in extracting the dataTable>>>>\n" + e);
            }
            if (pdfTablesAnk != null && pdfTablesAnk.length > 0) {
                for (PdfTable table : pdfTablesAnk) {
                    for (int rowNum = 0; rowNum < table.getRowCount(); rowNum++, rowNumAnk++) {
                        row = sheet.createRow(rowNumAnk);
                        //Loop through the columns in the current table
                        for (int colNum = 0; colNum < table.getColumnCount(); colNum++) {
                            //Extract data from the current table cell
                            String text = table.getText(rowNum, colNum).trim().replaceAll("\n", " ");
                            //Insert data into a specific cell
                            row.createCell(colNum).setCellValue(text);
                            sheet.autoSizeColumn(colNum);
                        }
                    }
                }
            }
        }
        wb.close();
        logger.info("Excel sheet has been generated successfully.");
        return wb;
    }

    public File convert(MultipartFile multipartFile, String password) throws IOException {
        File file = new File(this.getClass().getResourceAsStream("/File.tmp").toString());
        try (OutputStream os = new FileOutputStream(file)) {
            os.write(multipartFile.getBytes());
            logger.info("Converting PDF file <TABLES> to Excel Sheet");
        } catch (Exception e) {
            logger.error("Conversion of PDF to Excel is FAILED");
        }
        return file;
    }

    public JsonNode extractToJSON(MultipartFile pdf_file, String password) throws IOException {
        HSSFWorkbook workbook = createExcelFile(pdf_file, password);       //creating tmp excel file
        File excel = convert(pdf_file, password);
        ObjectNode excelData = mapper.createObjectNode();
        FileInputStream fis = null;
        try {
            // Creating file input stream
            fis = new FileInputStream(excel);
            logger.info("Extracting the data into JSON format.");
            // Reading each sheet one by one
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                Sheet sheet = workbook.getSheetAt(i);
                String sheetName = sheet.getSheetName();
                List<String> headers = new ArrayList<String>();
                ArrayNode sheetData = mapper.createArrayNode();
                // Reading each row of the sheet
                for (int j = 0; j <= sheet.getLastRowNum(); j++) {
                    Row row = sheet.getRow(j);
                    if (j == 0) {
                        // reading sheet header's name
                        for (int k = 0; k < row.getLastCellNum(); k++) {
                            headers.add(row.getCell(k).getStringCellValue());
                        }
                    } else {
                        // reading work sheet data
                        ObjectNode rowData = mapper.createObjectNode();
                        for (int k = 0; k < headers.size(); k++) {
                            Cell cell = row.getCell(k);
                            String headerName = headers.get(k);
                            if (cell != null) {
                                switch (cell.getCellType()) {
                                    case FORMULA:
                                        rowData.put(headerName, cell.getCellFormula());
                                        break;
                                    case BOOLEAN:
                                        rowData.put(headerName, cell.getBooleanCellValue());
                                        break;
                                    case NUMERIC:
                                        rowData.put(headerName, cell.getNumericCellValue());
                                        break;
                                    case BLANK:
                                        rowData.put(headerName, "");
                                        break;
                                    default:
                                        rowData.put(headerName, cell.getStringCellValue());
                                        break;
                                }
                            } else {
                                rowData.put(headerName, "");
                            }
                        }
                        sheetData.add(rowData);
                    }
                }
                excelData.set(sheetName, sheetData);
            }
            logger.info("Extraction Completed.");
            return excelData;
        } catch (Exception e) {
            logger.error("Extraction of data into JSON format is FAILED.");
            e.printStackTrace();
        } finally {
            if (workbook != null) {
                try {
                    workbook.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public List<String> getCustInfo(MultipartFile mpfile, String password) throws IOException {
        File file;
        String[] customer_data_lines;
        String fromDate, toDate;
        String name = null, acc_num = null, custId = null;
        if (password.length() >= 8 || !password.isBlank()) {
            logger.info("Removing the password from pdf file");
            File fileCopy = convert(mpfile, password);
            PDDocument pdd = PDDocument.load(fileCopy, password);
            pdd.setAllSecurityToBeRemoved(true);
            logger.info("Password removal done");
            pdd.save(fileCopy);
            pdd.close();
            file = fileCopy;
        } else {
            file = convert(mpfile, password);
        }
        List<String> custInfo = new ArrayList<>();
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(PDDocument.load(file));
        customer_data_lines = text.substring(0, text.indexOf("Tran")).split(System.getProperty("line.separator"));
        name = getAccountHolderName(customer_data_lines);
        acc_num = getAccountNumber(customer_data_lines);
        custId = getCustomerID(customer_data_lines);
        fromDate = getFromToDate(customer_data_lines).get(0);
        toDate = getFromToDate(customer_data_lines).get(1);
        custInfo.add(name);
        custInfo.add(acc_num);
        custInfo.add(custId);
        custInfo.add(fromDate);
        custInfo.add(toDate);
        return custInfo;
    }

    private String getAccountHolderName(String[] dataLines) {
        return dataLines[1];
    }

    private String getAccountNumber(String[] dataLines) {
        String acc_num = "", acc_numSentence = null;
        ArrayList<String> acc_numSentenceWords = new ArrayList<>();
        for (String line : dataLines) {
            if (line.contains("Account No")) {
                acc_numSentence = line;  //storing line in variable
            }
        }
        for (String word : acc_numSentence.split("\\s+")) {
            acc_numSentenceWords.add(word);  //creating array of string by spaces
        }
        for (String word : acc_numSentenceWords) {
            if (word.contains(":") && word.split(":").length > 0) {
                acc_num = word.split(":")[1];
            }
        }
        return acc_num;
    }

    private String getCustomerID(String[] dataLines) {
        String custId = "", custIdSentence = null;
        ArrayList<String> custIdSentenceWords = new ArrayList<>();
        for (String line : dataLines) {
            if (line.contains("Customer No")) {
                custIdSentence = line;  //storing line in variable
            }
        }
        for (String word : custIdSentence.split("\\s+")) {
            custIdSentenceWords.add(word);  //creating array of string by spaces
        }
        for (String word : custIdSentenceWords) {
            if (word.contains(":")) {
                custId = word.split(":")[1];
            }
        }
        return custId;
    }

    private ArrayList<String> getFromToDate(String[] dataLines) {
        String dateSentence = null;
        ArrayList<String> dateSentenceWords = new ArrayList<>();
        for (String line : dataLines) {
            if (line.contains("(From") && line.contains("To")) {
                dateSentence = line;  //storing line in variable
            }
        }
        String dateStringInBrackets = dateSentence.substring(dateSentence.indexOf('('), dateSentence.indexOf(')'));
        for (String word : dateStringInBrackets.split("\\s+")) {
            if (word.matches("^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$")) {
                dateSentenceWords.add(word);  //creating array of string by spaces
            }
        }
        return dateSentenceWords;
    }

}
