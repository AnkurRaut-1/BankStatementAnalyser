package com.example.bank_statement_analysis.model;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Extracted_JSON {
    //SAME AS THE BANK STATEMENT TABLE COLUMNS
    private String trans_Date;
    private long chequeNumber;
    private String particulars;
    private double debit;
    private double credit;
    private double balance;
    private long init_Br;
}
