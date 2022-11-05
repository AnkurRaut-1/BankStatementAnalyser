package com.example.bank_statement_analysis.response;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
//FOR FUTURE UPDATE (retrieving uploaded files)
public class ResponseFile {
    private String name;
    private String url;
    private String type;
    private long size;
}
