package com.workcalendar.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

public class MemberDto {


    /**
     * 회원가입 요청 Dto
     */
    @Data
    @NoArgsConstructor
    public static class SignupRequestDto {
        private String username;
        private String password;
        private String name;
        private String department;
        private String zipcode;
        private String address1;
        private String address2;
    }

    /**
     * 회원가입 응답 Dto
     */
    @Data
    @NoArgsConstructor
    public static class SignupResponseDto {
        private Long memberId;

        @Builder
        public SignupResponseDto(Long memberId) {
            this.memberId = memberId;
        }
    }

    /**
     * 로그인 요청 Dto
     */
    @Data
    @NoArgsConstructor
    public static class LoginRequestDto {
        private String username;
        private String password;
    }

    /**
     * 로그인 응답 Dto
     */
    @Data
    @NoArgsConstructor
    public static class LoginResponseDto {
        private Long memberId;

        @Builder
        public LoginResponseDto(Long memberId) {
            this.memberId = memberId;

        }
    }

    /**
     * 회원 정보 조회 응답 Dto
     */
    @Data
    @NoArgsConstructor
    public static class MemberInfoResponseDto {
        private Long id;
        private String username;
        private String name;
        private String department;
        private String zipcode;
        private String address1;
        private String address2;

        @Builder
        public MemberInfoResponseDto(Long id, String username, String name, String department, String zipcode, String address1, String address2) {
            this.id = id;
            this.username = username;
            this.name = name;
            this.department = department;
            this.zipcode = zipcode;
            this.address1 = address1;
            this.address2 = address2;
        }
    }
}
