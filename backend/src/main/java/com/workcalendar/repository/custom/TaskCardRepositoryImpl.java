
package com.workcalendar.repository.custom;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.workcalendar.domain.QTaskCard;
import com.workcalendar.domain.TaskCard;
import com.workcalendar.dto.TaskCardDto;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class TaskCardRepositoryImpl implements TaskCardRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    // JPAQueryFactory 초기화
    public TaskCardRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }


    /**
     * 월별 업무카드 조회
     */
    @Override
    public List<TaskCard> findByDateBetween(LocalDate startDate, LocalDate endDate) {

        // QueryDSL용 객체 생성
        QTaskCard taskCard = QTaskCard.taskCard;

        return queryFactory
                .selectFrom(taskCard)
                .where(
                        taskCard.date.between(startDate, endDate),
                        taskCard.deletedAt.isNull()
                )
                .fetch();
    }
}
