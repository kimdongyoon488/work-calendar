package com.workcalendar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class ErrorDto {


    /**
     * 에러 응답 DTO
     */
    @Getter
    @AllArgsConstructor
    public static class ErrorResponse {
        private String errorMsg;
    }
}
