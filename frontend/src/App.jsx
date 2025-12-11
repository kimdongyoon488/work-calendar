import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CalendarView from "./components/CalendarView";
import TaskCardDetailPage from "./pages/TaskCardDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { getMember } from "./api/memberApi";
import ErrorBoundary from "./components/ErrorBoundary";


/**
 * 로그인 여부 확인 후 보호 라우트를 렌더링
 */
function RequireAuth({ children }) {
    const [isAuth, setIsAuth] = React.useState(null); // null = 로딩 상태

    React.useEffect(() => {
        (async () => {
            try {
                await getMember(); // 세션 확인 API
                setIsAuth(true);
            } catch {
                setIsAuth(false);
            }
        })();
    }, []);

    if (isAuth === null) {
        return <div style={{ padding: 24 }}>로딩중…</div>;
    }

    // 로그인 실패 → 로그인 페이지로 강제 이동
    if (!isAuth) return <Navigate to="/login" replace />;

    // 로그인 성공 → 보호 페이지 렌더링
    return children;
}

export default function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>

                    {/** 기본 URL 접근 시 /login 으로 강제 이동 */}
                    <Route index element={<Navigate to="/login" replace />} />

                    {/** 로그인 페이지 */}
                    <Route path="/login" element={<LoginPage />} />

                    {/** 보호 라우트(로그인 필요) */}
                    <Route
                        path="/calendar"
                        element={
                            <RequireAuth>
                                <CalendarView />
                            </RequireAuth>
                        }
                    />

                    {/** 업무카드 상세 페이지(로그인 필요) */}
                    <Route
                        path="/task-cards/:taskCardId"
                        element={
                            <RequireAuth>
                                <TaskCardDetailPage />
                            </RequireAuth>
                        }
                    />

                    {/** 존재하지 않는 모든 경로는 /login으로 이동 */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
}
