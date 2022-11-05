package com.example.bank_statement_analysis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class BSA_Excel_Service {
    private Logger logger = LoggerFactory.getLogger(BSA_Excel_Service.class);
    private ObjectMapper mapper = new ObjectMapper();

    public JsonNode extractToJSON(MultipartFile excelMF) throws IOException {
        File excel = convert(excelMF);
        ObjectNode excelData = mapper.createObjectNode();
        FileInputStream fis = null;
        Workbook workbook = null;
        try {
            logger.info("Extracting data from Excel Sheet to JSON Format.");
            // Creating file input stream
            fis = new FileInputStream(excel);
            String filename = excelMF.getOriginalFilename().toLowerCase();
            if (filename.endsWith(".xls") || filename.endsWith(".xlsx")) {
                // creating workbook object based on excel file format
                if (filename.endsWith(".xls")) {
                    workbook = new HSSFWorkbook(fis);
                } else {
                    workbook = new XSSFWorkbook(fis);
                }
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
            } else {
                logger.warn("File format not supported.");
                throw new IllegalArgumentException("File format not supported.");
            }
        } catch (Exception e) {
            logger.error("Extraction Failed.");
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

    public File convert(MultipartFile multipartFile) throws IOException {
        File file = new File(this.getClass().getResourceAsStream("/File.tmp").toString());
        try (OutputStream os = new FileOutputStream(file)) {
            logger.info("Processing the Excel file...");
            os.write(multipartFile.getBytes());
        } catch (Exception e) {
            logger.error("Processing Failed.");
        }
        return file;
    }

}
