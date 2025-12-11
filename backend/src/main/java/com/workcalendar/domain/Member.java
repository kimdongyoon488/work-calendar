package com.workcalendar.domain;

import com.workcalendar.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


/**
 * 회원 엔티티
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Member extends BaseEntity {


    // 회원 식별자(PK)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 아이디
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    // 비밀번호
    @Column(nullable = false, length = 255)
    private String password;

    // 이름
    @Column(nullable = false, length = 50)
    private String name;

    // 소속
    @Column(length = 100)
    private String department;

    // 우편번호
    @Column(length = 10)
    private String zipcode;

    // 기본주소
    @Column(length = 255)
    private String address1;

    // 상세주소
    @Column(length = 255)
    private String address2;
}
