package com.workcalendar.service;

import com.workcalendar.domain.TaskCard;
import com.workcalendar.dto.TaskCardDto.*;

import java.util.List;

public interface TaskCardService {

    // 업무카드 등록
    InsertTaskCardResponseDto insertTaskCard(InsertTaskCardRequestDto insertTaskCardRequestDto);

    // 업무카드 상세 조회
    TaskCardDetailResponseDto getTaskCard(Long taskCardId);

    // 월별 업무카드 조회
    List<TaskCardMonthlyDto> getTaskCardsByMonth(int year, int month);

    // 업무카드 수정
    UpdateTaskCardResponseDto updateTaskCard(UpdateTaskCardRequestDto updateTaskCardRequestDto);

    // 업무카드 삭제
    DeleteTaskCardResponseDto deleteTaskCard(DeleteTaskCardRequestDto deleteTaskCardRequestDto);

    // 업무카드 존재 여부 체크
    TaskCard checkTaskCardExists(Long taskCardId);

}
