import React from "react";

/**
 * 전역 에러 처리 컴포넌트
 */
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    /**
     * 렌더 중 에러 발생 시 호출
     */
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    /**
     * 에러 정보 확인
     */
    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            const err = this.state.error;

            // 상세 에러 노출
            const isDev = import.meta.env?.MODE !== "production";

            return (
                <div
                    style={{
                        minHeight: "100vh",
                        display: "grid",
                        placeItems: "center",
                        background: "#111",
                        color: "#eee",
                        padding: 24,
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: 640,
                            background: "#1b1b1b",
                            border: "1px solid #2a2a2a",
                            borderRadius: 12,
                            padding: 24,
                            boxShadow: "0 14px 36px rgba(0,0,0,.45)",
                        }}
                    >
                        <h1 style={{ marginTop: 0, marginBottom: 12 }}>
                            문제가 발생했습니다
                        </h1>

                        <p style={{ opacity: 0.85, marginTop: 0 }}>
                            일시적인 오류이거나 알 수 없는 예외입니다.
                        </p>

                        {/* 개발 모드에서만 에러 상세 노출 */}
                        {isDev && (
                            <pre
                                style={{
                                    whiteSpace: "pre-wrap",
                                    overflowX: "auto",
                                    background: "#111",
                                    padding: 12,
                                    borderRadius: 8,
                                    border: "1px solid #2a2a2a",
                                }}
                            >
                                {String(err?.message || err?.toString() || "")}
                            </pre>
                        )}

                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                justifyContent: "flex-end",
                                marginTop: 16,
                            }}
                        >
                            <button
                                className="btn-primary"
                                onClick={() => (window.location.href = "/calendar")}
                            >
                                메인으로
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
