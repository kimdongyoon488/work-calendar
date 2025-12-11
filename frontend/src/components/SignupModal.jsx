import React, { useState } from "react";
import Postcode from "react-daum-postcode";
import "./taskCardModal.css";

export default function SignupModal({ open, onClose }) {

    // 입력값 상태
    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        phone: "",
        department: "",
        zip: "",
        addr1: "",
        addr2: ""
    });

    // 모달·주소·로딩 상태
    const [showAddr, setShowAddr] = useState(false);
    const [loading, setLoading] = useState(false);

    // 예상 못한 에러 → ErrorBoundary로 전달
    const [errForBoundary, setErrForBoundary] = useState(null);
    if (errForBoundary) throw errForBoundary;

    if (!open) return null;

    /** 입력 필드 공통 핸들러 */
    const onChangeField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    /** 주소 검색 완료 시 값 설정 */
    const handleComplete = (data) => {
        let full = data.address;
        let extra = "";

        // 도로명 주소 타입일 때만 추가 정보 포함
        if (data.addressType === "R") {
            if (data.bname) extra += data.bname;
            if (data.buildingName) extra += (extra ? ", " : "") + data.buildingName;
            if (extra) full += " " + extra;
        }

        onChangeField("zip", data.zonecode);
        onChangeField("addr1", full);
        setShowAddr(false);
    };

    /** 필수 입력값 체크 */
    const validate = () => {
        const required = [
            ["아이디", form.username],
            ["비밀번호", form.password],
            ["이름", form.name],
            ["부서", form.department],
            ["우편번호", form.zip],
            ["기본주소", form.addr1],
        ];

        for (const [label, val] of required) {
            if (!String(val).trim()) {
                alert(`${label}를 입력하세요.`);
                return false;
            }
        }
        return true;
    };

    /** 회원가입 요청 */
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);

            const res = await fetch("/api/members/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                    name: form.name,
                    phone: form.phone,
                    department: form.department,
                    zipcode: form.zip,
                    address1: form.addr1,
                    address2: form.addr2
                }),
            });

            if (!res.ok) throw new Error("signup fail");

            alert("가입 완료");
            onClose?.();

        } catch (err) {
            console.error(err);

            const msg = err?.response?.data?.errorMsg;
            if (msg) return alert(`가입 실패: ${msg}`);

            // 예상 못한 에러 → ErrorBoundary로 전달
            setErrForBoundary(new Error("signup: unexpected error"));

        } finally {
            setLoading(false);
        }
    };

    /** 모달 배경 스타일 */
    const backdropStyle = {
        position: "fixed",
        inset: 0,
        zIndex: 50,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 24
    };

    return (
        <div className="modal-backdrop" style={backdropStyle}>
            <div className="modal-card" style={{ width: 560, maxWidth: "95%" }}>
                <div className="modal-header">
                    <h2 className="page-title" style={{ fontSize: 20 }}>회원가입</h2>
                    <button className="btn-icon" onClick={onClose}>✕</button>
                </div>

                {/* 회원가입 폼 */}
                <form className="modal-form" onSubmit={onSubmit}>
                    <div className="two-col">
                        <div className="form-row">
                            <label>아이디</label>
                            <input
                                value={form.username}
                                onChange={(e) => onChangeField("username", e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label>비밀번호</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => onChangeField("password", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="two-col">
                        <div className="form-row">
                            <label>이름</label>
                            <input
                                value={form.name}
                                onChange={(e) => onChangeField("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label>전화번호</label>
                            <input
                                value={form.phone}
                                onChange={(e) => onChangeField("phone", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <label>부서</label>
                        <input
                            value={form.department}
                            onChange={(e) => onChangeField("department", e.target.value)}
                            placeholder="예) 개발팀"
                            required
                        />
                    </div>

                    <div className="two-col">
                        <div className="form-row">
                            <label>우편번호</label>
                            <input
                                value={form.zip}
                                onChange={(e) => onChangeField("zip", e.target.value)}
                                placeholder="-"
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label>&nbsp;</label>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setShowAddr(true)}
                            >
                                주소 찾기
                            </button>
                        </div>
                    </div>

                    <div className="form-row">
                        <label>기본주소</label>
                        <input
                            value={form.addr1}
                            onChange={(e) => onChangeField("addr1", e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>상세주소</label>
                        <input
                            value={form.addr2}
                            onChange={(e) => onChangeField("addr2", e.target.value)}
                            placeholder="동/호수 등"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                            취소
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "처리 중..." : "가입"}
                        </button>
                    </div>
                </form>
            </div>

            {/* 주소 검색 모달 */}
            {showAddr && (
                <div className="modal-backdrop" style={{ ...backdropStyle, zIndex: 70 }}>
                    <div className="modal-card" style={{ width: 600, padding: 0 }}>
                        <div className="modal-header" style={{ padding: "10px 12px" }}>
                            <strong>주소 검색</strong>
                            <button className="btn-icon" onClick={() => setShowAddr(false)}>✕</button>
                        </div>
                        <div style={{ height: 520 }}>
                            <Postcode
                                style={{ width: "100%", height: "100%" }}
                                onComplete={handleComplete}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
