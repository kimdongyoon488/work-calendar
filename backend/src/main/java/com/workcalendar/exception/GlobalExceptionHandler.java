package com.workcalendar.exception;

import com.workcalendar.dto.ErrorDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 전역 예외 처리 핸들러
 */
@RestControllerAdvice
public class GlobalExceptionHandler {


    /**
     * 잘못된 요청 값 발생 시 에러 처리 (ex) 이미 존재하는 아이디로 회원가입 시도)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity
                .badRequest()
                .body(new ErrorDto.ErrorResponse(e.getMessage()));
    }
}
