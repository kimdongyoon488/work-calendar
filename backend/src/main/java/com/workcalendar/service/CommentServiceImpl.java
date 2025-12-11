package com.workcalendar.service;

import com.workcalendar.domain.Comment;
import com.workcalendar.domain.Member;
import com.workcalendar.domain.TaskCard;
import com.workcalendar.dto.CommentDto.*;
import com.workcalendar.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    private final TaskCardService taskCardService;
    private final MemberService memberService;


    /**
     * 댓글 등록
     */
    @Transactional
    public InsertCommentResponseDto insertComment(InsertCommentRequestDto insertCommentRequestDto) {

        // 업무 카드 존재 여부 체크
        TaskCard taskCard = taskCardService.checkTaskCardExists(insertCommentRequestDto.getTaskCardId());

        // 회원 식별자로 회원 존재 여부 체크
        Member member = memberService.checkMemberExists(insertCommentRequestDto.getMemberId());

        // 댓글 생성
        Comment comment = Comment.builder()
                .taskCard(taskCard)
                .member(member)
                .author(insertCommentRequestDto.getAuthor())
                .content(insertCommentRequestDto.getContent())
                .build();

        // 등록
        Comment saved = commentRepository.save(comment);

        return InsertCommentResponseDto.builder()
                .commentId(saved.getId())
                .build();

    }


    /**
     * 업무카드별 댓글 조회
     */
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getCommentsByTaskCardId(Long taskCardId) {

        // 조회
        List<Comment> comments = commentRepository.findByTaskCardIdAndDeletedAtIsNull(taskCardId);

        return comments.stream()
                .map(comment -> CommentResponseDto.builder()
                        .commentId(comment.getId())
                        .memberId(comment.getMember().getId())
                        .author(comment.getAuthor())
                        .content(comment.getContent())
                        .createdAt(comment.getCreatedAt())
                        .updatedAt(comment.getUpdatedAt())
                        .build()
                ).toList();
    }



    /**
     * 댓글 수정
     */
    @Transactional
    public UpdateCommentResponseDto updateComment(UpdateCommentRequestDto updateCommentRequestDto) {

        // 댓글 존재 여부 체크
        Comment comment = checkCommentExists(updateCommentRequestDto.getCommentId());

        /*
        if (!comment.getPassword().equals(updateCommentRequestDto.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        */

        // 수정
        comment.update(updateCommentRequestDto);

        return UpdateCommentResponseDto.builder()
                .commentId(comment.getId())
                .build();
    }


    /**
     * 댓글 삭제
     */
    @Transactional
    public DeleteCommentResponseDto deleteComment(DeleteCommentRequestDto deleteCommentRequestDto) {

        // 댓글 존재 여부 체크
        Comment comment = checkCommentExists(deleteCommentRequestDto.getCommentId());

        /*
        if (!comment.getPassword().equals(deleteCommentRequestDto.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        */

        // 삭제
        comment.delete();

        return DeleteCommentResponseDto.builder()
                .commentId(comment.getId())
                .build();
    }

    /**
     * 댓글 존재 여부 체크
     */
    public Comment checkCommentExists(Long commentId) {
        return commentRepository.findByIdAndDeletedAtIsNull(commentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 댓글이 존재하지 않습니다."));
    }

}
