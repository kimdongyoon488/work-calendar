import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../components/taskCardModal.css";

import {
    fetchTaskCard,
    updateTaskCard,
    deleteTaskCard
} from '../api/taskCardApi';

import {
    fetchComments,
    createComment,
    deleteComment
} from '../api/commentApi';

import { getMember } from '../api/memberApi';

// 날짜 포맷 변환 (ISO → "YYYY-MM-DD HH:mm")
function formatDateTime(s) {
    if (!s) return '';
    const d = new Date(s);
    if (isNaN(d)) return s;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
    ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
        d.getMinutes()
    ).padStart(2, '0')}`;
}

export default function TaskCardDetailPage() {
    const { taskCardId } = useParams();
    const navigate = useNavigate();

    const [member, setMember] = useState(null);        // 로그인 사용자 정보
    const [ownerId, setOwnerId] = useState(null);      // 카드 작성자 ID (수정/삭제 권한 판단용)

    const [loading, setLoading] = useState(false);

    // 업무카드 수정 폼 상태
    const [form, setForm] = useState({
        date: '',
        requester: '',
        receiver: '',
        title: '',
        content: ''
    });

    // ---------------------- 댓글 상태 ----------------------
    const [comments, setComments] = useState([]);
    const [cContent, setCContent] = useState('');

    const [page, setPage] = useState(1);
    const pageSize = 5;

    // 전체 댓글 수 기준 페이지 수 계산
    const pageCount = useMemo(
        () => Math.max(1, Math.ceil((comments?.length ?? 0) / pageSize)),
        [comments]
    );

    // 현재 페이지의 댓글 목록
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return comments.slice(start, start + pageSize);
    }, [comments, page]);

    // 현재 로그인한 사용자가 카드 작성자인지 확인
    const isOwner = member?.id && ownerId && member.id === ownerId;

    // 예측 못 한 오류는 ErrorBoundary로 넘김
    const [errForBoundary, setErrForBoundary] = useState(null);
    if (errForBoundary) throw errForBoundary;

    /**
     * 업무카드 상세 + 댓글 목록 로딩
     */
    async function loadDetailAndComments(id) {
        setLoading(true);
        try {
            const card = await fetchTaskCard(id);
            setOwnerId(card?.memberId ?? null);

            // 카드 정보 세팅
            setForm({
                date: card?.date ?? '',
                requester: card?.requester ?? '',
                receiver: card?.receiver ?? '',
                title: card?.title ?? '',
                content: card?.content ?? ''
            });

            // 댓글 로딩
            const list = await fetchComments(id);
            setComments(Array.isArray(list) ? list : []);
            setPage(1);
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.errorMsg;
            if (msg) {
                alert(`조회 실패: ${msg}`);
                return;
            }
            setErrForBoundary(
                err instanceof Error ? err : new Error('loadDetailAndComments: unexpected error')
            );
        } finally {
            setLoading(false);
        }
    }

    // 로그인 사용자 정보 로딩
    useEffect(() => {
        (async () => {
            try {
                const m = await getMember();
                setMember(m);
            } catch {
                setMember(null);
            }
        })();
    }, []);

    // 카드 ID 변경 시 상세 정보 로딩
    useEffect(() => {
        if (!taskCardId) return;
        loadDetailAndComments(taskCardId);
    }, [taskCardId]);

    // input 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // ---------------------- 카드 수정 ----------------------
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!isOwner) return alert('수정 권한이 없습니다.');

        try {
            setLoading(true);

            const payload = {
                requester: form.requester,
                receiver: form.receiver,
                title: form.title,
                content: form.content
            };

            const res = await updateTaskCard(taskCardId, payload);

            alert(`수정 완료 (ID: ${res?.taskCardId ?? taskCardId})`);
            navigate(-1);
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.errorMsg;
            if (msg) return alert(`수정 실패: ${msg}`);

            setErrForBoundary(
                err instanceof Error ? err : new Error('updateTaskCard: unexpected error')
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------------- 카드 삭제 ----------------------
    const handleDeleteClick = async () => {
        if (!isOwner) return alert('삭제 권한이 없습니다.');
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            setLoading(true);
            await deleteTaskCard(taskCardId);
            alert('삭제 완료');
            navigate(-1);
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.errorMsg;
            if (msg) return alert(`삭제 실패: ${msg}`);

            setErrForBoundary(
                err instanceof Error ? err : new Error('deleteTaskCard: unexpected error')
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------------- 댓글 등록 ----------------------
    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!member?.id) return alert('로그인 정보가 없습니다.');
        if (!cContent.trim()) return alert('댓글 내용을 입력하세요.');

        try {
            setLoading(true);

            await createComment({
                taskCardId: Number(taskCardId),
                author: member.name,
                memberId: member.id,
                content: cContent.trim()
            });

            setCContent('');
            const list = await fetchComments(taskCardId);
            setComments(list);
            setPage(1);
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.errorMsg;
            if (msg) return alert(`댓글 등록 실패: ${msg}`);

            setErrForBoundary(
                err instanceof Error ? err : new Error('createComment: unexpected error')
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------------- 댓글 삭제 ----------------------
    const handleDeleteComment = async (c) => {
        // 본인이 작성한 댓글만 삭제 가능
        if (member?.id !== c.memberId) return;

        try {
            setLoading(true);

            await deleteComment(c.commentId);

            // 새 목록 로딩
            const list = await fetchComments(taskCardId);
            setComments(list);

            // 마지막 페이지 → 댓글 삭제로 페이지 줄어든 경우 대비
            const newPageCount = Math.max(1, Math.ceil(list.length / pageSize));
            setPage((prev) => Math.min(prev, newPageCount));
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.errorMsg;
            if (msg) return alert(`댓글 삭제 실패: ${msg}`);

            setErrForBoundary(
                err instanceof Error ? err : new Error('deleteComment: unexpected error')
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------------- UI ----------------------
    return (
        <div className="page-wrap">
            <div className="calendar-container">

                {/* ---------------- 상단 헤더 ---------------- */}
                <div className="page-header">
                    <h3 className="page-title">업무카드 상세</h3>
                    <button className="btn-secondary" onClick={() => navigate(-1)} disabled={loading}>
                        뒤로
                    </button>
                </div>

                {/* ---------------- 카드 수정 폼 ---------------- */}
                <form className="modal-form" onSubmit={handleUpdate}>
                    <div className="form-row">
                        <label>업무 날짜</label>
                        <input type="date" name="date" value={form.date} disabled />
                    </div>

                    <div className="two-col">
                        <div className="form-row">
                            <label>요청자</label>
                            <input type="text" name="requester" value={form.requester} readOnly />
                        </div>

                        <div className="form-row">
                            <label>대상자</label>
                            <input
                                type="text"
                                name="receiver"
                                value={form.receiver}
                                onChange={handleChange}
                                disabled={!isOwner}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <label>업무 제목</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            disabled={!isOwner}
                        />
                    </div>

                    <div className="form-row">
                        <label>업무 내용</label>
                        <textarea
                            name="content"
                            rows={6}
                            value={form.content}
                            onChange={handleChange}
                            disabled={!isOwner}
                        />
                    </div>

                    {/* 작성자일 때만 수정/삭제 버튼 노출 */}
                    {isOwner && (
                        <div className="modal-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                수정
                            </button>
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={handleDeleteClick}
                                disabled={loading}
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </form>

                {/* ---------------- 댓글 영역 ---------------- */}
                <div style={{ marginTop: 32 }}>
                    <h2 className="page-title" style={{ fontSize: 18, marginBottom: 12 }}>
                        댓글
                    </h2>

                    {/* 댓글 등록창 */}
                    <form className="modal-form" onSubmit={handleCreateComment}>
                        <div className="two-col">
                            <div className="form-row">
                                <label>작성자</label>
                                <input value={member?.name ?? ''} readOnly />
                            </div>
                            <div className="form-row">
                                <label>작성자 ID</label>
                                <input value={member?.username ?? ''} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <label>댓글 내용</label>
                            <textarea
                                rows={3}
                                value={cContent}
                                onChange={(e) => setCContent(e.target.value)}
                                placeholder="댓글을 입력하세요"
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading || !member?.id}
                            >
                                등록
                            </button>
                        </div>
                    </form>

                    {/* 댓글 목록 */}
                    <div style={{ marginTop: 12 }}>
                        {pageItems.length === 0 ? (
                            <div style={{ padding: 8, color: '#777' }}>등록된 댓글이 없습니다.</div>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {pageItems.map((c) => (
                                    <li
                                        key={c.commentId}
                                        style={{
                                            border: '1px solid #2e2e2e',
                                            borderRadius: 8,
                                            padding: 12,
                                            marginBottom: 8,
                                            background: '#1b1b1b',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <strong>{c.author || '익명'}</strong>
                                            <small style={{ color: '#aaa' }}>
                                                {formatDateTime(c.updatedAt || c.createdAt)}
                                            </small>
                                        </div>

                                        <div style={{ marginBottom: 8, whiteSpace: 'pre-wrap' }}>
                                            {c.content}
                                        </div>

                                        {/* 본인 댓글일 때만 삭제 가능 */}
                                        {member?.id === c.memberId && (
                                            <div style={{ textAlign: 'right' }}>
                                                <button
                                                    type="button"
                                                    className="btn-danger"
                                                    onClick={() => handleDeleteComment(c)}
                                                    disabled={loading}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* 페이지네이션 */}
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                            >
                                이전
                            </button>
                            <span style={{ lineHeight: '32px' }}>
                                {page} / {pageCount}
                            </span>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                                disabled={page >= pageCount}
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
