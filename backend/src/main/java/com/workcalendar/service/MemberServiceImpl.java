package com.workcalendar.service;

import com.workcalendar.domain.Member;
import com.workcalendar.dto.MemberDto.*;
import com.workcalendar.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {


    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    /**
     * 회원가입
     */
    @Transactional
    public SignupResponseDto signup(SignupRequestDto signupRequestDto) {

        // 회원 아이디로 회원 존재 여부 체크
        memberRepository.findByUsernameAndDeletedAtIsNull(signupRequestDto.getUsername())
                .ifPresent(member -> {
                    throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
                });

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signupRequestDto.getPassword());

        Member member = Member.builder()
                .username(signupRequestDto.getUsername())
                .password(encodedPassword)
                .name(signupRequestDto.getName())
                .department(signupRequestDto.getDepartment())
                .zipcode(signupRequestDto.getZipcode())
                .address1(signupRequestDto.getAddress1())
                .address2(signupRequestDto.getAddress2())
                .build();

        Member saved = memberRepository.save(member);

        return SignupResponseDto.builder()
                .memberId(saved.getId())
                .build();
    }

    /**
     * 로그인
     */
    @Override
    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        Member member = memberRepository.findByUsernameAndDeletedAtIsNull(loginRequestDto.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("로그인 정보가 올바르지 않습니다."));

        if (!passwordEncoder.matches(loginRequestDto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("로그인 정보가 올바르지 않습니다.");
        }

        return LoginResponseDto.builder()
                .memberId(member.getId())
                .build();
    }


    /**
     * 회원 정보 조회
     */
    @Transactional(readOnly = true)
    public MemberInfoResponseDto getMember(Long memberId) {

        // 회원 식별자로 회원 존재 여부 체크
        Member member = checkMemberExists(memberId);

        return MemberInfoResponseDto.builder()
                .id(member.getId())
                .username(member.getUsername())
                .name(member.getName())
                .department(member.getDepartment())
                .zipcode(member.getZipcode())
                .address1(member.getAddress1())
                .address2(member.getAddress2())
                .build();
    }


    /**
     * 회원 식별자로 회원 존재 여부 체크
     */
    public Member checkMemberExists(Long memberId) {
        return memberRepository.findByIdAndDeletedAtIsNull(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 회원이 존재하지 않습니다."));
    }

}
