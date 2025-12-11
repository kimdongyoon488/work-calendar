import axios from "axios";

/**
 * 월별 업무카드 조회
 */
export async function fetchMonthlyTaskCards(year, month) {
    const { data } = await axios.get("/api/task-cards", {
        params: { year, month },
    });
    return data;
}

/**
 * 업무카드 생성
 */
export async function createTaskCard(payload) {
    const { data } = await axios.post("/api/task-cards", payload);
    return data;
}

/**
 * 업무카드 상세 조회
 */
export async function fetchTaskCard(taskCardId) {
    const { data } = await axios.get(`/api/task-cards/${taskCardId}`);
    return data;
}

/**
 * 업무카드 수정
 */
export async function updateTaskCard(taskCardId, payload) {
    const { data } = await axios.put(`/api/task-cards/${taskCardId}`, payload);
    return data;
}

/**
 * 업무카드 삭제
 */
export async function deleteTaskCard(taskCardId) {
    const { data } = await axios.delete(`/api/task-cards/${taskCardId}`);
    return data;
}
