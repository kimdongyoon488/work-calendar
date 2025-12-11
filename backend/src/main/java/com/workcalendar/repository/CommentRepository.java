package com.workcalendar.repository;

import com.workcalendar.domain.Comment;
import com.workcalendar.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 업무카드별 댓글 조회
    List<Comment> findByTaskCardIdAndDeletedAtIsNull(Long taskCardId);

    // 식별자로 댓글 조회
    Optional<Comment> findByIdAndDeletedAtIsNull(Long commentId);

}
