
import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import { fetchMonthlyTaskCards, createTaskCard } from '../api/taskCardApi';
import TaskCardCreateModal from './TaskCardCreateModal';
import { useNavigate } from 'react-router-dom';

// 날짜를 YYYY-MM-DD 문자열로 변환
function toYMD(date) {
    return date.toISOString().split('T')[0];
}

export default function CalendarView() {
    const [activeMonth, setActiveMonth] = useState(new Date());
    const [byDate, setByDate] = useState({});                   // 날짜별 카드 목록
    const [createOpen, setCreateOpen] = useState(false);   // 생성 모달 상태
    const [createDate, setCreateDate] = useState('');       // 모달에서 사용할 날짜

    // 예측 불가능한 에러 → ErrorBoundary 에게 넘김
    const [errForBoundary, setErrForBoundary] = useState(null);
    if (errForBoundary) throw errForBoundary;

    const navigate = useNavigate();

    const year = activeMonth.getFullYear();
    const month = activeMonth.getMonth() + 1;

    // 연도 선택 옵션
    const yearOptions = useMemo(() => {
        const now = new Date().getFullYear();
        return Array.from({ length: 11 }, (_, i) => now - 5 + i);
    }, []);


    /**
     * 특정 월의 업무카드 데이터들을 날짜별로 묶기
     */
    async function loadMonth(dateObj, ctx = { cancelled: false }) {
        const y = dateObj.getFullYear();
        const m = dateObj.getMonth() + 1;

        try {
            const list = await fetchMonthlyTaskCards(y, m);

            // 날짜별로 카드 배열을 매핑
            const grouped = {};
            for (const item of list || []) {
                if (!grouped[item.date]) grouped[item.date] = [];
                grouped[item.date].push(item);
            }

            if (!ctx.cancelled) setByDate(grouped);
        } catch (err) {
            console.error(err);

            // 서버에서 전달한 에러 메시지 처리
            const msg = err?.response?.data?.errorMsg;
            if (msg) return alert(`월별 업무카드 조회 실패: ${msg}`);

            // 그 외 예상 못한 에러는 ErrorBoundary 로 넘김
            setErrForBoundary(new Error('loadMonth: unexpected error'));
        }
    }

    /**
     * 월 변경될 때마다 자동으로 재조회
     */
    useEffect(() => {
        let cancelled = false;

        (async () => {
            await loadMonth(new Date(year, month - 1, 1), { cancelled });
        })();

        return () => (cancelled = true);
    }, [year, month]);


    /**
     * 달력 날짜 칸에 들어갈 내용 렌더링
     */
    const tileContent = ({ date, view }) => {
        if (view !== 'month') return null;
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month) return null;

        const key = toYMD(date);
        const cards = byDate[key] || [];

        return (
            <div className="cell-content">
                {/* 날짜내 카드 리스트 */}
                <div
                    className="task-list"
                    style={{ maxHeight: 96, overflowY: 'auto' }}
                    onWheel={(e) => e.stopPropagation()} // 스크롤 버블링 방지
                >
                    {cards.map((card) => (
                        <div
                            key={card.taskCardId}
                            className="task-card"
                            title={`${card.title || '(제목 없음)'}${card.receiver ? ' · ' + card.receiver : ''}`}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/task-cards/${card.taskCardId}`);
                            }}
                            onKeyDown={(e) => {
                                if (['Enter', ' '].includes(e.key)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(`/task-cards/${card.taskCardId}`);
                                }
                            }}
                        >
                            <span className="task-title">{card.title || '(제목 없음)'}</span>
                            {card.receiver && (
                                <span className="task-receiver"> · {card.receiver}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* 업무카드 추가 버튼 */}
                <div
                    className="add-fab"
                    role="button"
                    tabIndex={0}
                    title="업무카드 추가"
                    onClick={(e) => {
                        e.stopPropagation();
                        setCreateDate(key);
                        setCreateOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (['Enter', ' '].includes(e.key)) {
                            e.preventDefault();
                            e.stopPropagation();
                            setCreateDate(key);
                            setCreateOpen(true);
                        }
                    }}
                >
                    +
                </div>
            </div>
        );
    };


    /**
     * 업무카드 생성
     */
    const handleCreate = async (payload) => {
        try {
            const res = await createTaskCard(payload);

            alert(
                res?.taskCardId
                    ? `업무카드 등록 완료 (ID: ${res.taskCardId})`
                    : '업무카드 등록 완료'
            );

            setCreateOpen(false);
            await loadMonth(new Date(year, month - 1, 1)); // 생성 후 재조회
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.errorMsg;
            if (msg) return alert(`업무카드 등록 실패: ${msg}`);

            setErrForBoundary(new Error('createTaskCard: unexpected error'));
        }
    };

    // 연/월 변경
    const onChangeYM = (y, m) => setActiveMonth(new Date(y, m - 1, 1));
    const activeStartDate = new Date(year, month - 1, 1);


    /**
     * 로그아웃 처리
     */
    const handleLogout = async () => {
        try {
            await fetch('/api/members/logout', { method: 'POST', credentials: 'include' });
        } catch (e) {
            console.warn(e);
        } finally {
            alert('로그아웃 되었습니다.');
            location.replace('/login');
        }
    };

    return (
        <div className="page-wrap">
            <div className="calendar-container">
                <div className="page-header" style={{ alignItems: 'center' }}>
                    <h1 className="page-title">업무 캘린더</h1>

                    {/* 상단: 연/월 선택 + 로그아웃 */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginLeft: 'auto' }}>
                        <div className="ym-controls">
                            <select value={year} onChange={(e) => onChangeYM(Number(e.target.value), month)}>
                                {yearOptions.map((y) => (
                                    <option key={y} value={y}>{y}년</option>
                                ))}
                            </select>

                            <select value={month} onChange={(e) => onChangeYM(year, Number(e.target.value))}>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>{m}월</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleLogout}
                            style={{ height: 36 }}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>

                <Calendar
                    locale="ko-KR"
                    showNeighboringMonth={false}
                    showNavigation={false}
                    prev2Label={null}
                    next2Label={null}
                    formatDay={(_, date) => date.getDate()}
                    tileContent={tileContent}
                    activeStartDate={activeStartDate}
                    onActiveStartDateChange={({ activeStartDate }) => {
                        setActiveMonth(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), 1));
                    }}
                />
            </div>

            {/* 업무카드 생성 모달 */}
            <TaskCardCreateModal
                open={createOpen}
                defaultDate={createDate}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
            />
        </div>
    );
}
