package com.workcalendar.domain;

import com.workcalendar.domain.common.BaseEntity;
import com.workcalendar.dto.TaskCardDto;
import com.workcalendar.dto.TaskCardDto.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


/**
 * 업무카드 엔티티
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TaskCard extends BaseEntity {

    // 업무카드 식별자(PK)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 회원 ID (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 업무 날짜
    @Column(nullable = false)
    private LocalDate date;

    // 요청자
    @Column(nullable = false)
    private String requester;

    // 대상자
    @Column(nullable = false)
    private String receiver;

    // 업무 제목
    @Column(nullable = false)
    private String title;

    // 업무 내용
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // 댓글
    @OneToMany(mappedBy = "taskCard", cascade = CascadeType.ALL, orphanRemoval = false)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();



    /**
     * 업무카드 수정
     */
    public void update(UpdateTaskCardRequestDto updateTaskCardRequestDto) {

        this.requester = updateTaskCardRequestDto.getRequester();
        this.receiver = updateTaskCardRequestDto.getReceiver();
        this.title = updateTaskCardRequestDto.getTitle();
        this.content = updateTaskCardRequestDto.getContent();
    }
}
