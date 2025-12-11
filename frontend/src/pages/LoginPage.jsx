import React, { useState } from "react";
import { login } from "../api/memberApi";
import SignupModal from "../components/SignupModal";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [openSignup, setOpenSignup] = useState(false);

    // 예상 못한 에러 → ErrorBoundary로 전달
    const [errForBoundary, setErrForBoundary] = useState(null);
    if (errForBoundary) throw errForBoundary;


    /**
     * 로그인 요청
     */
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ username, password });
            alert("로그인 성공");
            location.replace("/calendar");
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.errorMsg;
            if (msg) return alert(`로그인 실패: ${msg}`);

            // 예상 못한 에러 → ErrorBoundary로 전달
            setErrForBoundary(new Error("signup: unexpected error"));
        }
    };

    const inputStyle = {
        width: "100%",
        height: 44,
        fontSize: 16,
        padding: "0 12px",
        borderRadius: 10,
    };


    const cardStyle = {
        width: "100%",
        maxWidth: 560,
        background: "#1c1c1c",
        border: "1px solid #2a2a2a",
        borderRadius: 14,
        boxShadow: "0 14px 36px rgba(0,0,0,.45)",
        padding: 32,
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                padding: 32,
            }}
        >
            <div style={cardStyle}>
                <h1
                    style={{
                        margin: "0 0 28px",
                        fontSize: 28,
                        fontWeight: 800,
                        textAlign: "center",
                        letterSpacing: 0.3,
                    }}
                >
                    로그인
                </h1>

                <form onSubmit={onSubmit} style={{ fontSize: 16 }}>
                    {/* 아이디 입력 */}
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", marginBottom: 8, opacity: 0.9 }}>
                            아이디
                        </label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", marginBottom: 8, opacity: 0.9 }}>
                            비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    {/* 로그인 / 회원가입 버튼 */}
                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "space-between",
                        }}
                    >
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ flex: 1, height: 46, fontSize: 16, borderRadius: 10 }}
                        >
                            로그인
                        </button>

                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ flex: 1, height: 46, fontSize: 16, borderRadius: 10 }}
                            onClick={() => setOpenSignup(true)}
                        >
                            회원가입
                        </button>
                    </div>
                </form>
            </div>

            {/* 회원가입 모달 */}
            <SignupModal open={openSignup} onClose={() => setOpenSignup(false)} />
        </div>
    );
}
