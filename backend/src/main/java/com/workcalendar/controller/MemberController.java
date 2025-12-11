package com.workcalendar.controller;

import com.workcalendar.dto.MemberDto.*;
import com.workcalendar.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;


    /**
     * 회원가입
     */
    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(
            @RequestBody SignupRequestDto signupRequestDto
    ) {
        SignupResponseDto response = memberService.signup(signupRequestDto);
        return ResponseEntity.ok(response);
    }


    /**
     * 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @RequestBody LoginRequestDto loginRequestDto,
            HttpSession session
    ) {
        LoginResponseDto response = memberService.login(loginRequestDto);

        // 세션 저장
        session.setAttribute("LOGIN_MEMBER_ID", response.getMemberId());

        return ResponseEntity.ok(response);
    }


    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }


    /**
     * 회원 정보 조회
     */
    @GetMapping("/member")
    public ResponseEntity<MemberInfoResponseDto> getMember(HttpSession session) {

        Long memberId = (Long) session.getAttribute("LOGIN_MEMBER_ID");

        if (memberId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        MemberInfoResponseDto response = memberService.getMember(memberId);

        return ResponseEntity.ok(response);

    }
}
