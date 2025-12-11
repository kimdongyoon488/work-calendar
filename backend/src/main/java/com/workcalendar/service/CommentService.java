package com.workcalendar.service;

import com.workcalendar.domain.Comment;
import com.workcalendar.domain.Member;
import com.workcalendar.dto.CommentDto.*;

import java.util.List;

public interface CommentService {

    // 댓글 등록
    InsertCommentResponseDto insertComment(InsertCommentRequestDto insertCommentRequestDto);

    // 업무카드별 댓글 조회
    List<CommentResponseDto> getCommentsByTaskCardId(Long taskCardId);

    // 댓글 수정
    UpdateCommentResponseDto updateComment(UpdateCommentRequestDto updateCommentRequestDto);

    // 댓글 삭제
    DeleteCommentResponseDto deleteComment(DeleteCommentRequestDto deleteCommentRequestDto);

    // 댓글 존재 여부 체크
    Comment checkCommentExists(Long commentId);
}