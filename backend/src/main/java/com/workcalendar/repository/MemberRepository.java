package com.workcalendar.repository;

import com.workcalendar.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 회원 아이디로 회원 조회
    Optional<Member> findByUsernameAndDeletedAtIsNull(String username);

    // 회원 식별자로 회원 조회
    Optional<Member> findByIdAndDeletedAtIsNull(Long memberId);


}
