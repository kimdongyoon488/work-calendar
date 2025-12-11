import axios from "axios";


/**
 * 회원 가입
 */
export async function signup(payload) {
    const { data } = await axios.post("/api/members/signup", payload);
    return data;
}

/**
 * 로그인
 */
export async function login(payload) {
    const { data } = await axios.post("/api/members/login", payload, {
        withCredentials: true,
    });
    return data;
}

/**
 * 로그아웃
 */
export async function logout() {
    await axios.post("/api/members/logout", null, { withCredentials: true });
}

/**
 * 회원 정보 조회
 */
export async function getMember() {
    const { data } = await axios.get("/api/members/member", {
        withCredentials: true,
    });
    return data; //
}
