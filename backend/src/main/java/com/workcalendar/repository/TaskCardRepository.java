package com.workcalendar.repository;

import com.workcalendar.domain.TaskCard;
import com.workcalendar.repository.custom.TaskCardRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskCardRepository extends JpaRepository<TaskCard, Long>, TaskCardRepositoryCustom {

    // 업무카드 상세 조회
    Optional<TaskCard> findByIdAndDeletedAtIsNull(Long taskCardId);

}
