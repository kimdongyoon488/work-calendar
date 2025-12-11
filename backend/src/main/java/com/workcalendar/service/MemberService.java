package com.workcalendar.service;

import com.workcalendar.domain.Member;
import com.workcalendar.dto.MemberDto.*;

public interface MemberService {

    // 회원가입
    SignupResponseDto signup(SignupRequestDto signupRequest);

    // 로그인
    LoginResponseDto login(LoginRequestDto loginRequest);

    // 회원 정보 조회
    MemberInfoResponseDto getMember(Long memberId);

    // 회원 식별자로 회원 존재 여부 체크
    Member checkMemberExists(Long memberId);

}
