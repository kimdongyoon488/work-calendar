package com.workcalendar.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class CommentDto {

    /**
     * 댓글 등록 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class InsertCommentRequestDto {

        private Long taskCardId;
        private Long memberId;
        private String author;
        private String content;

    }

    /**
     * 댓글 등록 응답 DTO
     */
    @Data
    @NoArgsConstructor
    public static class InsertCommentResponseDto {

        private Long commentId;

        @Builder
        public InsertCommentResponseDto(Long commentId) {
            this.commentId = commentId;
        }
    }

    /**
     * 업무카드별 댓글 조회 응답 DTO
     */
    @Data
    @NoArgsConstructor
    public static class CommentResponseDto {

        private Long commentId;
        private Long memberId;
        private String author;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime deletedAt;

        @Builder
        public CommentResponseDto(Long commentId, Long memberId, String author, String content, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt) {
            this.commentId = commentId;
            this.memberId = memberId;
            this.author = author;
            this.content = content;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
            this.deletedAt = deletedAt;
        }
    }

    /**
     * 댓글 수정 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class UpdateCommentRequestDto {

        private Long commentId;
        private String content;

    }

    /**
     * 댓글 수정 응답 DTO
     */
    @Data
    @NoArgsConstructor
    public static class UpdateCommentResponseDto {

        private Long commentId;

        @Builder
        public UpdateCommentResponseDto(Long commentId) {
            this.commentId = commentId;
        }
    }

    /**
     * 댓글 삭제 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class DeleteCommentRequestDto {

        private Long commentId;

        @Builder
        public DeleteCommentRequestDto(Long commentId) {
            this.commentId = commentId;
        }
    }

    /**
     * 댓글 삭제 응답 DTO
     */
    @Data
    @NoArgsConstructor
    public static class DeleteCommentResponseDto {

        private Long commentId;

        @Builder
        public DeleteCommentResponseDto(Long commentId) {
            this.commentId = commentId;
        }
    }


}
