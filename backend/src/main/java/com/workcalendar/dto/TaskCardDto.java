package com.workcalendar.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskCardDto {


    /**
     * 업무카드 등록 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class InsertTaskCardRequestDto {

        private Long memberId;
        private LocalDate date;
        private String requester;
        private String receiver;
        private String title;
        private String content;
    }


    /**
     * 업무카드 등록 응답 DTO
     */
    @Data
    @NoArgsConstructor
    public static class InsertTaskCardResponseDto {

        private Long taskCardId;

        @Builder
        public InsertTaskCardResponseDto(Long taskCardId) {
            this.taskCardId = taskCardId;
        }
    }


    /**
     * 업무카드 상세 조회 응답 DTO
     */
    @Data
    @NoArgsConstructor
    public static class TaskCardDetailResponseDto {

        private Long taskCardId;
        private Long memberId;
        private LocalDate date;
        private String requester;
        private String receiver;
        private String title;
        private String content;

        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime deletedAt;


        @Builder
        public TaskCardDetailResponseDto(Long taskCardId, Long memberId, LocalDate date, String requester, String receiver,
                                         String title, String content,
                                         LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt) {

            this.taskCardId = taskCardId;
            this.memberId = memberId;
            this.date = date;
            this.requester = requester;
            this.receiver = receiver;
            this.title = title;
            this.content = content;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
            this.deletedAt = deletedAt;
        }
    }


    /**
     * 월별 업무카드 조회 응답 DTO
     */
    @Data
    @NoArgsConstructor
    public static class TaskCardMonthlyDto {

        private Long taskCardId;
        private Long memberId;
        private LocalDate date;
        private String receiver;
        private String title;


        @Builder
        public TaskCardMonthlyDto(Long taskCardId, Long memberId, LocalDate date, String receiver, String title) {
            this.taskCardId = taskCardId;
            this.memberId = memberId;
            this.date = date;
            this.receiver = receiver;
            this.title = title;

        }
    }


    /**
     * 업무카드 수정 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class UpdateTaskCardRequestDto {

        private Long taskCardId;
        private String requester;
        private String receiver;
        private String title;
        private String content;

    }


    /**
     * 업무카드 수정 응답 DTO
     */
    @Data
    @NoArgsConstructor
    public static class UpdateTaskCardResponseDto {

        private Long taskCardId ;

        @Builder
        public UpdateTaskCardResponseDto(Long taskCardId ) {
            this.taskCardId  = taskCardId ;
        }
    }

    /**
     * 업무카드 삭제 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class DeleteTaskCardRequestDto {

        private Long taskCardId ;

        @Builder
        public DeleteTaskCardRequestDto(Long taskCardId) {
            this.taskCardId = taskCardId;
        }
    }



    /**
     * 업무카드 삭제 응답 DTO
     */
    @Data
    @NoArgsConstructor
    public static class DeleteTaskCardResponseDto {

        private Long taskCardId;

        @Builder
        public DeleteTaskCardResponseDto(Long taskCardId) {
            this.taskCardId = taskCardId;
        }
    }

}
