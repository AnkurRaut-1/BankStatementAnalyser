package com.example.bank_statement_analysis.response;

import com.example.bank_statement_analysis.model.BSA_Report;
import lombok.*;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMessage {
    private String message;
    private BSA_Report bsa_report;
}
