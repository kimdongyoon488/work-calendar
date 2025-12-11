package com.workcalendar.domain.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * 공통 엔티티
 */
@Getter
@MappedSuperclass
public abstract class BaseEntity {

    // 생성 시간
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 수정 시간
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 삭제 시간
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;


    /**
     * 공통 삭제
     */
    public void delete() {
        this.deletedAt = LocalDateTime.now();
    }


}
