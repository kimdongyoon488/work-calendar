
import React, { useEffect, useState } from 'react';
import './taskCardModal.css';
import { getMember } from '../api/memberApi';

export default function TaskCardCreateModal({
                                                open,
                                                defaultDate,
                                                onClose,
                                                onSubmit,
                                            }) {
    // 로그인 사용자 정보 { id, name }
    const [member, setMember] = useState(null);

    // 입력 폼 상태
    const [form, setForm] = useState({
        date: defaultDate || '',
        requester: '',  // 로그인 사용자 이름
        receiver: '',
        title: '',
        content: '',
    });

    // 예상 못한 에러 → ErrorBoundary로 전달
    const [errForBoundary, setErrForBoundary] = useState(null);
    if (errForBoundary) throw errForBoundary;


    /**
     * 모달 열릴 때:
     * - 요청자(requester)를 로그인 사용자 이름으로 세팅
     */
    useEffect(() => {
        if (!open) return;

        (async () => {
            try {
                const user = await getMember(); // 로그인된 사용자 조회
                setMember(user);

                setForm({
                    date: defaultDate || '',
                    requester: user?.name ?? '',
                    receiver: '',
                    title: '',
                    content: '',
                });
            } catch (err) {
                console.error(err);
                const msg = err?.response?.data?.errorMsg;
                if (msg) return alert(`회원 조회 실패: ${msg}`);

                // 예상 못한 에러 → ErrorBoundary로 전달
                setErrForBoundary(new Error("signup: unexpected error"));
            }
        })();
    }, [open, defaultDate]);

    if (!open) return null;

    /** 공통 입력 핸들러 */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * 폼 제출
     * - 필수값 검증
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        const labels = {
            date: '업무 날짜',
            requester: '요청자',
            receiver: '대상자',
            title: '업무 제목',
            content: '업무 내용',
        };

        // 필수값 비어있는 항목 검사
        const emptyKeys = Object.keys(labels).filter(
            (key) => !form[key]?.trim()
        );

        if (emptyKeys.length) {
            alert(`${emptyKeys.map((k) => labels[k]).join(', ')}을(를) 입력하세요.`);
            return;
        }

        if (!member?.id) {
            alert('로그인 사용자 정보를 불러오지 못했습니다.');
            return;
        }

        onSubmit({ ...form, memberId: member.id });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-panel"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()} // 배경 클릭 방지
            >
                <div className="modal-header">
                    <h2>업무카드 등록</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>

                    <div className="form-row">
                        <label>업무 날짜</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="two-col">
                        <div className="form-row">
                            <label>요청자</label>
                            <input
                                type="text"
                                name="requester"
                                value={form.requester}
                                onChange={handleChange}
                                readOnly // 로그인 사용자 이름 고정
                            />
                        </div>

                        <div className="form-row">
                            <label>대상자</label>
                            <input
                                type="text"
                                name="receiver"
                                placeholder="김철수"
                                value={form.receiver}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <label>업무 제목</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="회의 준비"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label>업무 내용</label>
                        <textarea
                            name="content"
                            rows={4}
                            placeholder="세부 업무 내용을 입력하세요"
                            value={form.content}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            취소
                        </button>
                        <button type="submit" className="btn-primary">
                            등록
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
