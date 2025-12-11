package com.workcalendar.domain;

import com.workcalendar.domain.common.BaseEntity;
import com.workcalendar.dto.CommentDto.*;
import jakarta.persistence.*;
import lombok.*;


/**
 * 댓글 엔티티
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Comment extends BaseEntity {

    // 댓글 식별자(PK)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 업무카드 ID (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_card_id", nullable = false)
    private TaskCard taskCard;

    // 회원 ID (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 작성자
    @Column(nullable = false)
    private String author;

    // 댓글 내용
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;



    /**
     * 댓글 수정
     */
    public void update(UpdateCommentRequestDto updateCommentRequestDto) {

        this.content = updateCommentRequestDto.getContent();
    }


}
