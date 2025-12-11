package com.workcalendar.repository.custom;

import com.workcalendar.domain.TaskCard;

import java.time.LocalDate;
import java.util.List;

public interface TaskCardRepositoryCustom {

    // 월별 업무카드 조회
    List<TaskCard> findByDateBetween(LocalDate startDate, LocalDate endDate);

}