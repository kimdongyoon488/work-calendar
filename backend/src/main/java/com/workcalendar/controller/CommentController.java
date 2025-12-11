package com.workcalendar.controller;

import com.workcalendar.dto.CommentDto.*;
import com.workcalendar.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;


    /**
     * 댓글 등록
     */
    @PostMapping
    public ResponseEntity<InsertCommentResponseDto> insertComment(
            @RequestBody InsertCommentRequestDto insertCommentRequestDto
    ) {
        InsertCommentResponseDto response = commentService.insertComment(insertCommentRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * 업무카드별 댓글 조회
     */
    @GetMapping("/{taskCardId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByTaskCard(
            @PathVariable Long taskCardId
    ) {
        List<CommentResponseDto> response = commentService.getCommentsByTaskCardId(taskCardId);
        return ResponseEntity.ok(response);
    }


    /**
     * 댓글 수정
     */
    @PutMapping("/{commentId}")
    public ResponseEntity<UpdateCommentResponseDto> updateComment(
            @PathVariable Long commentId,
            @RequestBody UpdateCommentRequestDto updateCommentRequestDto
    ) {
        updateCommentRequestDto.setCommentId(commentId);
        UpdateCommentResponseDto response = commentService.updateComment(updateCommentRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * 댓글 삭제
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<DeleteCommentResponseDto> deleteComment(
            @PathVariable Long commentId
    ) {
        DeleteCommentRequestDto deleteCommentRequestDto = DeleteCommentRequestDto.builder()
                .commentId(commentId)
                .build();

        DeleteCommentResponseDto response = commentService.deleteComment(deleteCommentRequestDto);

        return ResponseEntity.ok(response);
    }

}
