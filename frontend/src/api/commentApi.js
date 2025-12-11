import axios from "axios";


/**
 * 댓글 등록
 */
export async function createComment(payload) {
    const { data } = await axios.post("/api/comments", payload);
    return data;
}

/**
 * 업무카드별 댓글 조회
 */
export async function fetchComments(taskCardId) {
    const { data } = await axios.get(`/api/comments/${taskCardId}`);
    return data ?? [];
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId) {
    const { data } = await axios.delete(`/api/comments/${commentId}`);
    return data;
}
