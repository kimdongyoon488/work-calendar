package com.workcalendar.service;

import com.workcalendar.domain.Member;
import com.workcalendar.domain.TaskCard;
import com.workcalendar.dto.TaskCardDto.*;
import com.workcalendar.repository.TaskCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskCardServiceImpl implements TaskCardService {

    private final TaskCardRepository taskCardRepository;

    private final MemberService memberService;



    /**
     * 업무카드 등록
     */
    @Transactional
    public InsertTaskCardResponseDto insertTaskCard(InsertTaskCardRequestDto insertTaskCardRequestDto) {


        // 회원 식별자로 회원 존재 여부 체크
        Member member = memberService.checkMemberExists(insertTaskCardRequestDto.getMemberId());


        // 업무카드 생성
        TaskCard taskCard = TaskCard.builder()
                .member(member)
                .date(insertTaskCardRequestDto.getDate())
                .requester(insertTaskCardRequestDto.getRequester())
                .receiver(insertTaskCardRequestDto.getReceiver())
                .title(insertTaskCardRequestDto.getTitle())
                .content(insertTaskCardRequestDto.getContent())
                .build();

        // 등록
        TaskCard saved = taskCardRepository.save(taskCard);

        return InsertTaskCardResponseDto.builder()
                .taskCardId(saved.getId())
                .build();
    }

    /**
     * 업무카드 상세 조회
     */
    @Transactional(readOnly = true)
    public TaskCardDetailResponseDto getTaskCard(Long taskCardId) {

        // 업무카드 존재 여부 체크
        TaskCard taskCard = checkTaskCardExists(taskCardId);

        return TaskCardDetailResponseDto.builder()
                .taskCardId(taskCard.getId())
                .memberId(taskCard.getMember().getId())
                .date(taskCard.getDate())
                .requester(taskCard.getRequester())
                .receiver(taskCard.getReceiver())
                .title(taskCard.getTitle())
                .content(taskCard.getContent())
                .createdAt(taskCard.getCreatedAt())
                .updatedAt(taskCard.getUpdatedAt())
                .build();
    }

    /**
     * 월별 업무카드 조회
     */
    @Transactional(readOnly = true)
    public List<TaskCardMonthlyDto> getTaskCardsByMonth(int year, int month) {


        // 해당 월의 시작일 및 종료일 계산
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<TaskCard> taskCards = taskCardRepository.findByDateBetween(start, end);

        return taskCards.stream()
                .map(taskCard -> TaskCardMonthlyDto.builder()
                        .taskCardId(taskCard.getId())
                        .memberId(taskCard.getMember().getId())
                        .date(taskCard.getDate())
                        .title(taskCard.getTitle())
                        .receiver(taskCard.getReceiver())
                        .build()
                )
                .toList();
    }


    /**
     * 업무카드 수정
     */
    @Transactional
    public UpdateTaskCardResponseDto updateTaskCard(UpdateTaskCardRequestDto updateTaskCardRequestDto) {

        // 업무카드 존재 여부 체크
        TaskCard taskCard = checkTaskCardExists(updateTaskCardRequestDto.getTaskCardId());

        /*
        if (!taskCard.getPassword().equals(updateTaskCardRequestDto.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        */

        // 수정
        taskCard.update(updateTaskCardRequestDto);

        return UpdateTaskCardResponseDto.builder()
                .taskCardId(taskCard.getId())
                .build();
    }


    /**
     * 업무카드 삭제
     */
    @Transactional
    public DeleteTaskCardResponseDto deleteTaskCard(DeleteTaskCardRequestDto deleteTaskCardRequestDto) {

        // 업무카드 존재 여부 체크
        TaskCard taskCard = checkTaskCardExists(deleteTaskCardRequestDto.getTaskCardId());


        /*
        if (!taskCard.getPassword().equals(deleteTaskCardRequestDto.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        */

        // 삭제
        taskCard.delete();

        return DeleteTaskCardResponseDto.builder()
                .taskCardId(deleteTaskCardRequestDto.getTaskCardId())
                .build();
    }


    /**
     * 업무카드 존재 여부 체크
     */
    public TaskCard checkTaskCardExists(Long taskCardId) {
        return taskCardRepository.findByIdAndDeletedAtIsNull(taskCardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 카드가 존재하지 않습니다."));
    }


}
