import { apiClient } from "./apis";


export const initial_get_response = async (query) => {
    try {
        const response = await apiClient.post(`/respond`,{
            query : query
        });
        return [response.data.response, response.data.session_id];
    } catch(error) {
        console.error(error);
    }
};

export const session_get_response = async (query, sessionID) => {
    try {
        const response = await apiClient.post(`/respond`,{
            query: query,
            session_id: sessionID
        });
        return response.data.response;
    } catch (error) {
        console.error(error)
    }
}